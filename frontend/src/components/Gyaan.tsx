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
  Play,
  PlayCircle,
  GraduationCap,
  PieChart,
  BarChart3,
  FileText,
  ChevronDown,
  ArrowLeft,
  Bookmark,
  Share2,
  ThumbsUp,
  AlertTriangle,
  Users,
} from "lucide-react";

const TOPICS_DATA: Record<string, any> = {
  'What is REIT?': {
    id: 'reit',
    title: 'What is REIT?',
    readTime: '5 min read',
    subtitle: 'Earn from Real Estate, without buying it.',
    nextTopicKey: 'What is InvIT?',
    nextTopicTitle: 'Next: What is InvIT?',
    takeaways: [
      'REIT stands for Real Estate Investment Trust.',
      'It lets you invest in income-generating real estate.',
      'You earn rental income + potential capital appreciation.',
      'SEBI regulated and more transparent.',
      'Good for long-term passive income.',
    ],
    steps: [
      { label: 'REIT owns income-generating properties', iconType: 'building' },
      { label: 'Earns rental income', iconType: 'coin' },
      { label: 'Distributes 90%+ income to investors', iconType: 'people' },
      { label: 'Unit price may appreciate', iconType: 'chart' },
    ],
    example: {
      name: 'Mindspace Business Parks REIT',
      desc: 'Mindspace Business Parks REIT owns offices in India\'s top cities and earns rent from big companies.',
      linkText: 'Explore this REIT >',
    },
    suitability: [
      'You want passive income',
      'You have medium to long term horizon',
      'You want diversification beyond stocks',
      'You understand the risks involved',
    ],
    risks: [
      'Market risk: Unit prices can go down',
      'Interest rate risk: Rising rates can affect returns',
      'Property vacancy & rental risk',
    ],
  },
  'What is InvIT?': {
    id: 'invit',
    title: 'What is InvIT?',
    readTime: '5 min read',
    subtitle: 'Invest in highways, power transmission & infra assets.',
    nextTopicKey: 'Corporate Bonds 101',
    nextTopicTitle: 'Next: Corporate Bonds 101',
    takeaways: [
      'InvIT stands for Infrastructure Investment Trust.',
      'It lets individual investors own toll roads, transmission lines & solar parks.',
      'Quarterly cash distributions paid directly to unit holders.',
      'SEBI regulated infrastructure asset class.',
      'Higher yield potential than traditional fixed deposits.',
    ],
    steps: [
      { label: 'InvIT acquires operational toll roads/power grids', iconType: 'building' },
      { label: 'Collects toll & transmission fees', iconType: 'coin' },
      { label: 'Distributes 90%+ cash flows as yield', iconType: 'people' },
      { label: 'Long-term stable cash generation', iconType: 'chart' },
    ],
    example: {
      name: 'PowerGrid Infrastructure Investment Trust',
      desc: 'PowerGrid InvIT owns power transmission assets across India and distributes steady quarterly returns.',
      linkText: 'Explore this InvIT >',
    },
    suitability: [
      'You seek steady cash flow distributions',
      'You want exposure to national infrastructure projects',
      'You have a 3 to 7 year investment horizon',
      'You want high-yield passive income',
    ],
    risks: [
      'Toll traffic volume fluctuations',
      'Regulatory tariff revisions by power authorities',
      'Interest rate sensitivity',
    ],
  },
  'Corporate Bonds 101': {
    id: 'bonds',
    title: 'Corporate Bonds 101',
    readTime: '5 min read',
    subtitle: 'Earn fixed interest payouts from India\'s top corporates.',
    nextTopicKey: 'What is REIT?',
    nextTopicTitle: 'Next: What is REIT?',
    takeaways: [
      'Bonds are debt instruments issued by companies to borrow capital.',
      'Investors receive fixed periodic coupon (interest) payments.',
      'Rated by CRISIL/ICRA (e.g. AAA, AA+) for credit safety.',
      'Provides capital protection & predictable returns.',
      'Acts as a defensive cushion against equity volatility.',
    ],
    steps: [
      { label: 'Company issues bond with fixed coupon rate', iconType: 'building' },
      { label: 'Investor buys bond units', iconType: 'coin' },
      { label: 'Receives semi-annual/annual interest', iconType: 'people' },
      { label: 'Principal returned at maturity', iconType: 'chart' },
    ],
    example: {
      name: 'InCred Financial 9.5% Senior Bond',
      desc: 'InCred Financial offers 9.5% per annum fixed yield paid monthly with SEBI depositories verification.',
      linkText: 'Explore Corporate Bonds >',
    },
    suitability: [
      'You want regular fixed interest payouts',
      'You want lower volatility than direct stocks',
      'You want to balance an equity-heavy portfolio',
      'You understand credit ratings (AAA vs BBB)',
    ],
    risks: [
      'Credit/Default risk if issuer defaults',
      'Liquidity risk before maturity date',
      'Inflation eroding real returns',
    ],
  },
};

