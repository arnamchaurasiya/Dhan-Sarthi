"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Lucide icons
import { ShieldCheck, TrendingUp, AlertTriangle, Layers, Wallet, CheckCircle2 } from "lucide-react";

export default function DhanDarpan() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We first "consent" then fetch
    axios.post("http://127.0.0.1:8000/api/v1/mock-dpi/aa/consent", {
      user_id: "user_123",
      fip_ids: ["fip_zerodha", "fip_cams"]
    }).then(res => {
      const handle = res.data.consent_handle;
      return axios.get(`http://127.0.0.1:8000/api/v1/mock-dpi/aa/fetch-holdings/${handle}`);
    }).then(res => {
      setData(res.data.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] text-slate-800">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#1B3A6B] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Fetching unified portfolio via Sahamati AA...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-slate-700">Failed to load portfolio data.</div>;

  const { summary, holdings } = data;

  // Aggregate by asset class for the pie chart
  const assetAllocation = holdings.reduce((acc: any, item: any) => {
    const existing = acc.find((a: any) => a.name === item.asset_class);
    if (existing) {
      existing.value += item.total_value;
    } else {
      acc.push({ name: item.asset_class, value: item.total_value });
    }
    return acc;
  }, []);

  const COLORS = ["#1B3A6B", "#2563EB", "#16A34A", "#D97706"];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans pb-12">
      {/* SEBI Saarthi Hero Banner */}
      <header className="sebi-hero-banner text-white p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">SEBI Registered</span>
              <span>• Dhan Darpan</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Unified Portfolio Mirror</h1>
            <p className="text-blue-100 text-sm mt-1">Real-time consolidated view of equity, mutual funds, and bonds across depositories</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-emerald-300 px-4 py-2 rounded-xl border border-white/20 text-xs font-medium">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span>Encrypted via Sahamati Account Aggregator</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Net Worth Card */}
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-[#1B3A6B] rounded-lg">
                  <Wallet size={20} />
                </div>
                <h2 className="text-slate-500 font-semibold text-sm">Total Consolidated Net Worth</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Live Sync</span>
            </div>
            <div className="text-4xl font-extrabold text-[#1B3A6B] mb-4 tracking-tight">₹{summary.total_net_worth.toLocaleString('en-IN')}</div>
            <div className="flex items-center text-emerald-600 text-sm font-semibold bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
              <TrendingUp size={18} className="mr-2" />
              +₹{summary.todays_gain.toLocaleString('en-IN')} (+{summary.todays_gain_percentage}%) gain today
            </div>
          </div>

          {/* Portfolio Health Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-slate-500 font-semibold text-sm">Portfolio Health Score</h2>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-amber-600">78</span>
                <span className="text-slate-400 font-medium text-sm">/ 100</span>
              </div>
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start space-x-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-amber-900 font-medium leading-relaxed">High concentration (55%) in Direct Equity. SEBI recommends rebalancing into Debt or Sovereign Gold Bonds.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Asset Allocation Chart */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 self-start mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Layers size={18} />
              </div>
              <h2 className="text-slate-700 font-bold text-base">Asset Allocation</h2>
            </div>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assetAllocation} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                    {assetAllocation.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {assetAllocation.map((item: any, idx: number) => (
                <div key={item.name} className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  <div className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Holdings List */}
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h2 className="text-slate-800 font-bold text-base mb-4">Verified Holdings (Cross-Broker & Depositories)</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 font-semibold">Asset / Symbol</th>
                  <th className="pb-3 font-semibold">Depository / Source</th>
                  <th className="pb-3 font-semibold text-right">Quantity</th>
                  <th className="pb-3 font-semibold text-right">Current Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holdings.map((h: any, idx: number) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-800 text-sm">{h.symbol}</div>
                      <div className="text-xs text-slate-400">{h.asset_class}</div>
                    </td>
                    <td className="py-3.5 text-xs font-semibold text-blue-700 bg-blue-50/60 px-2.5 py-1 rounded-md w-fit">{h.broker}</td>
                    <td className="py-3.5 text-right text-sm text-slate-600 font-medium">{h.quantity}</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 text-sm">₹{h.total_value.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

