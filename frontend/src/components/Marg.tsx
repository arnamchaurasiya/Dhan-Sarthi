"use client";

import { useState } from "react";
import axios from "axios";
import { Compass, CheckCircle2, XCircle, TrendingUp, ShieldAlert, Zap, Target } from "lucide-react";

export default function Marg() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Mock User Profile Risk Score
  const RISK_SCORE = 85; 

  const checkSuitability = async (assetId: string) => {
    setSelectedAsset(assetId);
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/invest/suitability", {
        user_id: "user_123",
        asset_id: assetId,
        risk_score: RISK_SCORE
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assets = [
    { id: "NIFTY_IDX", name: "Nifty 50 Index Fund", type: "Mutual Fund", risk: "Moderate", return: "12% p.a." },
    { id: "GOI_BOND", name: "RBI Retail Direct Bonds", type: "Govt Bond", risk: "Low", return: "7.1% p.a." },
    { id: "TCS_EQ", name: "TCS Direct Equity", type: "Stock", risk: "High", return: "15% p.a." },
    { id: "CRYPTO_X", name: "Unregulated Tokens", type: "High Risk", risk: "Very High", return: "Unpredictable" }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans pb-12">
      {/* SEBI Saarthi Hero Banner */}
      <header className="sebi-hero-banner text-white p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">Investment Roadmap</span>
              <span>• Dhan Marg</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Investment Avenue & Suitability Guide</h1>
            <p className="text-blue-100 text-sm mt-1">SEBI-aligned risk assessment engine ensuring product suitability for retail investors</p>
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

        <div>
          <h2 className="text-slate-800 font-bold text-xl mb-4">Explore Investment Avenues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className={`bg-white border ${selectedAsset === asset.id ? 'border-[#2563EB] ring-2 ring-blue-100 shadow-md' : 'border-slate-200/80'} rounded-2xl p-6 hover:border-blue-300 transition-all cursor-pointer shadow-sm`}
                onClick={() => checkSuitability(asset.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{asset.name}</h3>
                    <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                      {asset.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 font-bold text-sm flex items-center justify-end">
                      <TrendingUp size={16} className="mr-1" />
                      {asset.return}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-1">Risk Profile: {asset.risk}</div>
                  </div>
                </div>
                
                <button className="w-full py-2.5 bg-[#1B3A6B] hover:bg-[#2B589A] text-white rounded-xl transition-colors text-xs font-semibold shadow-sm">
                  Select & Run SEBI Suitability Check
                </button>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-center space-x-3">
             <Zap className="text-[#2563EB] animate-spin" size={24} />
             <span className="text-slate-600 font-semibold text-sm">Evaluating asset against SEBI investor risk profile...</span>
          </div>
        )}

        {result && !loading && (
          <div className={`border-2 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300 ${result.is_suitable ? 'bg-emerald-50/50 border-emerald-300' : 'bg-rose-50/50 border-rose-300'}`}>
            <div className="flex items-start">
              {result.is_suitable ? (
                <CheckCircle2 size={32} className="text-emerald-600 mr-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle size={32} className="text-rose-600 mr-4 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`text-xl font-bold mb-2 ${result.is_suitable ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {result.is_suitable ? 'Suitable Investment Match' : 'High Risk - Not Recommended'}
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm mb-4">
                  {result.reason}
                </p>
                
                {result.is_suitable ? (
                  <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm">
                    Proceed with Verified Broker / UPI
                  </button>
                ) : (
                  <div className="flex items-center text-rose-700 text-xs font-semibold bg-rose-100/70 px-3 py-2 rounded-lg border border-rose-200">
                    <ShieldAlert size={16} className="mr-2 shrink-0" />
                    SEBI Nudge: Investing in this asset class requires explicit risk acknowledgment under SEBI guidelines.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

