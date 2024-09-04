// Sidebar.js
"use client"
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed "}`}>
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
          <div className="h-[50vh] overflow-auto">
            {/* Placeholder content */}
            {Array.from({ length: 25 }, (_, i) => (
              <h1 key={i} className="bg-white bg-opacity-10 my-2 p-2 rounded-lg hover:bg-opacity-20 transition-all cursor-pointer">as</h1>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
