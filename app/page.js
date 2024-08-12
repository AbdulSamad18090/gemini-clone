"use client";
import axios from "axios";
import { IoMdMenu } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { IoBulbOutline, IoSend } from "react-icons/io5";
import { FaRegFlag } from "react-icons/fa6";
import { RiMapPin2Line } from "react-icons/ri";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth <= 752) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [windowWidth]);

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

  const generateAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD6bnNyrjHy8UjeNKyttGpxixdhc5vQ5gw",
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      const generatedText = res.data.candidates[0].content.parts[0].text;
      setChat([...chat, { prompt, response: generatedText }]);
      setPrompt("");
    } catch (error) {
      console.error("Error generating answer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#1e1f20] h-screen text-white py-4">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed "}`}>
        <IoMdMenu
          className="text-3xl cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <div className="my-10">
          <button className="flex gap-2 items-center bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg transition-all">
            <FaPlus className="text-lg" />
            <p className={`new-chat text-[12px] ${isOpen ? "" : "hidden"}`}>
              New Chat
            </p>
          </button>
        </div>
        {isOpen && (
          <div>
            <h1 className="font-semibold">Recents</h1>
            <div className="h-[350px] overflow-auto">
              {/* Placeholder content */}
              {Array.from({ length: 25 }, (_, i) => (
                <h1 key={i}>as</h1>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="bg-[#131314] w-full rounded-l-2xl flex flex-col justify-between p-[2%]">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {chat.length === 0 ? (
            <>
              <h1 className="md:text-6xl text-5xl gradient-text font-semibold w-fit">
                Hello, User
              </h1>
              <p className="md:text-5xl text-4xl text-[#444746] font-semibold">
                How can I help you today?
              </p>
              <div className="flex flex-wrap items-center justify-center m-[3%] gap-4 text-[13px] font-thin">
                {defaultPrompts.map((defaultPrompt, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between items-end bg-[#1e1f20] p-3 rounded-xl min-h-[180px] max-w-[180px] hover:bg-[#272727] cursor-pointer transition-all hover:rotate-3 hover:scale-110"
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
            </>
          ) : (
            <div>
              {chat.map((entry, index) => (
                <div key={index} className="mb-4 px-2 md:mx-[10%]">
                  <h2 className="text-lg bg-[#1e1f20] py-2 px-4 rounded-lg md:min-w-[60%] min-w-[90%]  md:max-w-[60%] max-w-[90%] mr-0 ml-auto my-4">
                    {entry.prompt}
                  </h2>
                  <p className="text-md">{entry.response}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={generateAnswer}
          className="flex items-center gap-4 w-full bg-[#1e1f20] py-4 px-8 mt-[3%] rounded-full max-h-24"
        >
          <input
            type="text"
            placeholder="Enter a prompt here"
            value={prompt}
            className="w-full bg-transparent ring-0 outline-none"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            disabled={loading}
          />
          <button type="submit" className="text-2xl" disabled={loading}>
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
