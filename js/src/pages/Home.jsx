'use strict';

import { bar, rpc } from '../helpers/state.jsx'
import Pdf from '../components/pdf'
import './Home.css'


export default function() {
  let parent, text_input;
  const RPC = rpc();

  function make(){
    const x = text_input.value;
    if (x == "") return;
    console.log(RPC.addText(x));
    let response;
    parent.appendChild(
      <div>
        <div class="flex flex-row w-max-[85%] w-auto" style="animation: slideUp 1s ease-in-out;">
          <div class="flex-grow" />
          <span class="right-0 bg-blue-900/25 px-4 py-2 mt-2 rounded-lg mx-4">
            {x}
          </span>
        </div>
        <div class="flex flex-row w-max-[85%] w-auto" style="animation: slideUp 1s ease-in-out;">
          <span class="right-0 bg-blue-900/25 px-4 py-2 mt-2 rounded-lg mx-4" ref={response}>
          </span>
        </div>
      </div>
    );
    text_input.value = "";
    let func = true;
    RPC.askText((e)=>{ if (func){response.innerText = e.data; func=undefined;} });
  }
  return (
    <div class="overflow-y-scroll flex flex-row mr-[25vw]">
      <div class={"h-full flex flex-col pt-2 px-1 py-1 mb-16 "+(bar()?'w-[55vw]':'w-[60vw] ml-28')} ref={parent}></div>
      <form class="flex max-w-full fixed left-[15rem] bottom-3 w-[50vw] z-20">   
        <label for="voice-search" class="sr-only">Search</label>
        <input type="text"
          id="voice-search"
          class="border w-full text-sm rounded-lg block ps-10 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Mockups, Logos, Design Templates..."
          required
          ref={text_input}
        />
        <button
          type="submit"
          class="ml-4 w-[2fr] items-center py-2.5 px-9 text-sm font-medium text-white rounded-lg border border-blue-700 focus:ring-4 focus:outline-none bg-[#0a1628] hover:bg-[#1b304f] focus:ring-[#0a1628]"
          onclick={(e) => {e.preventDefault();make();}}
        >Send
        </button>
      </form>
      <Pdf/>
    </div>
  );
};

