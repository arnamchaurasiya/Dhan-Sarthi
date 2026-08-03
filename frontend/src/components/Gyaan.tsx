"use client";

import { useState } from "react";
import axios from "axios";
import { Search, BookOpen, Star, ArrowRight, ShieldCheck, Award, Sparkles } from "lucide-react";

export default function Gyaan() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const askGyaan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/ask-gyaan", {
        query: query,
        language: "English"
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans pb-12">
      {/* SEBI Saarthi Hero Banner */}
      <header className="sebi-hero-banner text-white p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">SEBI Investor Education</span>
              <span>• Dhan Gyaan Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Financial Awareness & Learning</h1>
            <p className="text-blue-100 text-sm mt-1">A guide for financial well-being — learn investor rights, products, and market safeguards</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-blue-100 px-4 py-2 rounded-xl border border-white/20 text-xs font-medium">
            <Award size={18} className="text-amber-300" />
            <span>NISM & SEBI Certified Material</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Search Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="text-[#2563EB]" size={20} />
            <h2 className="text-slate-800 font-bold text-lg">What do you want to learn today?</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">Ask any question about Securities Markets, KYC procedures, Mutual Funds, or Fraud Prevention.</p>
          <form onSubmit={askGyaan} className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-32 py-3.5 border border-slate-300 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-sm transition-all"
              placeholder="e.g. How do Mutual Funds work? What is a REIT?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute inset-y-1.5 right-1.5 px-5 bg-[#1B3A6B] hover:bg-[#2B589A] text-white font-semibold text-sm rounded-lg transition-colors flex items-center shadow-sm"
            >
              {loading ? "Analyzing..." : "Ask SEBI Saarthi AI"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-md animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#1B3A6B]">{result.topic}</h3>
              <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-300 text-xs font-bold">
                <Star size={14} className="mr-1 fill-amber-500 text-amber-500" />
                <span>Badge Unlocked: {result.badge_awarded}</span>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed text-base mb-6">
              {result.explanation}
            </p>
            
            <div className="border-t border-slate-100 pt-4 flex items-center text-[#2563EB] hover:text-[#1B3A6B] cursor-pointer w-max font-semibold text-sm">
              <BookOpen size={18} className="mr-2" />
              <span>Take a quick quiz to earn 50 Gyaan Coins</span>
              <ArrowRight size={18} className="ml-2" />
            </div>
          </div>
        )}
        
        {!result && !loading && (
          <div>
            <h2 className="text-slate-800 font-bold text-xl mb-4">Featured SEBI Investor Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1B3A6B] flex items-center justify-center mb-4 group-hover:bg-[#1B3A6B] group-hover:text-white transition-colors">
                  <BookOpen size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Securities Markets</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Learn how stock exchanges, clearing corporations, and depositories operate safely.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">KYC & Investor Rights</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Understand One-Time E-KYC, KRA verification, and grievance redressal rights under SCORES 2.0.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Award size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Mutual Funds & Debt Avenues</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Guide on investment asset classes, risk profiles, NAV calculations, and SIP compounding.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

