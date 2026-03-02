import { Slot, component$ } from '@builder.io/qwik';
import { Navbar } from '~/components/navbar/navbar';

export default component$(() => {
  return (
    <div class="flex flex-col gap-2 h-dvh">
      <Navbar />
      <Slot />
    </div>
  );
});
