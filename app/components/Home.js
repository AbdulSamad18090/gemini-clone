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

function Home() {
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
            <FaUserLarge />
          </div>
          <div
            className={`absolute top-11 right-0 transition-transform duration-500 bg-black bg-opacity-5 backdrop-blur-lg w-[400px] min-h-20 rounded-lg overflow-hidden border border-black border-opacity-15 shadow-lg ${
              isOpenProfileModal
                ? "transform translate-x-0 opacity-100"
                : "transform translate-x-[450px] opacity-40"
            }`}
          >
            <div className="p-4 text-white">
              <div className="w-full flex items-center gap-2  mb-1 pb-1">
                <span
                  className={`w-full text-center cursor-pointer rounded-lg ${
                    formState === "login" && "gradient"
                  }`}
                  onClick={() => {
                    setFormState("login");
                  }}
                >
                  Login
                </span>
                <span
                  className={`w-full text-center cursor-pointer rounded-lg ${
                    formState === "register" && "gradient"
                  }`}
                  onClick={() => {
                    setFormState("register");
                  }}
                >
                  Register
                </span>
              </div>
              {formState === "login" ? <Login /> : <Register />}
            </div>
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
                  Hello, User
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
