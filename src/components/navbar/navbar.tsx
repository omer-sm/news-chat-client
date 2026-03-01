import { component$ } from '@builder.io/qwik';

export const Navbar = component$(() => {
  return (
    <nav class="navbar bg-base-300 shadow-sm shrink-0">
      <h1 class="text-3xl font-semibold">💬 צ'אט הכתבים</h1>
    </nav>
  );
});
