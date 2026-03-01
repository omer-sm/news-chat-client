import {
  component$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { match, Pattern } from 'ts-pattern';
import { IconInbox } from '~/components/icons/icon-inbox';
import { MediaModal, MediaModalProps } from '~/components/media-modal/media-modal';
import { Message } from '~/components/message/message';
import {
  HistoryMessage,
  MessageContent,
  NewsMessage,
} from '~/lib/messages/messages.types';

export default component$(() => {
  const messages = useSignal<MessageContent[]>([]);
  const areMessagesLoaded = useSignal(false);
  const shouldScrollDown = useSignal(true);
  const isMediaModalOpen = useSignal(false);
  const mediaProperties = useStore<
    Pick<MediaModalProps, 'mediaUrl' | 'mediaType' | 'message'>
  >({
    mediaUrl: null,
    mediaType: null,
    message: null,
  });

  useVisibleTask$(
    ({ cleanup }) => {
      const ws = new WebSocket(
        'wss://s-gke-usc1-nssi4-34.firebaseio.com/.ws?v=5&ns=channel-2-news',
      );

      ws.onopen = (_event) => {
        ws.send(
          `{"t":"d","d":{"r":2,"a":"q","b":{"p":"/desk12","q":{"sp":${Date.now() - 1000 * 60 * 15},"i":"updatedDate/time"},"t":1,"h":""}}}`,
        );
      };

      ws.onmessage = (event) => {
        const messageData = JSON.parse(event.data) as NewsMessage;
        console.log(messageData);

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
                    (messageContent) => messageContent.reporter.reporter.topicID === 1,
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
              messages.value = [...messages.value, message.d.b.d as MessageContent];
            },
          )
          .otherwise(() => {
            console.log('No match', messageData);
          });

        console.log(messages.value);
      };

      const heartbeatInterval = setInterval(() => {
        ws.send('0');
      }, 40000);

      cleanup(() => {
        clearInterval(heartbeatInterval);
        ws.close();
      });
    },
    { strategy: 'document-ready' },
  );

  useVisibleTask$(({ track }) => {
    if (track(shouldScrollDown) && track(messages).length > 0) {
      shouldScrollDown.value = false;
      const messagesContainer = document.getElementById('messages-container');

      if (messagesContainer) {
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
      }
    }
  });

  useTask$(({ track }) => {
    track(messages).forEach((message) => {
      if (message.medias && Object.keys(message.medias).length > 1) {
        console.log('MORE THAN 1 MEDIA', message);
      }
    });
  });

  return (
    <div class="flex-1 overflow-y-auto">
      <MediaModal isOpen={isMediaModalOpen} {...mediaProperties} />
      <div
        id="messages-container"
        class="mx-2 lg:mx-[35%] flex flex-col gap-2 p-4 h-full overflow-y-auto scroll-smooth"
      >
        {messages.value.map((message) => (
          <Message {...{ mediaProperties, message, isMediaModalOpen }} />
        ))}
        {messages.value.length === 0 && areMessagesLoaded.value && (
          <div class="text-3xl w-full text-center opacity-70 my-auto">
            <IconInbox class="w-full h-50" />
            <p>אין הודעות עדיין..</p>
            <p class="text-lg opacity-50">יום שקט... מדי?</p>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "צ'אט הכתבים",
  meta: [
    {
      name: "צ'אט הכתבים",
      content: 'N12 news chat client',
    },
  ],
};
