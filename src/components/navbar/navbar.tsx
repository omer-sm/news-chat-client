import { component$, useContext } from '@builder.io/qwik';
import { NewsChatWebsocketContext } from '~/lib/context/newsChatWebsocketContext';

export const Navbar = component$(() => {
  const { isWsConnected } = useContext(NewsChatWebsocketContext);

  return (
    <nav class="navbar bg-base-300 shadow-sm shrink-0 flex justify-between">
      <h1 class="text-3xl font-semibold">💬 צ'אט הכתבים</h1>

      <div class="inline-grid *:[grid-area:1/1] mx-4">
        {isWsConnected.value ? (
          <>
            <div class="status status-success animate-ping brightness-125 opacity-80"></div>
            <div class="status status-success shadow-[0_0_6px_var(--color-success),0_0_12px_var(--color-success),0_0_40px_var(--color-success)]"></div>
          </>
        ) : (
          <div
            aria-label="warning"
            class="status status-warning shadow-[0_0_6px_var(--color-warning),0_0_12px_var(--color-warning),0_0_40px_var(--color-warning)]"
          ></div>
        )}
      </div>
    </nav>
  );
});
