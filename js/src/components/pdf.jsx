'use strict';
import { For } from "solid-js";

const SamplePage = () => {
  // Sample data representing available PDFs
  const availablePDFs = [
    { id: 1, name: 'Mid Sem', pages: 10, url: '/profcom/finalppt.pptx' },
    { id: 2, name: 'Final Sem', pages: 15, url: '/profcom/fin.pdf' },
    { id: 3, name: 'Sample PDF 3', pages: 20, url: 'https://example.com/sample-pdf-3.pdf' },
  ];

  return (
    <div class="fixed bg-[#080e215f] h-[100vh] w-[25vw] backdrop-blur-lg rounded-lg shadow-lg p-6 right-0">
      <h1 class="text-gray-200 text-3xl font-bold mb-4">Available PDFs</h1>
      <div class="rounded-lg overflow-scroll border border-gray-300/75">
        <For each={availablePDFs}>
          {(pdf) => (
            <div key={pdf.id} class="flex items-center py-2 px-4 rounded-lg">
              <div class="flex-grow">
                <p class="text-lg text-gray-200 font-semibold">{pdf.name}</p>
                <p class="text-sm text-gray-400">{pdf.pages} pages</p>
              </div>
              <a href={pdf.url} target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-blue-800">View PDF</a>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default SamplePage;
