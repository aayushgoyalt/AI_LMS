'use strict';
import { For, createSignal } from 'solid-js';
import { bar, sidebar,nav, navigate } from '../helpers/state';
import logo from '../assets/logo.png';
import './SideBar.css';

function SideBarComponent(name, icon, subcomponents_or_path){
  if (typeof(subcomponents_or_path) == 'string'){
    return {name: name, icon: icon, path: subcomponents_or_path}
  }
  else if (typeof(subcomponents_or_path) == 'object'){
    return {name: name, icon: icon, subcomponents: subcomponents_or_path}
  }
}

/* component is return value of SideBarComponent */
function SideBarMaker(component) {
  const cls = `font-[750] will-change-transform duration-300 active:scale-95 flex items-center text-white hover:bg-[#14315d]`;
  if (component.subcomponents === undefined){
    return (
      <li class='mb-1 group'>
        <span onclick={[navigate, component.path]} class={cls + ' mb-2'}>
          <span class='flex flex-row'>{component.icon}{component.name}</span>
        </span>
      </li>
    );
  }
  const [visible, setVisible] = createSignal(false);
  return (
    <li class={'group'}>
      <span onclick={()=>{setVisible(!visible())}} class={cls + (visible() ? ' bg-[#14315d]':'') }>
        <span class='flex flex-row'>{component.icon}{component.name}</span>
        <svg class={'will-change-auto duration-300 ml-auto size-5' + (visible() ? ' fill-blue-300 rotate-90':' fill-white')} width='24' height='24' viewBox='0 0 24 24'><path d='M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z'/></svg>
      </span>
      <ul class='pl-6 mt-2 transition-all duration-300 grid' style={{'grid-template-rows':visible()?'1fr':'0fr'}}>
        <div class='overflow-hidden'>
          <For each={component.subcomponents}>
            {(item) => (
              <li class='will-change-transform transition ease-out delay-0 active:scale-95 duration-300 mb-4' onclick={[navigate, item.path]}>
                <span class='font-[500] text-gray-100 flex items-center hover:text-[#D5B0AC]'>{item.name}</span>{/*before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3 */} 
              </li>
            )}
          </For>
        </div>
      </ul>
    </li>
  );
};

/* build the top level sidebar component */
function SideBar(components) {
  // div class='transform-gpu z-50 bg-[#180403] p-1 sidebar-menu left-0 top-0 h-full'
  return (
    <>
      <div
        class={'fixed top-0 left-0 bg-black/75 z-40 w-full h-full backdrop-blur-md min-[715px]:hidden'}
        onclick={()=>{sidebar(false)}}
        style={bar()?'animation:fadeIn 1s ease-out;animation-fill-mode:both;':'animation:fadeOut .25s ease-out;animation-fill-mode:both;'}
      />
      <img
        src={logo}
        class={'overflow-visible fixed object-cover z-[500] mt-[2vh] m-0 ml-2 w-[12rem] h-[10vh] rounded-2xl left-1 top-[calc(.75vh+.25rem)] min-h-[90px] mb-[2.5vh]'+(nav()==='login'? ' hidden':'')}
        style={bar()?'animation:rollOut .60s ease-out;animation-fill-mode:both':'animation:rollUp .50s ease-out;animation-fill-mode:both'}
        onclick={()=>{sidebar(!bar())}}
      />
      <aside
        id='sidebar-menu'
        class='z-50 select-none overflow-scroll fixed bg-[#080e21] p-1 box-content top-0 min-h-full h-full min-w-32 w-[13rem] transition-all'
        style={bar()?'':'animation:slideOut .25s ease-out;animation-fill-mode:both'}
      >
        <div class='min-h-[90px] h-[10vh] mb-[6vh] rounded-2xl object-cover mt-[.75vh]'/>
        <ul>
          <For each={components}>
            {(item)=>SideBarMaker(item)}
          </For>
        </ul>
      </aside>
    </>
  );
};

export default SideBar;
export { SideBarComponent };

