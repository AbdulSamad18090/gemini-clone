// ChatInput.js
"use client"
import { IoSend } from "react-icons/io5";

const ChatInput = ({ prompt, setPrompt, generateAnswer, loading }) => {
  return (
    <form
      onSubmit={generateAnswer}
      className="flex items-center gap-4 w-full bg-[#1e1f20] py-4 px-8 rounded-full max-h-24"
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
  );
};

export default ChatInput;
