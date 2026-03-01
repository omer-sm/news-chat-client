import { component$, Signal } from '@builder.io/qwik';
import { MessageContent } from '~/lib/messages/messages.types';
import { zpad } from '~/lib/utils';
import { MediaModalProps } from '../media-modal/media-modal';
import { IconVideo } from '../icons/icon-video';

interface MessageProps {
  message: MessageContent;
  mediaProperties: Pick<MediaModalProps, 'mediaUrl' | 'mediaType' | 'message'>;
  isMediaModalOpen: Signal<boolean>;
}

export const Message = component$<MessageProps>(
  ({ isMediaModalOpen, mediaProperties, message }) => {
    return (
      <div
        role="alert"
        class={
          'alert alert-info alert-soft flex flex-col items-start gap-0 ' +
          (message.current || message.important ? 'border border-info/50' : '')
        }
      >
        <div class="flex justify-between w-full">
          <div class="text-md font-semibold flex items-center gap-3">
            <div class="avatar">
              <div class="h-7 rounded-full">
                <img src={message.reporter.reporter.image} />
              </div>
            </div>
            {message.reporter.reporter.name}
          </div>
          <div class="flex gap-1 items-center">
            {message.important && (
              <p class="badge badge-sm badge-error badge-soft opacity-80">חשוב!</p>
            )}
            {message.current && (
              <p class="badge badge-sm badge-success badge-soft opacity-80">עכשיו!</p>
            )}

            <p class="text-info/50 badge border-0 opacity-80">
              {zpad(`${message.updatedDate.hours}`, 2)}:
              {zpad(`${message.updatedDate.minutes}`, 2)}:
              {zpad(`${message.updatedDate.seconds}`, 2)}
            </p>
          </div>
        </div>

        <div class="divider mt-1 mb-0"></div>

        {(message.messageContent && message.messageContent.length > 0) ||
        !message.medias ? (
          <p>{message.messageContent}</p>
        ) : (
          <div class="w-full">
            <div class="relative">
              <img
                class="object-center object-cover w-full max-h-48 mx-auto rounded"
                onClick$={() => {
                  mediaProperties.mediaType =
                    message.medias!['0'].typeId === 1 ? 'Image' : 'Video';

                  mediaProperties.mediaUrl =
                    message.medias!['0'].link3 ??
                    message.medias!['0'].link2 ??
                    message.medias!['0'].link1;

                  mediaProperties.message = message.medias!['0'].mediaContent;

                  isMediaModalOpen.value = true;
                }}
                src={message.medias['0'].thumbnail ?? message.medias['0'].link2}
              />
              {message.medias!['0'].typeId === 2 && (
                <IconVideo class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-30 h-30 text-gray-500/50 pointer-events-none" />
              )}
            </div>
            <p class="py-1.5">{message.medias!['0'].mediaContent}</p>
          </div>
        )}
      </div>
    );
  },
);
