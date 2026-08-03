"use client";

import { useState } from "react";
import axios from "axios";
import { ShieldAlert, ShieldCheck, AlertTriangle, ScanSearch, CheckCircle2, Shield, AlertOctagon } from "lucide-react";

export default function Rakshak() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkScam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/security/check-scam", {
        text: text
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
      {/* SEBI Saarthi / SCORES Hero Banner */}
      <header className="sebi-hero-banner text-white p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">SEBI SCORES 2.0 & Protection</span>
              <span>• Dhan Rakshak</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Spot A Scam & SEBI Check</h1>
            <p className="text-blue-100 text-sm mt-1">Verify authenticity of investment advice, Telegram groups, stock tips, and UPI channels</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md text-emerald-300 px-4 py-2 rounded-xl border border-emerald-400/30 text-xs font-medium">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span>SCORES 2.0 Grievance Redressal Linked</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Scanner Input Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <ScanSearch className="text-[#1B3A6B]" size={20} />
            <h2 className="text-slate-800 font-bold text-lg">Verify Tip, WhatsApp/Telegram Link or Offer</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">Paste any suspicious investment offer, guaranteed return scheme text, or advisor contact details:</p>
          
          <form onSubmit={checkScam}>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] resize-none text-sm transition-all mb-4"
              placeholder="e.g. You have been selected for a GUARANTEED return scheme. Double your money in 30 days! Click here to join Telegram group..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-slate-400">
                <Shield size={14} className="mr-1 text-blue-600" />
                <span>Checked against SEBI registered entities database</span>
              </div>
              <button 
                type="submit" 
                disabled={loading || !text}
                className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center transition-all shadow-sm ${
                  loading || !text ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#1B3A6B] hover:bg-[#2B589A] text-white'
                }`}
              >
                {loading ? "Analyzing against SEBI registry..." : "Run SEBI Fraud Check"}
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Recommendation Box - SEBI Saarthi Spot A Scam Style */}
            <div className={`rounded-2xl p-6 shadow-sm border ${result.is_scam ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-[#DCFCE7] border-[#86EFAC] text-emerald-950'}`}>
              <div className="flex items-start space-x-4">
                {result.is_scam ? (
                  <AlertOctagon size={36} className="text-rose-600 shrink-0 mt-1" />
                ) : (
                  <CheckCircle2 size={36} className="text-emerald-600 shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-extrabold mb-1 ${result.is_scam ? 'text-rose-900' : 'text-emerald-900'}`}>
                      {result.is_scam ? 'SEBI Alert: High Risk Scam Detected' : 'SEBI Verification: Safe & Authenticated'}
                    </h3>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${result.is_scam ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'}`}>
                      Risk Score: {Math.round(result.scam_probability * 100)}%
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed mt-2">
                    <strong className="font-bold">Recommendation: </strong>
                    {result.warning}
                  </p>
                  
                  {result.is_scam && (
                    <div className="mt-4 p-4 bg-white/80 rounded-xl border border-rose-300/80">
                      <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">SEBI Safety Directives:</h4>
                      <ul className="text-xs text-rose-800 space-y-1.5 list-disc list-inside font-medium">
                        <li>Do not click any links or join unregistered social media groups promising fixed returns.</li>
                        <li>Verify SEBI registration number (RA / RIA / Broker) before transferring funds.</li>
                        <li>Lodge a formal complaint directly on the official SEBI SCORES 2.0 portal (scores.gov.in).</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

