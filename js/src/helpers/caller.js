'use strict';

async function login(roll_number, password, is_parent){
  const response = await fetch('/auth/' +roll_number+'/'+password+'/'+(is_parent ? 'P': 'S'));
  setTimeout(()=>window.localStorage.setItem('auth', JSON.stringify({e:roll_number,p:password,t:is_parent})), 0);
  if (response.ok) {
    const decoder = new TextDecoder();
    const cookie = decoder.decode((await (await (response.body.getReader())).read()).value);
    setTimeout(()=>window.localStorage.setItem('cookie', JSON.stringify({t:Date.now(),v:cookie})), 0);
    globalThis.__.cookie = cookie;
    return cookie;
  }
}

async function call(cookie, path){
  const response = await fetch('/api/' + cookie + '/' + path);
  if (response.ok) {
    const decoder = new TextDecoder();
    const parser = new DOMParser();
    const dom = parser.parseFromString(decoder.decode((await (await (response.body.getReader())).read()).value), 'text/html');
    return dom;
  }
}

async function getcookie(){
  const cookie = JSON.parse(window.localStorage.getItem('cookie'));
  if (Date.now - cookie.t <10240000){
    return cookie.v;
  } else {
    const credentials = JSON.parse(window.localStorage.getItem('auth'));
    return login(credentials.e, credentials.p, credentials.t);
  }
}

export { login, call, getcookie };

