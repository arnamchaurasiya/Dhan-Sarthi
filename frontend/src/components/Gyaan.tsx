"use client";

import { useState } from "react";
import axios from "axios";
import {
  Search,
  BookOpen,
  Star,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Flame,
  TrendingUp,
  Building2,
  Coins,
  Landmark,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

const API_BASE = "https://dhan-sarthi.onrender.com";

export default function Gyaan() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "tutor" | "path" | "simulators" | "readiness">("dashboard");

  // User Gamification State
  const [streakDays, setStreakDays] = useState(7);
  const [gyaanCoins, setGyaanCoins] = useState(350);
  const [activeBadge, setActiveBadge] = useState("Beginner Investor Badge");

  // AI Tutor State
  const [query, setQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; topic?: string; badge?: string }>>([
    {
      sender: "ai",
      text: "👋 Namaste Arnam! I am your AI Financial Tutor. Ask me anything about REITs, Mutual Funds, Bonds, or Stock Market risks in your preferred language.",
    },
  ]);

  // Quiz Modal State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // SIP Simulator State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipReturnRate, setSipReturnRate] = useState(12);

  // Bond Simulator State
  const [bondInvestment, setBondInvestment] = useState(100000);
  const [bondYield, setBondYield] = useState(8);

  // Readiness Checklist
  const [readinessChecklist, setReadinessChecklist] = useState([
    { id: 1, title: "What is a REIT / Commercial Realty Trust?", checked: true },
    { id: 2, title: "Risk involved & dividend yield fluctuations", checked: true },
    { id: 3, title: "Expected rental distribution schedule (90% payout)", checked: true },
    { id: 4, title: "Liquidity & lock-in requirements under SEBI norms", checked: false },
  ]);
  const [certificationCompleted, setCertificationCompleted] = useState(false);

  const languages = ["English", "Hindi", "Punjabi", "Tamil", "Telugu", "Marathi"];

  // Calculate SIP wealth formula
  const calculateSIP = () => {
    const i = sipReturnRate / 12 / 100;
    const n = sipYears * 12;
    const futureVal = sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedVal = sipMonthly * n;
    const wealthGain = futureVal - investedVal;
    return {
      futureVal: Math.round(futureVal),
      investedVal: Math.round(investedVal),
      wealthGain: Math.round(wealthGain),
    };
  };

  // Calculate Bond Returns
  const calculateBond = () => {
    const annualPayout = (bondInvestment * bondYield) / 100;
    const totalReturn5Yrs = bondInvestment + annualPayout * 5;
    return {
      annualPayout: Math.round(annualPayout),
      monthlyPayout: Math.round(annualPayout / 12),
      totalReturn5Yrs: Math.round(totalReturn5Yrs),
    };
  };

  const askGyaan = async (promptText?: string) => {
    const textToAsk = promptText || query;
    if (!textToAsk.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: textToAsk }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/ask-gyaan`, {
        query: textToAsk,
        language: selectedLang,
      });

      const data = res.data;
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.explanation || `Here is a bite-sized lesson on ${textToAsk}.`,
          topic: data.topic,
          badge: data.badge_awarded,
        },
      ]);
    } catch (err) {
      let fallbackText = `A REIT is like owning a small part of a commercial property without buying the whole building. Example: Instead of buying a ₹5 crore mall, you can invest ₹5,000 and earn proportional rental income!`;
      if (selectedLang === "Hindi") {
        fallbackText = `REIT (रीट) एक व्यावसायिक संपत्ति में छोटी हिस्सेदारी खरीदने जैसा है। उदाहरण: ₹5 करोड़ का पूरा मॉल खरीदने के बजाय, आप ₹5,000 का निवेश कर किराए की आय कमा सकते हैं!`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: fallbackText,
          topic: textToAsk,
          badge: "Market Explorer",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (selectedIndex: number) => {
    setQuizAnswered(true);
    setQuizScore(selectedIndex === 1 ? 100 : 0);
    if (selectedIndex === 1) {
      setGyaanCoins((prev) => prev + 50);
      setActiveBadge("REIT Master");
    }
  };

  const sipResults = calculateSIP();
  const bondResults = calculateBond();

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans pb-16">
      {/* SEBI SAARTHI HERO BANNER */}
      <header className="sebi-hero-banner text-white p-8 mb-4 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">SEBI Investor Education</span>
              <span>• Dhan Gyaan Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Financial Awareness & Learning</h1>
            <p className="text-blue-100 text-sm mt-1">A guide for financial well-being — learn investor rights, products, and market safeguards</p>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-amber-300 px-4 py-2 rounded-xl border border-white/20 text-xs font-bold shadow-sm">
            <Coins size={18} className="text-amber-300" />
            <span>{gyaanCoins} Gyaan Coins</span>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex space-x-2 overflow-x-auto py-3 no-scrollbar">
          {[
            { id: "dashboard", label: "Home Dashboard", icon: BookOpen },
            { id: "tutor", label: "AI Financial Tutor", icon: Sparkles },
            { id: "path", label: "Learning Path", icon: TrendingUp },
            { id: "simulators", label: "Simulators", icon: Sliders },
            { id: "readiness", label: "Smart Checkpoints ⭐", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#1B3A6B] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD / HOME */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* USER GREETING & STREAK BANNER */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1B3A6B]">👋 Hi Arnam,</h2>
                <p className="text-slate-500 text-sm mt-1">Based on your portfolio, learn what matters for you.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-rose-700 text-xs font-bold">
                  <Flame size={16} fill="currentColor" className="text-rose-500" />
                  <span>{streakDays} Day Learning Streak</span>
                </div>
                <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-amber-800 text-xs font-bold">
                  <Award size={16} className="text-amber-600" />
                  <span>{activeBadge}</span>
                </div>
              </div>
            </div>

            {/* SECTION 1: CONTINUE LEARNING CARD */}
            <div>
              <h2 className="text-slate-800 font-bold text-xl mb-4">Section 1: "Continue Learning"</h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2 bg-blue-50 text-[#1B3A6B] px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                    <BookOpen size={14} />
                    <span>Continue Learning</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-medium">
                    <Clock size={14} />
                    <span>⏱ 3 mins remaining</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-1">Understanding REITs</h3>
                <p className="text-slate-500 text-xs mb-4">Real Estate Investment Trusts & Commercial Yields</p>

                <div className="flex items-center space-x-3 mb-5">
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-[#1B3A6B] h-full rounded-full" style={{ width: "70%" }} />
                  </div>
                  <span className="text-[#1B3A6B] text-xs font-bold">70%</span>
                </div>

                <button
                  onClick={() => setActiveTab("tutor")}
                  className="w-full bg-[#1B3A6B] hover:bg-[#254b85] text-white font-bold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Resume →</span>
                </button>
              </div>
            </div>

            {/* SECTION 5: EXPLAIN MY PORTFOLIO FEATURE */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-slate-800 font-bold text-xl">5. "Explain My Portfolio" Feature ⭐</h2>
                  <p className="text-slate-500 text-xs">Connects Dhan Darpan + Dhan Gyaan</p>
                </div>
              </div>

              <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-[#1B3A6B] font-bold text-base">Your Portfolio Summary</h3>
                  <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-lg text-xs font-bold border border-rose-200">
                    <ShieldAlert size={14} />
                    <span>75% Equity Exposure ⚠️</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-700 py-1 border-b border-slate-100">
                    <span>Reliance Industries</span>
                    <span className="font-semibold text-slate-900">₹1,20,000 (Equity)</span>
                  </div>
                  <div className="flex justify-between text-slate-700 py-1 border-b border-slate-100">
                    <span>HDFC Mutual Fund</span>
                    <span className="font-semibold text-slate-900">₹80,000 (Equity)</span>
                  </div>
                  <div className="flex justify-between text-slate-500 py-1">
                    <span>Bonds & Debt Allocation</span>
                    <span className="text-rose-600 font-bold">No Bonds (0%)</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
                  <Sparkles className="text-[#1B3A6B] shrink-0 mt-0.5" size={18} />
                  <p className="text-slate-700 text-xs leading-relaxed">
                    <strong>AI Portfolio Analysis:</strong> Your portfolio has high concentration risk in Equities without bond cushions. What you should learn right now:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div onClick={() => setActiveTab("path")} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer hover:border-blue-300 transition-colors">
                    <BookOpen size={16} className="text-[#1B3A6B]" />
                    <span>📚 Why diversification matters</span>
                  </div>
                  <div onClick={() => setActiveTab("simulators")} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer hover:border-emerald-300 transition-colors">
                    <Landmark size={16} className="text-emerald-600" />
                    <span>📚 Introduction to Bonds</span>
                  </div>
                  <div onClick={() => setActiveTab("readiness")} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer hover:border-amber-300 transition-colors">
                    <ShieldCheck size={16} className="text-amber-600" />
                    <span>📚 Understanding Risk</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("path")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Start Learning →
                </button>
              </div>
            </div>

            {/* SECTION 4: LEARNING CATEGORIES */}
            <div>
              <h2 className="text-slate-800 font-bold text-xl mb-4">4. Learning Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: "📈 Stock Market", sub: "Beginner → Advanced", color: "bg-blue-50 text-blue-900 border-blue-200" },
                  { title: "🏢 REITs & InvITs", sub: "Passive income explained", color: "bg-purple-50 text-purple-900 border-purple-200" },
                  { title: "💰 Mutual Funds", sub: "SIP, NAV, Expense Ratio", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
                  { title: "🏦 Bonds", sub: "Fixed income investing", color: "bg-amber-50 text-amber-900 border-amber-200" },
                  { title: "🛡 Investor Safety", sub: "Frauds & scams", color: "bg-rose-50 text-rose-900 border-rose-200" },
                  { title: "📑 Tax & ITR", sub: "Capital gains explained", color: "bg-cyan-50 text-cyan-900 border-cyan-200" },
                ].map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab("tutor")}
                    className={`bg-white border ${cat.color} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
                  >
                    <h3 className="font-bold text-slate-900 text-base">{cat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{cat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: AI FINANCIAL TUTOR */}
        {/* ======================================================== */}
        {activeTab === "tutor" && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-[#1B3A6B] font-bold text-xl mb-1">
                <Sparkles size={22} />
                <h2>3. AI Financial Tutor (Main Feature)</h2>
              </div>
              <p className="text-slate-500 text-xs mb-4">Ask anything about investing in 12 Indian languages</p>

              {/* LANGUAGE SELECTION */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedLang === lang
                        ? "bg-[#1B3A6B] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* SAMPLE PROMPT SUGGESTIONS */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["What is REIT?", "Why diversify beyond stocks?", "How do Mutual Funds work?"].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => askGyaan(prompt)}
                    className="bg-blue-50 border border-blue-200 text-[#1B3A6B] text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>

              {/* CHAT MESSAGES STREAM */}
              <div className="space-y-4 min-h-[260px] max-h-[420px] overflow-y-auto pr-2 mb-6 no-scrollbar">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#1B3A6B] text-white"
                          : "bg-slate-50 text-slate-800 border border-slate-200"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.sender === "ai" && msg.topic && (
                        <div
                          onClick={() => setShowQuiz(true)}
                          className="mt-3 pt-2.5 border-t border-slate-200 flex items-center space-x-2 text-[#1B3A6B] hover:text-blue-800 font-bold text-xs cursor-pointer"
                        >
                          <BookOpen size={15} />
                          <span>Take quick quiz to earn 50 Gyaan Coins →</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 text-slate-500 border border-slate-200 rounded-2xl p-4 text-xs flex items-center space-x-2">
                      <Sparkles size={16} className="animate-spin text-[#1B3A6B]" />
                      <span>AI Financial Tutor is generating response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CHAT INPUT FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askGyaan();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1B3A6B] transition-colors"
                  placeholder={`Ask anything about investing in ${selectedLang}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1B3A6B] hover:bg-[#254b85] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                  Ask AI
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PERSONALIZED LEARNING PATH */}
        {/* ======================================================== */}
        {activeTab === "path" && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1B3A6B] mb-1">2. AI Personalized Learning Path</h2>
              <p className="text-slate-500 text-xs mb-6">Tailored from your holdings instead of "Browse all courses"</p>

              {/* PROFILE SUMMARY */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <h3 className="text-[#1B3A6B] font-bold text-sm mb-3">Your Investment Profile</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400 text-xs block">Age</span>
                    <span className="text-slate-900 font-bold text-sm">25</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400 text-xs block">Income</span>
                    <span className="text-slate-900 font-bold text-sm">₹80,000/month</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400 text-xs block">Portfolio</span>
                    <span className="text-[#1B3A6B] font-bold text-sm">80% Equity</span>
                  </div>
                </div>
              </div>

              {/* PATH TIMELINE */}
              <h3 className="text-[#1B3A6B] font-bold text-base mb-4">Your Recommended Path:</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Basics of Mutual Funds", status: "completed", tag: "✅ Completed" },
                  { step: "2", title: "Why diversify beyond stocks?", status: "in_progress", tag: "🔥 In Progress" },
                  { step: "3", title: "REITs explained", status: "up_next", tag: "📚 Up Next" },
                  { step: "4", title: "Understanding Bonds", status: "locked", tag: "📊 Locked" },
                  { step: "5", title: "Build your first balanced portfolio", status: "locked", tag: "🎯 Goal" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      item.status === "in_progress"
                        ? "bg-blue-50 border-blue-300 text-slate-900"
                        : item.status === "completed"
                        ? "bg-emerald-50 border-emerald-200 text-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-sm text-slate-400">{item.step}.</span>
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white border border-slate-200">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: INTERACTIVE SIMULATORS */}
        {/* ======================================================== */}
        {activeTab === "simulators" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-slate-900 font-bold text-xl mb-1">6. Interactive Simulators</h2>
              <p className="text-slate-500 text-xs">Calculators for SIP compounding and bond yield</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SIP CALCULATOR */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-lg">
                  <TrendingUp size={20} />
                  <h3>SIP Simulator</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Monthly Investment:</span>
                      <span className="text-emerald-700 font-bold">₹{sipMonthly.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      step="500"
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Duration:</span>
                      <span className="text-emerald-700 font-bold">{sipYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Expected Return (% p.a.):</span>
                      <span className="text-emerald-700 font-bold">{sipReturnRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={sipReturnRate}
                      onChange={(e) => setSipReturnRate(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <span className="text-slate-500 text-xs block mb-1">Your Future Wealth</span>
                  <span className="text-emerald-700 text-3xl font-black">₹{(sipResults.futureVal / 100000).toFixed(1)} Lakhs</span>
                  <div className="flex justify-between text-xs text-slate-600 mt-3 pt-3 border-t border-emerald-200">
                    <span>Invested: ₹{(sipResults.investedVal / 100000).toFixed(1)} L</span>
                    <span className="text-emerald-700 font-bold">Wealth Gain: +₹{(sipResults.wealthGain / 100000).toFixed(1)} L</span>
                  </div>
                </div>
              </div>

              {/* BOND CALCULATOR */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-lg">
                  <Landmark size={20} />
                  <h3>Bond Simulator</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Investment Amount:</span>
                      <span className="text-amber-700 font-bold">₹{bondInvestment.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={bondInvestment}
                      onChange={(e) => setBondInvestment(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>Yield Rate (% p.a.):</span>
                      <span className="text-amber-700 font-bold">{bondYield}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="12"
                      step="0.25"
                      value={bondYield}
                      onChange={(e) => setBondYield(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <span className="text-slate-500 text-xs block mb-1">Annual Interest Payout</span>
                  <span className="text-amber-700 text-3xl font-black">₹{bondResults.annualPayout.toLocaleString()} / year</span>
                  <p className="text-amber-800 text-xs mt-2">(Equivalent to ₹{bondResults.monthlyPayout.toLocaleString()} / month fixed income)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SMART CHECKPOINTS (DECISION SUPPORT ENGINE) */}
        {/* ======================================================== */}
        {activeTab === "readiness" && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
            <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xl mb-1">
                <ShieldCheck size={24} />
                <h2>Smart Checkpoints ⭐ (Decision Support Layer)</h2>
              </div>
              <p className="text-slate-500 text-xs">
                "Dhan Gyaan doesn't teach investors after mistakes; it educates them at the moment of decision."
              </p>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-[#1B3A6B] font-bold text-base mb-1">Decision Checkpoint: Nexus Select REIT</h3>
                <p className="text-slate-500 text-xs mb-4">Instead of 10-minute videos, Dhan Gyaan runs 30-second decision checks when you click "Invest Now":</p>

                <div className="space-y-2.5 text-xs">
                  {readinessChecklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setReadinessChecklist((prev) =>
                          prev.map((c) => (c.id === item.id ? { ...c, checked: !c.checked } : c))
                        )
                      }
                      className="flex items-center space-x-3 text-slate-800 cursor-pointer hover:text-slate-900"
                    >
                      <CheckCircle2 size={18} className={item.checked ? "text-emerald-600" : "text-slate-400"} />
                      <span className={item.checked ? "line-through text-slate-400" : ""}>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-700">
                <Sparkles size={18} className="text-[#1B3A6B] shrink-0 mt-0.5" />
                <p>
                  <strong>Behavioral Feedback Loop:</strong> Your understanding score (85%) automatically updates your profile so Dhan Gyaan personalizes your future learning journey!
                </p>
              </div>

              <button
                onClick={() => setCertificationCompleted(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm"
              >
                {certificationCompleted ? "✓ Understanding Verified! Proceed to Invest via Dhan Marg →" : "Run 30-Second Smart Checkpoint →"}
              </button>

              {certificationCompleted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2 font-medium">
                  <CheckCircle2 size={16} />
                  <span>Certified Ready! SEBI Understanding Score: 85%. Proceeding to Dhan Marg.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE QUIZ MODAL */}
      {showQuiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[#1B3A6B] font-bold text-lg">Quick Quiz 🧠</h3>
              <button onClick={() => setShowQuiz(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              What is the key advantage of a REIT compared to buying physical commercial property?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleQuizAnswer(0)}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs p-3 rounded-xl transition-colors border border-slate-200"
              >
                A) Guarantees double returns in 30 days
              </button>
              <button
                onClick={() => handleQuizAnswer(1)}
                className={`w-full text-left text-xs p-3 rounded-xl transition-colors border ${
                  quizAnswered && quizScore === 100
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                B) Low entry investment (₹5,000) & regular rental yields without management hassle
              </button>
              <button
                onClick={() => handleQuizAnswer(2)}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs p-3 rounded-xl transition-colors border border-slate-200"
              >
                C) Has no SEBI regulations
              </button>
            </div>

            {quizAnswered && (
              <div className="text-center pt-2">
                <p className="text-emerald-700 font-bold text-sm mb-3">🎉 Correct! +50 Gyaan Coins Earned!</p>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="bg-[#1B3A6B] text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Claim & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
