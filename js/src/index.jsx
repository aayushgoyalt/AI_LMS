'use strict';
import { render } from 'solid-js/web';
import { Match, Show, Suspense, Switch } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';

import { nav, bar, sidebar, navigate } from './helpers/state';
import './assets/index.css';
import './assets/keyframes.css';

import setup from './helpers/setup';
import DefaultBar from './components/SideBarBuilder';
import Login from './pages/Login';
import Home from './pages/Home';
import History from './pages/History';
import Archive from './pages/Archive';


// For testing only
import RPC from './helpers/comm.js'
globalThis.RPC = RPC;
//


const root = document.getElementById('root');
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found !!');
}

render(() => {
  setup();
  navigate('home');
  sidebar(true);
  const Anim = x => (
    <Motion
      class={'h-full min-[715px]:ml-56'}
      style={`animation:${bar()?'expand':'shrink'}MarginLeft ease-in-out .45s; animation-fill-mode:both`}
      transition={{duration: .45, easing: 'ease-in-out'}}
      animate={{opacity: [0, 1]}}
      exit={{opacity:[1,.25], y: ['0','10%'], transition: {duration: 0.15}}}
    >
      {x.children}
    </Motion>
  );
  return (
    <>
      <Show when={nav() != 'login'}>
        <DefaultBar />
      </Show>
      <Suspense>
        <Presence exitBeforeEnter>
          <Switch>
            <Match when={nav() === 'login'}>
              <Anim><Login /></Anim>
            </Match>
            <Match when={nav() === 'profcom'}>
              <Anim><Home /></Anim>
            </Match>
            <Match when={nav() === 'home'}>
              <Anim><Home /></Anim>
            </Match>
            <Match when={nav() === 'history'}>
              <Anim><History /></Anim>
            </Match>
            <Match when={nav() === 'archive'}>
              <Anim><Archive /></Anim>
            </Match>
          </Switch>
        </Presence>
      </Suspense>
    </>
  );
}, root);
