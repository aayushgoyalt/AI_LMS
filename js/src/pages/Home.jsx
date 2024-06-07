'use strict';
import { onMount } from 'solid-js';
import Pdf from '../components/pdf'

import { bar, rpc } from '../helpers/state.jsx'
import './Home.css'


import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

function format(divElement, markdownText) {
  const formattedText = md.render(markdownText);
  divElement.innerHTML = formattedText;
}

export default function() {
  let parent, text_input;

  const RPC = rpc();

  function onDragEnter(e){
    e.preventDefault();
    e.target.style.border = "2px dashed";
  }
  function onDragLeave(e){
    e.preventDefault();
    e.target.style.border = "";
  }
  
  function onDrop(e) {
    e.preventDefault();
    e.target.style.border = "";
    const files = e.dataTransfer.files;
    for (const f of files) {
      console.log(f);
      RPC.addFile(f);
    }
  }

  function make(){
    const x = text_input.value;
    if (x == "") return;
    console.log(RPC.addText(x));

    let response;
    parent.appendChild(
      <div>
        <div class="flex flex-row w-max-[85%] w-auto" style="animation: slideUp 1s ease-in-out;">
          <div class="flex-grow" />
          <span class="right-0 bg-sky-500/25 px-4 py-2 mt-2 rounded-lg mx-4">
            {x}
          </span>
        </div>
        <div class="flex flex-row w-max-[85%] w-auto" style="animation: slideUp 1s ease-in-out;">
          <div class="flex flex-col right-0 bg-blue-800/25 px-4 py-2 mt-2 rounded-lg mx-4 overflow-scroll w-auto" ref={response} />
          <div class="flex-grow" />
        </div>
      </div>
    );
    text_input.value = "";
    let func = true;
    RPC.askText((e)=>{
      if (func){
        format(response, e.data);
        response.scrollIntoView({ behavior: 'smooth' });
        func=undefined;
      } 
    });
  }
  return (
    <div class="overflow-y-scroll flex flex-row mr-[25vw]">
      <div class={"h-full flex flex-col pt-2 px-1 py-1 mb-16 "+(bar()?'w-[55vw]':'w-[60vw] ml-28')} ref={parent}></div>
      <div class="flex max-w-full fixed left-[15rem] bottom-3 w-[50vw] z-20">   
        <label for="voice-search" class="sr-only">Search</label>
        <textarea rows="1" type="text" autocomplete="off" id="voice-search" required ondragenter={onDragEnter} ondragleave={onDragLeave} ondrop={onDrop} ref={text_input}
          class="border w-full text-sm rounded-lg block ps-10 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Mockups, Logos, Design Templates..."
        />
        <button
          type="submit"
          class="ml-4 w-[2fr] items-center py-2.5 px-9 text-sm font-medium text-white rounded-lg border border-blue-700 focus:ring-4 focus:outline-none bg-[#0a1628] hover:bg-[#1b304f] focus:ring-[#0a1628]"
          onclick={(e) => {e.preventDefault();make();}}
        >Send
        </button>
      </div>
      <Pdf/>
    </div>
  );
};

