'use strict';
import { createSignal, Show } from 'solid-js';
import { navigate, sidebar } from '../helpers/state';
import './Login.css';
import ThreeText from '../components/ThreeText';

export default function() {
  if (globalThis.__.Login) return globalThis.__.Login;
  const [bg, setBg] = createSignal(true);
  const [isLogin, setIsLogin] = createSignal(true);

  const handleLoginClick = (e) => {
    setBg(false);
    sidebar(true);
    e.preventDefault();
    navigate('profcom');
  };

  const handleSignupClick = (e) => {
    setBg(false);
    sidebar(true);
    e.preventDefault();
    navigate('profcom');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin());
  };

  globalThis.__.Login = (
    <div class='flex justify-center select-none place-items-center h-full w-full overflow-hidden'>
      {/* Left Half: Three.js Component */}
      <div class='w-1/2 h-full bg-navyblue left-0 '>
        <ThreeText />
      </div>
      {/* Right Half: Form */}
      <div id='form-container' class='w-1/2 h-full relative z-30 rounded-3xl shadow-black shadow-2xl border-none overflow-clip flex flex-col justify-center items-center'>
        <Show when={bg()}>
          <div class='top-[22vh] left-[10vw]' style='background: linear-gradient(to right, #ff9800, #ff9800);' />
          <div class='bottom-[22vh] right-[8vw]' style='background: linear-gradient(#87ceeb, #87ceeb);' />
        </Show>
        <Show when={isLogin()}>
          <form class='rounded-3xl w-3/4'>
            <h3 class='text-white mb-4'>Login Here</h3>
            <label for='username' class='text-white'>Username</label>
            <input type='text' autocomplete='enrollment-number' placeholder='Username' id='username' class='input-field'/>
            <label for='password' class='text-white'>Password</label>
            <input autocomplete='webkiosk-password' type='password' placeholder='Password' id='password' class='input-field'/>
            <button class='bg-white px-4 py-2 mt-6 w-full rounded-full text-neutral-950 cursor-pointer' onclick={handleLoginClick}>Log In</button>
            <p class='text-white mt-4 cursor-pointer' onclick={toggleForm}>Don't have an account? Sign up</p>
          </form>
        </Show>
        <Show when={!isLogin()}>
          <form class='rounded-3xl w-3/4'>
            <h3 class='text-white mb-4'>Sign Up Here</h3>
            <label for='username' class='text-white'>Username</label>
            <input type='text' autocomplete='Username' placeholder='Enrollment No.' id='username' class='input-field'/>
            <label for='password' class='text-white'>Password</label>
            <input autocomplete='webkiosk-password' type='password' placeholder='Password' id='password' class='input-field'/>
            <label for='confirm-password' class='text-white'>Confirm Password</label>
            <input autocomplete='new-password' type='password' placeholder='Confirm Password' id='confirm-password' class='input-field'/>
            <button class='bg-white px-4 py-2 mt-6 w-full rounded-full text-neutral-950 cursor-pointer' onclick={handleSignupClick}>Sign Up</button>
            <p class='text-white mt-4 cursor-pointer' onclick={toggleForm}>Already have an account? Log in</p>
          </form>
        </Show>
      </div>
    </div>
  );
  return globalThis.__.Login;
}
