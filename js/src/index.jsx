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

const root = document.getElementById('root');
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found !!');
}

render(() => {
  setup();
  navigate('home');
  sidebar(true);
  const Anim = x => <Motion class={'h-full' + (bar() ? ' min-[715px]:ml-56' : '')} transition={{ duration: .5, easing: 'ease-in-out' }} animate={{ opacity: [0, 1] }} exit={{ opacity: [1, .25], scale: [1, .65], transition: { duration: 0.2 } }}>{x.children}</Motion>;
  const Anime = x => <Motion class={'h-full'} transition={{ duration: .5, easing: 'ease-in-out' }} animate={{ opacity: [0, 1] }} exit={{ opacity: [1, .25], scale: [1, .65], transition: { duration: 0.2 } }}>{x.children}</Motion>;

  return (
    <>
      <Show when={nav() !== 'login'}>
        <DefaultBar />
      </Show>
      <Suspense>
        <Presence exitBeforeEnter>
          <Switch>
            <Match when={nav() === 'login'}>
              <Anime><Login /></Anime>
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
