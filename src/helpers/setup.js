'use default';

export default function(){
  globalThis.__ = {};
  const root_style = document.getElementById('root').style;
  let x = 100/window.outerWidth;
  let y = 100/window.outerHeight;

  window.onmousemove = e => {
    root_style.cssText = '--mouse-xp: '+x*e.screenX+'%; --mouse-yp: '+y*e.screenY+'%;';
  }
  window.onresize = () => {
    // workaround when unmaxamizing window as normally setting values causes wrong values to be set (values before resize are set);
    setTimeout(()=>{
      x = 100/window.outerWidth;
      y = 100/window.outerHeight;
    },0);
  }
};

