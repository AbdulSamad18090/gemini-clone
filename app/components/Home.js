"use client";
// Home.js
import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdMenu } from "react-icons/io";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import DefaultPrompts from "./DefaultPrompts";
import { FaUserLarge } from "react-icons/fa6";
import Register from "./Register";
import Login from "./Login";
import { signOut, useSession } from "next-auth/react";
import { CiMenuKebab } from "react-icons/ci";

function Home() {
  const { data: session } = useSession(); // Get session data

  useEffect(() => {
    if (session) {
      console.log("Session =>", session);
    } else {
      console.log("Session not exist");
    }
  }, [session]);

  const [isOpen, setIsOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
  const [formState, setFormState] = useState("login");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    setWindowWidth(window.innerWidth);

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
    <div className="bg-[#1e1f20] h-screen">
      {/* Header */}
      <div className="w-full text-white p-4 flex items-center justify-between">
        <IoMdMenu
          className="text-3xl cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <div className="relative">
          <div
            className="gradient h-9 w-9 rounded-full flex items-center justify-center text-lg cursor-pointer"
            onClick={() => {
              setIsOpenProfileModal(!isOpenProfileModal);
            }}
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="img"
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <FaUserLarge />
            )}
          </div>
          <div
            className={`absolute top-11 right-0 transition-transform duration-500 bg-black bg-opacity-5 backdrop-blur-lg sm:w-[400px] w-[94vw] min-h-20 rounded-lg overflow-hidden border border-black border-opacity-15 shadow-lg ${
              isOpenProfileModal
                ? "transform translate-x-0 opacity-100"
                : "transform sm:translate-x-[450px] translate-x-[100vw] opacity-40"
            }`}
          >
            {session ? (
              <section className="p-4 relative">
                <span className="absolute top-4 right-4 hover:bg-[#444746] transition-all cursor-pointer p-1 rounded-md">
                  <CiMenuKebab />
                </span>
                <div className="flex items-center gap-4">
                  <div>
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="img"
                        width={50}
                        height={50}
                        className="rounded"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] gradient rounded flex items-center justify-center text-2xl">
                        <FaUserLarge />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl gradient-text">
                      {session.user.name}
                    </h1>
                    <p className="text-sm text-[#444746]">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  className="w-full bg-[#1e1f20] hover:bg-[#1a1a1b] text-red-600 outline-double hover:outline-red-600 outline-black transition-all p-2 rounded-lg mt-4"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </button>
              </section>
            ) : (
              <div className="p-4">
                <div className="relative w-full flex items-center gap-2 mb-1 pb-1">
                  <span
                    className="w-full text-center cursor-pointer rounded-lg"
                    onClick={() => {
                      setFormState("login");
                    }}
                  >
                    Login
                  </span>
                  <span
                    className="w-full text-center cursor-pointer rounded-lg"
                    onClick={() => {
                      setFormState("register");
                    }}
                  >
                    Register
                  </span>
                  <span
                    className={`absolute -z-10 transition-all duration-500 ease-in-out ${
                      formState === "login"
                        ? "left-0 rounded-bl-xl rounded-br rounded-tr-xl rounded-tl"
                        : "left-1/2 rounded-tl-xl rounded-tr rounded-br-xl rounded-bl"
                    } h-7 w-1/2 gradient`}
                  ></span>
                </div>

                {formState === "login" ? <Login /> : <Register />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex bg-[#1e1f20] text-white">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Content */}
        <div className="bg-[#131314] w-full h-[85vh] items-stretch rounded-l-2xl flex flex-col justify-between p-2">
          <div className="flex flex-col gap-4 overflow-y-auto">
            {chat.length === 0 ? (
              <>
                <h1 className="md:text-6xl text-5xl gradient-text font-semibold w-fit">
                  Hello, {session ? session.user.name : "User"}
                </h1>
                <p className="md:text-5xl text-4xl text-[#444746] font-semibold">
                  How can I help you today?
                </p>
                <DefaultPrompts setPrompt={setPrompt} />
              </>
            ) : (
              <ChatMessages chat={chat} />
            )}
          </div>

          <ChatInput
            prompt={prompt}
            setPrompt={setPrompt}
            generateAnswer={generateAnswer}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
