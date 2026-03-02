import {
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { Pattern, match } from 'ts-pattern';
import { NewsChatWebsocketContext } from '../context/newsChatWebsocketContext';
import type {
  HistoryMessage,
  MessageContent,
  NewsMessage,
} from '../messages/messages.types';

export const useProvideNewsChatWebsocket = (historyStartDiff: number) => {
  const messages = useSignal<MessageContent[]>([]);
  const areMessagesLoaded = useSignal(false);
  const isWsConnected = useSignal(false);

  useVisibleTask$(
    ({ cleanup }) => {
      let messagesBuffer = '';
      let messagesToBeBuffered = 0;
      const ws = new WebSocket(
        'wss://s-gke-usc1-nssi4-34.firebaseio.com/.ws?v=5&ns=channel-2-news',
      );

      ws.onopen = (_event) => {
        isWsConnected.value = true;
        ws.send(
          `{"t":"d","d":{"r":2,"a":"q","b":{"p":"/desk12","q":{"sp":${Date.now() - historyStartDiff},"i":"updatedDate/time"},"t":1,"h":""}}}`,
        );
      };

      ws.addEventListener('close', () => {
        isWsConnected.value = false;
      });

      ws.onmessage = (event) => {
        let eventData = event.data;

        if (messagesToBeBuffered > 0) {
          messagesBuffer += event.data;
          messagesToBeBuffered--;
          console.log(`Buffered message, ${messagesToBeBuffered} left`);

          if (messagesToBeBuffered === 0) {
            eventData = messagesBuffer;
          } else {
            return;
          }
        }

        const messageData = JSON.parse(eventData) as NewsMessage | number;
        console.log(messageData);

        if (typeof messageData === 'number') {
          messagesToBeBuffered = messageData;
          console.log(`buffering for ${messagesToBeBuffered} messages`);
        } else {
          match(messageData)
            // Connected
            .with({ t: 'c', d: { d: { v: '5' } } }, () => {
              if (!areMessagesLoaded.value) {
                setTimeout(() => {
                  areMessagesLoaded.value = true;
                }, 500);
              }
            })
            // Multiple messages
            .with(
              {
                t: 'd',
                d: {
                  b: {
                    d: Pattern.record(Pattern.string, {
                      messageID: Pattern.number,
                      reporter: {
                        reporter: {
                          topicID: Pattern.number,
                        },
                      },
                    }),
                  },
                },
              },
              (message: any) => {
                messages.value = [
                  ...messages.value,
                  ...Object.values((message as HistoryMessage).d.b.d)
                    .filter(
                      (messageContent) =>
                        messageContent.reporter.reporter.topicID === 1,
                    )
                    .sort((a, b) => a.updatedDate.time - b.updatedDate.time),
                ];
              },
            )
            // Single message
            .with(
              {
                t: 'd',
                d: {
                  b: {
                    d: {
                      messageID: Pattern.number,
                      reporter: {
                        reporter: {
                          topicID: 1,
                        },
                      },
                    },
                  },
                },
              },
              (message: any) => {
                messages.value = [
                  ...messages.value,
                  message.d.b.d as MessageContent,
                ];
              },
            )
            .otherwise(() => {
              console.log('No match', messageData);
            });

          console.log(messages.value);
        }
      };

      const heartbeatInterval = setInterval(() => {
        ws.send('0');
      }, 40000);

      cleanup(() => {
        isWsConnected.value = false;
        clearInterval(heartbeatInterval);
        ws.close();
      });
    },
    { strategy: 'document-ready' },
  );

  useContextProvider(NewsChatWebsocketContext, {
    messages,
    isWsConnected,
    areMessagesLoaded,
  });
};
