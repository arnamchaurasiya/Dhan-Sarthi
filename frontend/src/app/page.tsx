"use client";

import { useState } from "react";
import Darpan from "../components/Darpan";
import Gyaan from "../components/Gyaan";
import Marg from "../components/Marg";
import Rakshak from "../components/Rakshak";
import { LayoutDashboard, BookOpen, Compass, ShieldAlert, ShieldCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("darpan");

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation - SEBI Navy Style */}
      <aside className="w-full md:w-64 bg-[#1B3A6B] text-white p-6 flex flex-col shadow-lg border-r border-[#2B589A]">
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white text-[#1B3A6B] rounded-lg font-black text-xl flex items-center justify-center shadow-md tracking-tighter">
              SEBI
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Dhan Sarthi
              </h1>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                Super App for Retail Investors
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-blue-800/60 flex items-center text-[11px] text-blue-200">
            <ShieldCheck size={14} className="text-emerald-400 mr-1.5" />
            <span>हर निवेशक की ताकत</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("darpan")}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'darpan' 
                ? 'bg-white text-[#1B3A6B] shadow-md font-semibold' 
                : 'text-blue-100 hover:bg-[#2B589A]/50 hover:text-white'
            }`}
          >
            <LayoutDashboard className="mr-3" size={20} />
            Dhan Darpan
          </button>
          
          <button 
            onClick={() => setActiveTab("gyaan")}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'gyaan' 
                ? 'bg-white text-[#1B3A6B] shadow-md font-semibold' 
                : 'text-blue-100 hover:bg-[#2B589A]/50 hover:text-white'
            }`}
          >
            <BookOpen className="mr-3" size={20} />
            Dhan Gyaan
          </button>

          <button 
            onClick={() => setActiveTab("marg")}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'marg' 
                ? 'bg-white text-[#1B3A6B] shadow-md font-semibold' 
                : 'text-blue-100 hover:bg-[#2B589A]/50 hover:text-white'
            }`}
          >
            <Compass className="mr-3" size={20} />
            Dhan Marg
          </button>

          <button 
            onClick={() => setActiveTab("rakshak")}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'rakshak' 
                ? 'bg-white text-[#1B3A6B] shadow-md font-semibold' 
                : 'text-blue-100 hover:bg-[#2B589A]/50 hover:text-white'
            }`}
          >
            <ShieldAlert className="mr-3" size={20} />
            Dhan Rakshak
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-blue-800/60">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-700/60 text-white flex items-center justify-center font-bold border border-blue-500">
              PR
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">Priya Sharma</p>
              <div className="flex items-center text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>
                SEBI Verified Investor
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "darpan" && <Darpan />}
        {activeTab === "gyaan" && <Gyaan />}
        {activeTab === "marg" && <Marg />}
        {activeTab === "rakshak" && <Rakshak />}
      </main>
    </div>
  );
}

