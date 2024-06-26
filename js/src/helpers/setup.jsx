'use strict';

export default function(){
  globalThis.__ = {};
  let x = window.outerWidth;
  let y = window.outerHeight;
  let hoverable;

  root.appendChild(
    <div ref={hoverable}
      class="fixed rounded-full w-[100vmax] h-[100vmax] z-[-1] left-[-50vmax] top-[-50vmax]"
      id="background-glow"
    />
  );

  const h_style = hoverable.style;
  window.onmousemove = e => {
    h_style.cssText = `transform: translate(${e.clientX}px,${e.clientY}px);`;
  }
  window.onresize = () => {
    //workaround when unmaxamizing window as normally setting values causes wrong values to be set (values before resize are set);
    setTimeout(()=>{
      x = window.outerWidth;
      y = window.outerHeight;
    },0);
  }
};


