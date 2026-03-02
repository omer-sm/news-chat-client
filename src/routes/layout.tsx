import { Slot, component$ } from '@builder.io/qwik';
import { Navbar } from '~/components/navbar/navbar';
import { useProvideNewsChatWebsocket } from '~/lib/hooks/useProvideNewsChatWebsocket';

export default component$(() => {
  useProvideNewsChatWebsocket(Date.now() - 1000 * 60 * 30);

  return (
    <div class="flex flex-col gap-2 h-dvh">
      <Navbar />
      <Slot />
    </div>
  );
});
