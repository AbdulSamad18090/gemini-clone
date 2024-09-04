// DefaultPrompts.js
"use client"
import { IoBulbOutline } from "react-icons/io5";
import { FaRegFlag } from "react-icons/fa6";
import { RiMapPin2Line } from "react-icons/ri";

const DefaultPrompts = ({ setPrompt }) => {
  const defaultPrompts = [
    {
      text: "Give me a walkthrough of The Byzantine Empire in seven bullet points or less.",
      icon: <IoBulbOutline />,
    },
    {
      text: "Find hotels for a 4-day trip to San Francisco for new years event",
      icon: <FaRegFlag />,
    },
    {
      text: "What are some tips to improve public speaking skills for beginners?",
      icon: <IoBulbOutline />,
    },
    {
      text: "How long does it take to walk from Buckingham Palace to Big Ben in London? What about from Big Ben to Trafalgar Square?",
      icon: <RiMapPin2Line />,
    },
  ];

  return (
    <div className="p-10 flex flex-wrap items-center justify-center gap-4 text-[13px] font-thin w-full overflow-x-auto">
      {defaultPrompts.map((defaultPrompt, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between items-end bg-[#1e1f20] p-3 rounded-xl min-h-[180px] max-w-[180px] hover:bg-white hover:bg-opacity-5 cursor-pointer transition-all ${
            i % 2 === 0 ? "hover:rotate-6" : "hover:-rotate-6"
          } hover:scale-125 shadow hover:shadow-[#1e1f20]`}
          onClick={() => {
            setPrompt(defaultPrompt.text);
          }}
        >
          <h1>{defaultPrompt.text}</h1>
          <div className="bg-black bg-opacity-30 text-xl p-2 rounded-full">
            {defaultPrompt.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultPrompts;
