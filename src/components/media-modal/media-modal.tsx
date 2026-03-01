import { component$, Signal, useVisibleTask$ } from '@builder.io/qwik';

export interface MediaModalProps {
  mediaUrl: string | null;
  mediaType: 'Image' | 'Video' | null;
  isOpen: Signal<boolean>;
  message: string | null;
}

export const MediaModal = component$<MediaModalProps>(
  ({ mediaUrl, mediaType, isOpen, message }) => {
    useVisibleTask$(({ track }) => {
      if (!track(isOpen)) {
        const videoPlayer = document.getElementById('modal-video');

        if (videoPlayer) {
          (videoPlayer as HTMLVideoElement).pause();
        }
      }
    });

    return (
      <dialog id="media-dialog" class="modal" open={isOpen.value}>
        <div class="modal-box pt-10 px-4" style={{ width: 'calc(11.5 / 12 * 100%)' }}>
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
              type="button"
              onClick$={() => {
                isOpen.value = false;
              }}
            >
              ✕
            </button>
          </form>
          {mediaType === 'Image' && <img src={mediaUrl ?? ''} class="w-full rounded" />}
          {mediaType === 'Video' && (
            <video
              id="modal-video"
              src={mediaUrl ?? ''}
              controls
              autoplay
              class="w-full rounded"
            ></video>
          )}
          <p class="py-2 opacity-80 text-sm">{message}</p>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button
            type="button"
            onClick$={() => {
              isOpen.value = false;
            }}
          >
            close
          </button>
        </form>
      </dialog>
    );
  },
);
