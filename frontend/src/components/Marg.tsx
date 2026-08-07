"use client";

import { useState } from "react";
import axios from "axios";
import {
  Compass,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldAlert,
  Target,
  Sparkles,
  Award,
  BookOpen,
  Building2,
  Landmark,
  X,
  ShieldCheck,
} from "lucide-react";

const API_BASE = "https://dhan-sarthi.onrender.com";

export default function Marg() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suitabilityResult, setSuitabilityResult] = useState<any>(null);

  // Smart Checkpoint Modal State
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [checkpointData, setCheckpointData] = useState<any>(null);
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);
  const [checkpointPassed, setCheckpointPassed] = useState(false);

  const RISK_SCORE = 85;

  const assets = [
    {
      id: "NEXUS_REIT",
      name: "Nexus Select REIT",
      type: "Commercial Real Estate Trust",
      risk: "Moderate Risk",
      return: "6.2% Yield",
      min_invest: "₹290",
      icon: Building2,
    },
    {
      id: "GOI_BOND",
      name: "RBI Retail Direct Sovereign Bonds",
      type: "Government Bond",
      risk: "Low Risk",
      return: "7.1% p.a.",
      min_invest: "₹1,000",
      icon: Landmark,
    },
    {
      id: "NIFTY_IDX",
      name: "UTI Nifty 50 Index Fund",
      type: "Mutual Fund",
      risk: "Moderate Risk",
      return: "12.4% p.a.",
      min_invest: "₹500",
      icon: TrendingUp,
    },
    {
      id: "TCS_EQ",
      name: "TCS Direct Equity",
      type: "Stock Market",
      risk: "High Volatility",
      return: "15.2% p.a.",
      min_invest: "₹3,800",
      icon: Target,
    },
  ];

  const handleSelectAsset = async (asset: any) => {
    setSelectedAsset(asset);
    setLoading(true);
    setSuitabilityResult(null);
    setQ1Answer(null);
    setQ2Answer(null);
    setCheckpointPassed(false);

    try {
      // 1. Run AI Suitability Check
      const suitRes = await axios.post(`${API_BASE}/api/v1/ai/invest/suitability`, {
        user_id: "user_123",
        asset_id: asset.id,
        risk_score: RISK_SCORE,
      });
      setSuitabilityResult(suitRes.data);

      // 2. Fetch Smart Checkpoint
      const checkpointRes = await axios.post(`${API_BASE}/api/v1/ai/smart-checkpoint`, {
        user_id: "user_123",
        asset_name: asset.name,
        asset_category: asset.type,
        investment_amount: 50000,
      });
      setCheckpointData(checkpointRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans pb-12">
      {/* SEBI SAARTHI HERO BANNER */}
      <header className="sebi-hero-banner text-white p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">Investment Roadmap</span>
              <span>• Dhan Marg Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Avenue Suitability & Smart Checkpoints ⭐</h1>
            <p className="text-blue-100 text-sm mt-1">Educates retail investors at the moment of decision, eliminating mis-selling</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-emerald-300 px-4 py-2 rounded-xl border border-white/20 text-xs font-medium">
            <Target size={18} className="text-emerald-400" />
            <span>Suitability Score: 85/100</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* User Profile Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assessed Investor Profile</span>
            <h2 className="text-xl font-extrabold text-[#1B3A6B]">Aggressive Growth Profile</h2>
            <p className="text-xs text-slate-500 mt-1">Suitable for diversified equity index funds, government securities, and rated corporate debt.</p>
          </div>
          <div className="flex items-center space-x-3 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">SEBI Risk Tolerance</div>
              <div className="text-2xl font-extrabold text-[#2563EB]">{RISK_SCORE} / 100</div>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <div>
          <h2 className="text-slate-800 font-bold text-xl mb-4">Explore Avenues & Contextual Smart Checkpoints ⭐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset) => {
              const IconComp = asset.icon;
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  className={`bg-white border ${
                    isSelected ? "border-[#1B3A6B] ring-2 ring-blue-100 shadow-md" : "border-slate-200"
                  } rounded-2xl p-6 hover:border-blue-300 transition-all cursor-pointer shadow-sm space-y-4`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B3A6B] flex items-center justify-center">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{asset.name}</h3>
                        <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                          {asset.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600 font-bold text-sm flex items-center justify-end">
                        <TrendingUp size={16} className="mr-1" />
                        {asset.return}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-1">Min: {asset.min_invest}</div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-[#1B3A6B] hover:bg-[#254b85] text-white rounded-xl transition-colors text-xs font-bold shadow-sm">
                    {isSelected ? "✓ Suitability Checked — Run Smart Checkpoint ⭐" : "Invest Now (30-Sec Smart Checkpoint ⭐)"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-center space-x-3">
            <Sparkles className="text-[#1B3A6B] animate-spin" size={24} />
            <span className="text-slate-600 font-semibold text-sm">Evaluating suitability & preparing Smart Checkpoint...</span>
          </div>
        )}

        {/* SUITABILITY RESULT + SMART CHECKPOINT LAUNCH CARD */}
        {suitabilityResult && !loading && (
          <div className={`border-2 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300 ${suitabilityResult.is_suitable ? "bg-emerald-50/60 border-emerald-300" : "bg-rose-50/60 border-rose-300"}`}>
            <div className="flex items-start justify-between flex-col md:flex-row gap-4">
              <div className="flex items-start">
                {suitabilityResult.is_suitable ? (
                  <CheckCircle2 size={32} className="text-emerald-600 mr-4 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={32} className="text-rose-600 mr-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${suitabilityResult.is_suitable ? "text-emerald-900" : "text-rose-900"}`}>
                    {suitabilityResult.is_suitable ? "Suitable Investment Match" : "High Risk - Not Recommended"}
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {suitabilityResult.reason}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCheckpoint(true)}
                className="w-full md:w-auto px-6 py-3 bg-[#1B3A6B] hover:bg-[#254b85] text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2 shrink-0"
              >
                <Sparkles size={16} />
                <span>Launch 30-Sec Smart Checkpoint ⭐</span>
              </button>
            </div>
          </div>
        )}

        {/* BEHAVIORAL DATA FEEDBACK */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-[#1B3A6B] font-bold text-base mb-2">
            <Award size={20} className="text-amber-600" />
            <h3>Behavioral Data Sync with Dhan Gyaan</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Dhan Sarthi continuously tracks product understanding scores at decision time. If you pass REIT checks, Dhan Gyaan shifts focus to Bond yields and Tax optimization!
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-bold">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Understands: Mutual Funds & REIT Dividends</span>
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
              <BookOpen size={14} className="text-amber-600" />
              <span>Recommended Next: Corporate Bond Ratings</span>
            </span>
          </div>
        </div>
      </div>

      {/* SMART CHECKPOINT MODAL */}
      {showCheckpoint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#1B3A6B] font-bold text-lg">
                <Sparkles size={20} />
                <span>Smart Checkpoint ⭐</span>
              </div>
              <button onClick={() => setShowCheckpoint(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Before investing in <strong className="text-[#1B3A6B]">{selectedAsset?.name}</strong> (Amount: ₹50,000):
            </p>
            <p className="text-xs font-bold text-slate-800">Let's check your understanding in 30 seconds:</p>

            {/* Q1 */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-slate-900">Q1: REIT returns (such as {selectedAsset?.name}) mainly come from?</p>
              <button
                onClick={() => setQ1Answer(0)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  q1Answer === 0 ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                A) Stock market price speculation
              </button>
              <button
                onClick={() => setQ1Answer(1)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  q1Answer === 1 ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                B) Rental income from commercial properties (min 90% payout) ✓
              </button>
            </div>

            {/* Q2 */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-slate-900">Q2: Can the market price of a REIT unit decrease if property values drop?</p>
              <button
                onClick={() => setQ2Answer(0)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  q2Answer === 0 ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                A) Yes, market prices fluctuate based on occupancy & real estate cycles ✓
              </button>
              <button
                onClick={() => setQ2Answer(1)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  q2Answer === 1 ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                B) No, capital value is 100% fixed
              </button>
            </div>

            {!checkpointPassed ? (
              <button
                onClick={() => setCheckpointPassed(true)}
                className="w-full py-3 bg-[#1B3A6B] hover:bg-[#254b85] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Calculate Understanding Score →
              </button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl space-y-3">
                <div className="flex items-center space-x-3">
                  <ShieldCheck size={28} className="text-emerald-600" />
                  <div>
                    <h4 className="text-emerald-900 font-bold text-base">Understanding Score: 85%</h4>
                    <p className="text-emerald-700 text-xs">You understand Returns, Risks & SEBI Liquidity norms</p>
                  </div>
                </div>

                <div className="text-xs text-emerald-800 space-y-1 font-medium">
                  <p>✓ Rental Dividend Payout Engine Verified</p>
                  <p>✓ Commercial Realty Cycle Risk Verified</p>
                </div>

                <button
                  onClick={() => setShowCheckpoint(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Proceed to Invest via Dhan Marg →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
