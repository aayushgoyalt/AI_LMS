// Login.jsx
'use strict';
import { createSignal } from 'solid-js';
import { navigate, sidebar } from '../helpers/state';
import './Login.css';
import ThreeText from './ThreeText';

export default function() {
  if (globalThis.__.Login) return globalThis.__.Login;
  const [bg, setBg] = createSignal(true);
  const username = <input type='text' autocomplete='enrollment-number' placeholder='Enrollment No.' id='username' />;
  const password = <input autocomplete='webkiosk-password' type='password' placeholder='Password' id='password' />;
  
  function handleclick(e) {
    setBg(false);
    sidebar(true);
    e.preventDefault();
    navigate('profcom');
  }

  globalThis.__.Login = (
    <div class='flex justify-center select-none place-items-center h-full w-full overflow-hidden'>
      {/* Left Half: Three.js Component */}
      <div class='w-1/2 h-full bg-navyblue '>
        <ThreeText />
      </div>
      {/* Right Half: Login Form */}
      <div id='login-form' class='w-1/2 h-full relative z-30 rounded-3xl shadow-black shadow-2xl border-none overflow-clip flex flex-col justify-center items-center'>
        <Show when={bg()}>
          <div class='top-[22vh] left-[10vw]' style='background: linear-gradient(to right, #ff9800, #ff9800);' />
          <div class='bottom-[22vh] right-[8vw]' style='background: linear-gradient(#87ceeb, #87ceeb);' />
        </Show>
        <form class='rounded-3xl w-3/4'>
          <h3 class='text-white mb-4'>Login Here</h3>
          <label for='username' class='text-white'>Username</label>
          {username}
          <label for='password' class='text-white'>Password</label>
          {password}
          <button class='bg-white px-4 py-2 mt-6 w-full rounded-full text-neutral-950 cursor-pointer' onclick={handleclick}>Log In</button>
        </form>
      </div>
    </div>
  );
  return globalThis.__.Login;
}
