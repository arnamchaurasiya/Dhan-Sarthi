"use client";

import { useState } from "react";
import axios from "axios";
import { ShieldCheck, ShieldAlert, AlertTriangle, ScanSearch, CheckCircle2, Shield, QrCode, Keyboard, Building2, Search, Check } from "lucide-react";

export default function Rakshak() {
  // Entity Verification State
  const [entityName, setEntityName] = useState("Zerodha Broking Ltd.");
  const [entityLoading, setEntityLoading] = useState(false);
  const [entityResult, setEntityResult] = useState<any>({
    found: true,
    name: "Zerodha Broking Ltd.",
    reg_no: "INZ000031633",
    category: "Stock Broker / Depository Participant",
    status: "Registered"
  });

  // Scam / Deepfake Detection State
  const [scamText, setScamText] = useState("");
  const [scamLoading, setScamLoading] = useState(false);
  const [scamResult, setScamResult] = useState<any>(null);

  // SEBI Check Tab State ('qr' | 'type' | 'account')
  const [sebiCheckTab, setSebiCheckTab] = useState<'qr' | 'type' | 'account'>('type');

  // UPI State
  const [upiId, setUpiId] = useState("");
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiResult, setUpiResult] = useState<any>(null);

  // Bank Account State
  const [ifscCode, setIfscCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accLoading, setAccLoading] = useState(false);
  const [accResult, setAccResult] = useState<any>(null);

  const [qrScanning, setQrScanning] = useState(false);

  // 1. Entity Verification
  const verifyEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName) return;
    setEntityLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/security/verify-entity", { name: entityName });
      setEntityResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEntityLoading(false);
    }
  };

  // 2. Scam Detection
  const checkScam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scamText) return;
    setScamLoading(true);
    setScamResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/security/check-scam", { text: scamText });
      setScamResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setScamLoading(false);
    }
  };

  // 3. Manual UPI Verification
  const verifyUpi = async (e?: React.FormEvent, customHandle?: string) => {
    if (e) e.preventDefault();
    const handleToTest = customHandle || upiId;
    if (!handleToTest) return;
    setUpiLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/security/verify-upi", { upi_id: handleToTest });
      setUpiResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpiLoading(false);
    }
  };

  // 4. Bank Account Verification
  const verifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ifscCode || !accountNumber) return;
    setAccLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/security/verify-account", {
        ifsc: ifscCode,
        account_number: accountNumber
      });
      setAccResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAccLoading(false);
    }
  };

  // Simulate QR Code scan
  const handleSimulateQrScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setSebiCheckTab('type');
      setUpiId('zerodha@dfc');
      verifyUpi(undefined, 'zerodha@dfc');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans pb-12">
      {/* SEBI Saarthi / SCORES Hero Banner */}
      <header className="sebi-hero-banner text-white p-8 mb-8 shadow-md relative overflow-hidden bg-[#1B3A6B]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">SEBI SCORES 2.0</span>
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

      <div className="max-w-5xl mx-auto px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Feature 1: SEBI Entity Verification */}
          <div className="bg-[#1E293B] text-white border border-slate-700/80 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <ShieldCheck className="text-blue-400" size={24} />
                <div>
                  <h2 className="font-bold text-lg text-white">SEBI Entity Verification</h2>
                  <p className="text-slate-400 text-xs">Verify before you invest</p>
                </div>
              </div>

              <form onSubmit={verifyEntity} className="mt-4 flex space-x-2">
                <input
                  type="text"
                  className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter broker or advisor name..."
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={entityLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {entityLoading ? "Checking..." : "Check"}
                </button>
              </form>
            </div>

            {entityResult && (
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100">{entityResult.name}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${entityResult.found ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                  {entityResult.found ? 'Registered ✓' : 'Unregistered ✕'}
                </span>
              </div>
            )}
          </div>

          {/* Feature 2: Deepfake / Scam Detection */}
          <div className="bg-[#1E293B] text-white border border-slate-700/80 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <ScanSearch className="text-purple-400" size={24} />
                <div>
                  <h2 className="font-bold text-lg text-white">Deepfake / Scam Detection</h2>
                  <p className="text-slate-400 text-xs">Paste suspicious WhatsApp tips here</p>
                </div>
              </div>

              <form onSubmit={checkScam} className="mt-4 space-y-3">
                <textarea
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  placeholder="Paste message..."
                  value={scamText}
                  onChange={(e) => setScamText(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Integrated with SEBI SCORES DB</span>
                  <button
                    type="submit"
                    disabled={scamLoading || !scamText}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${scamLoading || !scamText ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                  >
                    {scamLoading ? "Scanning..." : "Scan"}
                  </button>
                </div>
              </form>
            </div>

            {scamResult && (
              <div className={`mt-4 p-3 rounded-xl border text-xs ${scamResult.is_scam ? 'bg-rose-950/40 border-rose-800 text-rose-200' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'}`}>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>{scamResult.is_scam ? 'SEBI Alert: High Risk Scam' : 'SEBI Verification: Safe'}</span>
                  <span>Score: {Math.round(scamResult.scam_probability * 100)}%</span>
                </div>
                <p className="opacity-90">{scamResult.warning}</p>
              </div>
            )}
          </div>

        </div>

        {/* Feature 3: SEBI Check Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
              <Check className="text-emerald-600" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1B3A6B]">SEBI Check</h2>
              <p className="text-slate-500 text-sm">Verify the Authenticity of UPI Payment Channels with SEBI Check.</p>
            </div>
          </div>

          {/* Sub Tab Navigation */}
          <div className="flex space-x-2 border-b border-slate-200 pb-2 mb-6">
            <button
              onClick={() => setSebiCheckTab('qr')}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${sebiCheckTab === 'qr' ? 'bg-blue-50 text-[#1B3A6B] border border-blue-200 shadow-xs' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              <QrCode size={18} />
              <span>Scan QR</span>
            </button>

            <button
              onClick={() => setSebiCheckTab('type')}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${sebiCheckTab === 'type' ? 'bg-blue-50 text-[#1B3A6B] border border-blue-200 shadow-xs' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              <Keyboard size={18} />
              <span>Type</span>
            </button>

            <button
              onClick={() => setSebiCheckTab('account')}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${sebiCheckTab === 'account' ? 'bg-blue-50 text-[#1B3A6B] border border-blue-200 shadow-xs' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              <Building2 size={18} />
              <span>Account</span>
            </button>
          </div>

          {/* Sub-Tab 1: Scan QR */}
          {sebiCheckTab === 'qr' && (
            <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
              <QrCode size={72} className="text-[#1B3A6B] mb-3" />
              <p className="text-slate-600 text-sm mb-4 max-w-md">Align payment QR code within camera frame or test with simulated scanner</p>
              <button
                onClick={handleSimulateQrScan}
                disabled={qrScanning}
                className="bg-[#1B3A6B] hover:bg-[#254A85] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                {qrScanning ? "Scanning QR..." : "Simulate Camera Scan"}
              </button>
            </div>
          )}

          {/* Sub-Tab 2: Type (Manual UPI ID Verification) */}
          {sebiCheckTab === 'type' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-[#1B3A6B] tracking-wider">SEBI CHECK</h3>
                <p className="text-slate-700 font-bold text-base mt-1">Manual UPI ID Verification</p>
              </div>

              <form onSubmit={verifyUpi} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> Enter UPI ID <span className="text-rose-500 font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="username@bank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={upiLoading}
                  className="w-full bg-[#A5C2F2] hover:bg-[#8FB4EE] text-[#1B3A6B] font-bold text-base py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Search size={18} />
                  <span>{upiLoading ? "Verifying..." : "Check UPI ID"}</span>
                </button>
              </form>

              <div className={`p-4 rounded-xl text-center text-sm font-medium transition-all ${upiResult ? (upiResult.valid ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300') : 'bg-blue-50 text-slate-700 border border-blue-100'
                }`}>
                {upiResult ? upiResult.message : "Enter a valid UPI ID to enable verification."}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Account (Account Details Verification) */}
          {sebiCheckTab === 'account' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-[#1B3A6B] tracking-wider">SEBI CHECK</h3>
                <p className="text-slate-700 font-bold text-base mt-1">Account Details Verification</p>
              </div>

              <form onSubmit={verifyAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> Enter IFSC Code <span className="text-rose-500 font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                    placeholder="SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    <span className="text-rose-500">*</span> Enter Account Number <span className="text-rose-500 font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={accLoading}
                  className="w-full bg-[#A5C2F2] hover:bg-[#8FB4EE] text-[#1B3A6B] font-bold text-base py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Building2 size={18} />
                  <span>{accLoading ? "Verifying..." : "Check Account Details"}</span>
                </button>
              </form>

              <div className={`p-4 rounded-xl text-center text-sm font-medium transition-all ${accResult ? (accResult.valid ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300') : 'bg-blue-50 text-slate-700 border border-blue-100'
                }`}>
                {accResult ? accResult.message : "Enter valid IFSC and Account Number to enable verification."}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

