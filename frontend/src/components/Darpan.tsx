"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";

// Lucide icons
import { ShieldCheck, TrendingUp, AlertTriangle, Layers, Wallet, CheckCircle2 } from "lucide-react";

const TIME_HORIZONS = ['1D', '1W', '1M', '6M', '1Y', 'ALL'];

const CHART_DATA_BY_TIMEFRAME: Record<string, { points: { date: string; value: number }[]; gain: string; gainPct: string }> = {
  '1D': {
    points: [
      { date: '09:15', value: 745210 },
      { date: '10:30', value: 752000 },
      { date: '11:45', value: 768000 },
      { date: '13:00', value: 772500 },
      { date: '14:15', value: 784000 },
      { date: '15:30', value: 793450 },
    ],
    gain: '+₹48,240',
    gainPct: '+6.47%'
  },
  '1W': {
    points: [
      { date: 'Mon', value: 764000 },
      { date: 'Tue', value: 770000 },
      { date: 'Wed', value: 768500 },
      { date: 'Thu', value: 779000 },
      { date: 'Fri', value: 785000 },
      { date: 'Today', value: 793450 },
    ],
    gain: '+₹29,450',
    gainPct: '+3.85%'
  },
  '1M': {
    points: [
      { date: '1 Jul', value: 730000 },
      { date: '8 Jul', value: 742000 },
      { date: '15 Jul', value: 738000 },
      { date: '22 Jul', value: 755000 },
      { date: '29 Jul', value: 772000 },
      { date: '4 Aug', value: 793450 },
    ],
    gain: '+₹63,450',
    gainPct: '+8.69%'
  },
  '6M': {
    points: [
      { date: 'Feb', value: 680000 },
      { date: 'Mar', value: 705000 },
      { date: 'Apr', value: 718000 },
      { date: 'May', value: 740000 },
      { date: 'Jun', value: 765000 },
      { date: 'Aug', value: 793450 },
    ],
    gain: '+₹1,13,450',
    gainPct: '+16.68%'
  },
  '1Y': {
    points: [
      { date: 'Aug 25', value: 610000 },
      { date: 'Nov 25', value: 635000 },
      { date: 'Feb 26', value: 660000 },
      { date: 'May 26', value: 690000 },
      { date: 'Jul 26', value: 735000 },
      { date: 'Aug 26', value: 793450 },
    ],
    gain: '+₹1,83,450',
    gainPct: '+30.07%'
  },
  'ALL': {
    points: [
      { date: '2023', value: 500000 },
      { date: '2024 H1', value: 540000 },
      { date: '2024 H2', value: 590000 },
      { date: '2025 H1', value: 650000 },
      { date: '2025 H2', value: 720000 },
      { date: '2026', value: 793450 },
    ],
    gain: '+₹2,93,450',
    gainPct: '+58.69%'
  }
};

const CustomSlopeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/80 text-xs">
        <div className="font-extrabold text-sm text-blue-400">
          ₹{Number(dataPoint.value).toLocaleString('en-IN')}
        </div>
        <div className="text-slate-300 mt-0.5 text-[11px]">
          Time / Date: <span className="font-semibold text-white">{dataPoint.date}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DhanDarpan() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHorizon, setSelectedHorizon] = useState('1D');

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
      // Fallback data for frontend
      setData({
        summary: { total_net_worth: 793450, todays_gain: 48240, todays_gain_percentage: 6.47 },
        holdings: [
          { symbol: 'TCS', asset_class: 'Equity', broker: 'Zerodha (CDSL)', quantity: 50, total_value: 218200, day_change: -2.4 },
          { symbol: 'HDFCBANK', asset_class: 'Equity', broker: 'Zerodha (CDSL)', quantity: 100, total_value: 218197, day_change: -1.8 },
          { symbol: 'PPFCF', asset_class: 'Mutual Funds', broker: 'Groww (CAMS)', quantity: 2500.5, total_value: 130000, day_change: 0.9 },
          { symbol: 'UTINIFTY', asset_class: 'Mutual Funds', broker: 'Kuvera (KFintech)', quantity: 450, total_value: 68362, day_change: 0.6 },
          { symbol: 'INCREDBOND', asset_class: 'Fixed Income', broker: 'Dhan Sarthi (Direct)', quantity: 1, total_value: 79345, day_change: 0.2 },
          { symbol: 'SGB2030', asset_class: 'Gold', broker: 'RBI Retail Direct', quantity: 8, total_value: 55541, day_change: 0.8 },
          { symbol: 'NEXUSREIT', asset_class: 'REITs', broker: 'Dhan Sarthi (Direct)', quantity: 180, total_value: 23805, day_change: 1.2 }
        ]
      });
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

  const COLORS = ["#1B3A6B", "#2563EB", "#14B8A6", "#EAB308", "#F97316"];
  const currentChart = CHART_DATA_BY_TIMEFRAME[selectedHorizon] || CHART_DATA_BY_TIMEFRAME['1D'];

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
          {/* Net Worth & Interactive Graph Card */}
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 text-[#1B3A6B] rounded-lg">
                    <Wallet size={20} />
                  </div>
                  <h2 className="text-slate-500 font-semibold text-sm">Total Consolidated Net Worth</h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Live Sync</span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <div className="text-4xl font-extrabold text-[#1B3A6B] tracking-tight">
                  ₹{summary.total_net_worth.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  <TrendingUp size={16} className="mr-1.5" />
                  {currentChart.gain} ({currentChart.gainPct}) in {selectedHorizon}
                </div>
              </div>

              {/* Timeframe Selectors */}
              <div className="flex items-center space-x-2 mb-2">
                {TIME_HORIZONS.map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHorizon(h)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedHorizon === h
                        ? "bg-[#1B3A6B] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Slope Trend Area Chart */}
            <div className="w-full h-44 mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChart.points} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
                  <Tooltip content={<CustomSlopeTooltip />} cursor={{ stroke: '#2563eb', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#netWorthGradient)"
                    activeDot={{ r: 7, fill: "#ffffff", stroke: "#1B3A6B", strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Layers size={18} />
              </div>
              <h2 className="text-slate-800 font-bold text-base">Asset Class Distribution</h2>
            </div>
            <div className="flex items-center justify-between gap-4 mt-2">
              {/* Left Legend */}
              <div className="space-y-2 flex-1">
                {assetAllocation.map((item: any, idx: number) => {
                  const pct = summary?.total_net_worth ? (item.value / summary.total_net_worth * 100).toFixed(1) : '0.0';
                  return (
                    <div key={item.name} className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-bold text-[#1B3A6B] ml-2">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              {/* Right Pie Chart */}
              <div className="w-36 h-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={assetAllocation} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                      {assetAllocation.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
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
                {holdings.map((h: any, idx: number) => {
                  const isRed = idx < 2 || (h.day_change !== undefined && h.day_change < 0);
                  const isPositive = !isRed;
                  const changeVal = h.day_change !== undefined ? Math.abs(h.day_change).toFixed(1) : (isRed ? '2.4' : '0.9');

                  return (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5">
                        <div className="font-bold text-slate-800 text-sm">{h.symbol}</div>
                        <div className="text-xs text-slate-400">{h.asset_class}</div>
                      </td>
                      <td className="py-3.5 text-xs font-semibold text-blue-700 bg-blue-50/60 px-2.5 py-1 rounded-md w-fit">{h.broker}</td>
                      <td className="py-3.5 text-right text-sm text-slate-600 font-medium">{h.quantity}</td>
                      <td className="py-3.5 text-right">
                        <div className="font-bold text-slate-900 text-sm">₹{h.total_value.toLocaleString('en-IN')}</div>
                        <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          <span>{isPositive ? '↗' : '↘'}</span>
                          <span>{isPositive ? '+' : '-'}{changeVal}%</span>
                        </div>
                        {/* Sparkline Graph Below Money */}
                        <div className="flex justify-end mt-1">
                          <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
                            <path
                              d={isPositive
                                ? "M 0 12 C 10 12, 14 8, 22 7 C 30 6, 36 2, 48 1"
                                : "M 0 1 C 10 1, 14 5, 22 7 C 30 9, 36 12, 48 13"}
                              stroke={isPositive ? "#16a34a" : "#dc2626"}
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
