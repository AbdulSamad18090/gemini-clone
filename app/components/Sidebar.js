"use client";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline, IoHelpCircleOutline } from "react-icons/io5";
import { BsChatDots, BsClockHistory } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, setIsOpen, onNewChat, chatHistory = [] }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="sidebar bg-[#1a1a1a] h-full flex flex-col border-r border-[#333] overflow-hidden"
        >
          <div className="p-4">
            <button onClick={onNewChat} className="w-full flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333] rounded-full transition-all text-white">
              <FaPlus className="text-sm" />
              <span className="text-sm font-medium">New chat</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            {chatHistory.length > 0 && (
              <div className="mb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wider">Recent</h3>
                <div className="space-y-1">
                  {chatHistory.filter((msg) => msg.role === "user").slice(-10).reverse().map((msg, index) => (
                    <button key={index} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#262626] rounded-lg transition-all text-left">
                      <BsChatDots className="text-[#9b9b9b] flex-shrink-0" />
                      <span className="text-sm text-[#e3e3e3] truncate">{msg.content.slice(0, 30)}{msg.content.length > 30 ? "..." : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatHistory.length === 0 && (
              <div className="px-4 py-8 text-center">
                <BsClockHistory className="text-3xl text-[#444] mx-auto mb-3" />
                <p className="text-sm text-[#666]">No recent chats</p>
                <p className="text-xs text-[#555] mt-1">Start a conversation to see it here</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-[#333]">
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#262626] rounded-lg transition-all text-[#9b9b9b]"><IoHelpCircleOutline className="text-lg" /><span className="text-sm">Help</span></button>
            <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#262626] rounded-lg transition-all text-[#9b9b9b]"><IoSettingsOutline className="text-lg" /><span className="text-sm">Settings</span></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