export default function Gyaan() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "tutor" | "path" | "simulators" | "readiness">("dashboard");

  // Topic Lesson Modal State
  const [selectedTopicKey, setSelectedTopicKey] = useState<string | null>(null);
  const [topicLang, setTopicLang] = useState<string>("हिंदी");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [helpfulCount, setHelpfulCount] = useState<number>(128);
  const [isHelpfulClicked, setIsHelpfulClicked] = useState<boolean>(false);

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
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. TOP HERO BANNER */}
            <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
              <div>
                <h2 className="text-3xl font-extrabold text-[#1e1b4b] leading-tight">
                  Gyaan se hi<br />nivesh ka gyaan!
                </h2>
                <p className="text-slate-600 text-sm font-medium mt-2 leading-relaxed">
                  Learn in 5 mins,<br />Invest for life.
                </p>
              </div>
              <div className="shrink-0 self-center">
                <svg width="120" height="110" viewBox="0 0 105 95" fill="none">
                  <circle cx="52" cy="50" r="40" fill="#dbeafe" opacity="0.6" />
                  <circle cx="82" cy="18" r="9" fill="#fef08a" />
                  <path d="M 82 9 A 6 6 0 0 1 82 22 L 82 24 M 79 24 L 85 24" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="34" r="14" fill="#fed7aa" />
                  <path d="M 36 65 C 36 48, 64 48, 64 65 Z" fill="#1e3a8a" />
                  <path d="M 28 58 L 50 50 L 72 58 L 72 74 L 50 66 L 28 74 Z" fill="#3b82f6" />
                  <path d="M 50 50 L 50 66" stroke="#1d4ed8" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* 2. YOUR LEARNING PROGRESS */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-900 font-bold text-lg">Your Learning Progress</h3>
                <button onClick={() => setActiveTab("path")} className="text-blue-600 font-bold text-xs hover:underline">
                  View all
                </button>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                  <div className="px-2">
                    <span className="text-2xl font-extrabold text-blue-700 block">7</span>
                    <span className="text-slate-500 text-xs font-medium mt-1 block">Topics Learned</span>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center justify-center space-x-1.5">
                      <Coins className="text-amber-500 fill-amber-200" size={20} />
                      <span className="text-2xl font-extrabold text-blue-700">250</span>
                    </div>
                    <span className="text-slate-500 text-xs font-medium mt-1 block">Gyaan Points</span>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center justify-center space-x-1.5">
                      <Flame className="text-orange-500 fill-orange-500" size={20} />
                      <span className="text-2xl font-extrabold text-blue-700">{streakDays}</span>
                    </div>
                    <span className="text-slate-500 text-xs font-medium mt-1 block">Day Streak</span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-700 h-full rounded-full" style={{ width: "70%" }} />
                  </div>
                  <div className="flex justify-between items-center mt-2.5 text-xs">
                    <span className="text-slate-500 font-medium">Keep learning! 3 more topics to unlock next badge.</span>
                    <span className="font-extrabold text-slate-800">70%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. QUICK LEARN (5 mins or less) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-900 font-bold text-lg">Quick Learn (5 mins or less)</h3>
                <button onClick={() => setActiveTab("tutor")} className="text-blue-600 font-bold text-xs hover:underline">
                  See all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div
                  onClick={() => setSelectedTopicKey("What is REIT?")}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="bg-emerald-50 h-28 rounded-xl flex items-center justify-center relative mb-3">
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Popular
                    </span>
                    <Building2 className="text-emerald-600 opacity-80" size={42} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">What is REIT?</h4>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>5 min read</span>
                    <PlayCircle className="text-blue-600" size={20} />
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  onClick={() => setSelectedTopicKey("What is InvIT?")}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="bg-purple-50 h-28 rounded-xl flex items-center justify-center relative mb-3">
                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      New
                    </span>
                    <Landmark className="text-purple-600 opacity-80" size={42} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">What is InvIT?</h4>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>5 min read</span>
                    <PlayCircle className="text-blue-600" size={20} />
                  </div>
                </div>

                {/* Card 3 */}
                <div
                  onClick={() => setSelectedTopicKey("Corporate Bonds 101")}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="bg-amber-50 h-28 rounded-xl flex items-center justify-center relative mb-3">
                    <Award className="text-amber-600 opacity-80" size={42} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Corporate Bonds 101</h4>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>5 min read</span>
                    <PlayCircle className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. CONTINUE LEARNING */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-900 font-bold text-lg">Continue Learning</h3>
              </div>

              <div
                onClick={() => setActiveTab("tutor")}
                className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="w-14 h-14 bg-blue-300 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="10" fill="#93c5fd" />
                    <path d="M 8 40 L 24 16 L 40 40 Z" fill="#1e40af" />
                    <path d="M 18 40 L 30 24 L 42 40 Z" fill="#3b82f6" opacity="0.7" />
                    <path d="M 24 16 L 24 10 L 30 13 Z" fill="#ef4444" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#064e3b] text-sm truncate">Risk vs Return: Samjho pehle, nivesh karo phir</h4>
                  <p className="text-[#047857] text-xs mt-0.5 font-medium">Part 2 of 5  •  3 min left</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex-1 bg-slate-300 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "60%" }} />
                    </div>
                    <span className="text-[#047857] text-xs font-extrabold">60%</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#065f46] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            </div>

            {/* 5. LEARN BY CATEGORY */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-900 font-bold text-lg">Learn by Category</h3>
                <button onClick={() => setActiveTab("path")} className="text-blue-600 font-bold text-xs hover:underline">
                  See all
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 text-center">
                <div onClick={() => setActiveTab("tutor")} className="cursor-pointer group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 mb-1.5 group-hover:scale-105 transition-transform">
                    <GraduationCap size={28} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Basics</span>
                </div>

                <div onClick={() => setActiveTab("tutor")} className="cursor-pointer group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1.5 group-hover:scale-105 transition-transform">
                    <BarChart3 size={28} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Equity</span>
                </div>

                <div onClick={() => setActiveTab("tutor")} className="cursor-pointer group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700 mb-1.5 group-hover:scale-105 transition-transform">
                    <PieChart size={28} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Mutual Funds</span>
                </div>

                <div onClick={() => setActiveTab("tutor")} className="cursor-pointer group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-1.5 group-hover:scale-105 transition-transform">
                    <Building2 size={28} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">REITs & InvITs</span>
                </div>

                <div onClick={() => setActiveTab("tutor")} className="cursor-pointer group">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1.5 group-hover:scale-105 transition-transform">
                    <Award size={28} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Bonds</span>
                </div>
              </div>
            </div>

            {/* 6. BEFORE YOU INVEST */}
            <div
              onClick={() => setActiveTab("readiness")}
              className="bg-[#fffbe6] border border-[#fde68a] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-[#78350f] text-base">Before You Invest</h4>
                <p className="text-[#92400e] text-xs mt-0.5 font-medium leading-normal">
                  Complete mandatory lessons before investing in new products.
                </p>
              </div>
              <button className="bg-white border border-amber-500 text-amber-800 hover:bg-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 shadow-xs">
                Explore Now
              </button>
            </div>

            {/* 7. FROM SEBI */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-slate-900 font-bold text-lg">From SEBI</h3>
                <button onClick={() => setActiveTab("readiness")} className="text-blue-600 font-bold text-xs hover:underline">
                  See all
                </button>
              </div>

              <div
                onClick={() => setActiveTab("readiness")}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                  <FileText size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">Latest SEBI Circular Explained</h4>
                  <p className="text-slate-500 text-xs mt-0.5">SEBI (LODR) Amendment Simplified</p>
                  <p className="text-slate-400 text-[11px] mt-1">4 min read  •  Hindi</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <ChevronDown size={16} />
                </div>
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
        {/* TOPIC LESSON DETAIL MODAL FOR WEB */}
        {selectedTopicKey && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {(() => {
                const topic = TOPICS_DATA[selectedTopicKey] || TOPICS_DATA["What is REIT?"];
                return (
                  <>
                    {/* Nav Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                      <button
                        onClick={() => setSelectedTopicKey(null)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <ArrowLeft size={20} className="text-slate-800" />
                      </button>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setIsBookmarked(!isBookmarked)}
                          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                          <Bookmark
                            size={20}
                            className={isBookmarked ? "text-blue-600 fill-blue-600" : "text-slate-700"}
                          />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <Share2 size={20} className="text-slate-700" />
                        </button>
                      </div>
                    </div>

                    {/* Scroll Content */}
                    <div className="p-6 overflow-y-auto space-y-6">
                      {/* Header */}
                      <div>
                        <div className="flex items-center space-x-3">
                          <h2 className="text-2xl font-extrabold text-slate-900">{topic.title}</h2>
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                            {topic.readTime}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium mt-1">{topic.subtitle}</p>
                      </div>

                      {/* Language Selector */}
                      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
                        {["English", "हिंदी", "मराठी", "தமிழ்", "বাংলা", "More ∨"].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setTopicLang(lang)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                              topicLang === lang
                                ? "bg-[#1b3a6b] text-white"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>

                      {/* Video Banner */}
                      <div className="relative rounded-2xl overflow-hidden bg-blue-100 h-44 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 340 160" preserveAspectRatio="none">
                          <rect width="340" height="160" fill="#bfdbfe" />
                          <path d="M 20 160 L 20 80 L 50 80 L 50 160 Z" fill="#93c5fd" />
                          <path d="M 60 160 L 60 50 L 100 50 L 100 160 Z" fill="#3b82f6" />
                          <path d="M 110 160 L 110 90 L 140 90 L 140 160 Z" fill="#60a5fa" />
                          <path d="M 150 160 L 150 40 L 190 40 L 190 160 Z" fill="#1d4ed8" />
                          <path d="M 200 160 L 200 70 L 240 70 L 240 160 Z" fill="#2563eb" />
                          <path d="M 250 160 L 250 85 L 290 85 L 290 160 Z" fill="#93c5fd" />
                          <path d="M 0 145 C 100 135, 240 155, 340 140 L 340 160 L 0 160 Z" fill="#15803d" opacity="0.7" />
                        </svg>
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-800 hover:scale-105 transition-transform cursor-pointer">
                            <Play size={24} fill="currentColor" className="ml-1" />
                          </div>
                        </div>
                      </div>

                      {/* Key Takeaways */}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base mb-3">Key Takeaways</h3>
                        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-5 space-y-3">
                          {topic.takeaways.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-3">
                              <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                              <span className="text-slate-800 text-xs font-medium leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* How it Works */}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base mb-3">
                          How {topic.title.replace("What is ", "")}s Work?
                        </h3>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-start gap-2">
                          {topic.steps.map((step: any, idx: number) => (
                            <div key={idx} className="flex items-center flex-1">
                              <div className="flex flex-col items-center text-center w-full">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-xs">
                                  {step.iconType === "building" && <Building2 className="text-blue-700" size={18} />}
                                  {step.iconType === "coin" && <Coins className="text-amber-600 fill-amber-200" size={18} />}
                                  {step.iconType === "people" && <Users className="text-indigo-700" size={18} />}
                                  {step.iconType === "chart" && <BarChart3 className="text-emerald-600" size={18} />}
                                </div>
                                <span className="text-[10px] font-semibold text-slate-700 leading-tight">{step.label}</span>
                              </div>
                              {idx < topic.steps.length - 1 && (
                                <span className="text-slate-400 font-bold text-sm mx-1">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real World Example */}
                      <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-4">
                        <span className="text-emerald-800 font-extrabold text-xs">Example</span>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sky-600 shrink-0 shadow-xs">
                            <Building2 size={24} />
                          </div>
                          <div>
                            <p className="text-[#047857] text-xs font-medium leading-relaxed">{topic.example.desc}</p>
                            <button className="text-[#047857] font-extrabold text-xs mt-1 hover:underline">
                              {topic.example.linkText}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Is it Right for You */}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base mb-1">Is it Right for You?</h3>
                        <p className="text-slate-500 text-xs mb-3">{topic.title.replace("What is ", "")}s may be suitable if:</p>

                        <div className="flex justify-between items-center gap-4">
                          <div className="space-y-2.5 flex-1">
                            {topic.suitability.map((item: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2.5">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                <span className="text-slate-800 text-xs font-semibold">{item}</span>
                              </div>
                            ))}
                          </div>

                          <div className="shrink-0 flex items-center justify-center">
                            <svg width="75" height="75" viewBox="0 0 80 80">
                              <circle cx="40" cy="40" r="36" fill="#dbeafe" />
                              <circle cx="40" cy="40" r="28" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
                              <circle cx="40" cy="40" r="20" fill="#dbeafe" />
                              <circle cx="40" cy="40" r="12" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
                              <circle cx="40" cy="40" r="5" fill="#1e3a8a" />
                              <path d="M 62 18 L 42 38" stroke="#1e293b" strokeWidth="3" />
                              <path d="M 66 14 L 62 18 L 68 22 Z" fill="#1e293b" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Risks to Know */}
                      <div className="bg-[#fffbe6] border border-[#fde68a] rounded-2xl p-5">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="text-amber-600" size={18} />
                          <h4 className="font-extrabold text-[#78350f] text-sm">Risks to Know</h4>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#92400e] font-medium list-disc pl-5">
                          {topic.risks.map((risk: string, idx: number) => (
                            <li key={idx}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          setIsHelpfulClicked(!isHelpfulClicked);
                          setHelpfulCount((prev) => (isHelpfulClicked ? prev - 1 : prev + 1));
                        }}
                        className={`flex items-center space-x-2 border px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          isHelpfulClicked
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <ThumbsUp size={16} />
                        <span>Helpful ({helpfulCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          if (topic.nextTopicKey) {
                            setSelectedTopicKey(topic.nextTopicKey);
                            setIsHelpfulClicked(false);
                          }
                        }}
                        className="flex-1 bg-[#1b3a6b] hover:bg-[#254b85] text-white text-xs font-bold py-3 rounded-xl transition-colors text-center shadow-xs"
                      >
                        {topic.nextTopicTitle} →
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
