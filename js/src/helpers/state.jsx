'use strict';

import { createSignal } from 'solid-js';
import RPC from './comm.js'


var websoc = undefined;
function rpc() {
  if (!websoc) websoc = RPC.init();
  return websoc;
}

const [nav, navigate] = createSignal('');
const [bar, sidebar] = createSignal(false);

export { nav, navigate, bar, sidebar, rpc };

