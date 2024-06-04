'use strict';

import { createEffect, createSignal } from 'solid-js';

const [nav, navigate] = createSignal('');
const [bar, sidebar] = createSignal(false);

export { nav, navigate, bar, sidebar };

