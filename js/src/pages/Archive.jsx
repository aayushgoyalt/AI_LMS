import { createSignal } from 'solid-js';

const Archive = () => {
  const [questionHistory, setQuestionHistory] = createSignal([
    { id: 1, question: 'How does AI impact healthcare?', date: '2023-08-15', starred: false },
    { id: 2, question: 'What are the benefits of learning a new language?', date: '2023-09-02', starred: false },
    { id: 3, question: 'How can renewable energy reduce carbon emissions?', date: '2023-10-10', starred: false },
    { id: 4, question: 'What is the future of electric vehicles?', date: '2023-11-20', starred: false },
    { id: 5, question: 'How does blockchain technology work?', date: '2023-12-05', starred: false },    
    { id: 6, question: 'What are the benefits of learning a new language?', date: '2023-09-02', starred: false },
    { id: 7, question: 'How can renewable energy reduce carbon emissions?', date: '2023-10-10', starred: false },
    { id: 8, question: 'What is the future of electric vehicles?', date: '2023-11-20', starred: false },
  ]);

  const handleUnstar = (id) => {
    setQuestionHistory((prevHistory) =>
      prevHistory.filter((question) => question.id !== id)
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto shadow-2xl shadow-black backdrop-blur-xl bg-slate-400/20 rounded-lg overflow-hidden">
        <h1 className="text-3xl font-bold text-white bg-[#183055] py-4 px-6">Archive</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left bg-gray-400">Question</th>
                <th className="py-3 px-6 text-left bg-gray-400">Date Asked</th>
                <th className="py-3 px-6 text-left bg-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm font-light">
              {questionHistory().map((question) => (
                <tr key={question.id} className="border-b hover:bg-gray-800 border-gray-200">
                  <td className="py-3 px-6 whitespace-nowrap">{question.question}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{question.date}</td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    <button
                      onClick={() => handleUnstar(question.id)}
                      className="bg-red-white hover:text-blue-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Archive;
