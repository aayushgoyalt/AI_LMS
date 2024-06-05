'use strict';
import { For } from "solid-js";

const History = () => {
  const questionHistory = [
    { id: 1, question: 'How does AI impact healthcare?', date: '2023-08-15' },
    { id: 2, question: 'What are the benefits of learning a new language?', date: '2023-09-02' },
    { id: 3, question: 'How can renewable energy reduce carbon emissions?', date: '2023-10-10' },
    { id: 4, question: 'What is the future of electric vehicles?', date: '2023-11-20' },
    { id: 5, question: 'How does blockchain technology work?', date: '2023-12-05' },    
    { id: 6, question: 'What are the benefits of learning a new language?', date: '2023-09-02' },
    { id: 7, question: 'How can renewable energy reduce carbon emissions?', date: '2023-10-10' },
    { id: 8, question: 'What is the future of electric vehicles?', date: '2023-11-20' },
  ];

  return (
    <div className=" min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto shadow-2xl shadow-black backdrop-blur-xl bg-slate-400/20 rounded-lg  overflow-hidden">
        <h1 className="text-3xl font-bold text-white bg-[#183055] py-4 px-6">Question History</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left bg-gray-400">Question</th>
                <th className="py-3 px-6 text-left bg-gray-400">Date Asked</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm font-light ">
              <For each={questionHistory}>
              {(question) => (
                <tr key={question.id} className="border-b hover:bg-gray-800 border-gray-200 ">
                  <td className="py-3 px-6 whitespace-nowrap">{question.question}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{question.date}</td>
                </tr>
              )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
