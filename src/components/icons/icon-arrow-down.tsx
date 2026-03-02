import { type QwikIntrinsicElements, component$ } from '@builder.io/qwik';

export const IconArrowDown = component$(
  (props: QwikIntrinsicElements['svg']) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.25"
          d="M18 12.5s-4.42 6-6 6c-1.582 0-6-6-6-6m12-7s-4.42 6-6 6c-1.582 0-6-6-6-6"
        />
      </svg>
    );
  },
);
