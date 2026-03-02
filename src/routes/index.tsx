import {
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { IconInbox } from '~/components/icons/icon-inbox';
import {
  MediaModal,
  type MediaModalProps,
} from '~/components/media-modal/media-modal';
import { Message } from '~/components/message/message';
import { NewsChatWebsocketContext } from '~/lib/context/newsChatWebsocketContext';

export default component$(() => {
  const shouldScrollDown = useSignal(true);
  const isMediaModalOpen = useSignal(false);
  const mediaProperties = useStore<
    Pick<MediaModalProps, 'mediaUrl' | 'mediaType' | 'message'>
  >({
    mediaUrl: null,
    mediaType: null,
    message: null,
  });
  const { messages, areMessagesLoaded } = useContext(NewsChatWebsocketContext);
  const isAtBottom = useSignal(false);
  const bottomRef = useSignal<Element>();

  useVisibleTask$(({ cleanup, track }) => {
    const observer = new IntersectionObserver(([entry]) => {
      isAtBottom.value = entry.isIntersecting;
    });

    if (track(bottomRef) && bottomRef.value) {
      observer.observe(bottomRef.value);
    }
    cleanup(() => observer.disconnect());
  });

  useVisibleTask$(({ track }) => {
    if (
      (track(shouldScrollDown) || track(isAtBottom)) &&
      track(messages).length > 0
    ) {
      shouldScrollDown.value = false;
      const messagesContainer = document.getElementById('messages-container');

      if (messagesContainer) {
        if (isAtBottom.value) {
          setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }, 200);
        } else {
          setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }, 500);
        }
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
          <Message
            {...{ mediaProperties, message, isMediaModalOpen }}
            key={message.id}
          />
        ))}
        {messages.value.length > 0 && <div class="h-px" ref={bottomRef}></div>}
        {messages.value.length === 0 && areMessagesLoaded.value && (
          <div class="text-3xl w-full text-center opacity-70 my-auto">
            <IconInbox class="w-full h-50" />
            <p>אין הודעות עדיין..</p>
            <p class="text-lg opacity-50">יום שקט... מדי?</p>
          </div>
        )}
        {messages.value.length === 0 && !areMessagesLoaded.value && (
          <div class="text-3xl w-full text-center opacity-70 my-auto">
            <span class="loading loading-dots loading-xl"></span>
            <p>מתחברים..</p>
            <p class="text-lg opacity-50">אנחנו כבר שם!</p>
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
