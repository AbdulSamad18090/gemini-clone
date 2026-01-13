"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { FaUserLarge } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdContentCopy, MdThumbUp, MdThumbDown, MdRefresh } from "react-icons/md";
import { useState } from "react";

const ChatMessages = ({ chat }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 px-4 md:px-8">
      {chat.map((entry, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group"
        >
          {/* User Message */}
          <div className="flex justify-end mb-4">
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="message-user px-4 py-3 rounded-2xl rounded-tr-sm bg-[#1a1a1a] border border-[#333]">
                <p className="text-[#e3e3e3]">{entry.prompt}</p>
              </div>
              <div className="w-8 h-8 gradient rounded-full flex items-center justify-center flex-shrink-0">
                <FaUserLarge className="text-white text-xs" />
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center flex-shrink-0">
              <HiOutlineSparkles className="text-[#4285f4]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="markdown-content text-[#e3e3e3] prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="code-block my-4 rounded-xl overflow-hidden">
                          <div className="code-header flex justify-between items-center px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
                            <span className="text-sm text-[#9b9b9b]">{match[1]}</span>
                            <button
                              onClick={() => handleCopy(String(children).replace(/\n$/, ""), "code-" + index)}
                              className="flex items-center gap-1 text-xs text-[#9b9b9b] hover:text-white transition-colors"
                            >
                              <MdContentCopy />
                              {copiedIndex === "code-" + index ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: "0 0 12px 12px",
                              background: "#0d0d0d",
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-[#262626] px-1.5 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {entry.response}
                </ReactMarkdown>
              </div>
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(entry.response, index)}
                  className="action-btn flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#262626] border border-[#333] text-xs text-[#9b9b9b] hover:text-white transition-colors"
                >
                  <MdContentCopy />
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
                <button className="action-btn flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#262626] border border-[#333] text-[#9b9b9b] hover:text-white transition-colors">
                  <MdThumbUp />
                </button>
                <button className="action-btn flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#262626] border border-[#333] text-[#9b9b9b] hover:text-white transition-colors">
                  <MdThumbDown />
                </button>
                <button className="action-btn flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#262626] border border-[#333] text-[#9b9b9b] hover:text-white transition-colors">
                  <MdRefresh />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatMessages;
