// ─── Dhan Darpan Shared Data Layer ───────────────────────────────────────────
// All mock data, types, constants, and helper functions used across all
// Dhan Darpan screens live here to avoid duplication.

export interface Holding {
  symbol: string;
  name: string;
  asset_class: string;
  broker: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  total_value: number;
  day_change: number;
  sparkline: number[];
  isin: string;
  stcg: number;
  ltcg: number;
  day_high: number;
  day_low: number;
  sector?: string;
  portfolio_weight?: number;
}

export interface Transaction {
  id: string;
  date: string;
  month: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST' | 'SIP' | 'OTHER';
  asset: string;
  asset_name: string;
  platform: string;
  amount: number;
  units?: number;
  price?: number;
  fees?: number;
  asset_class: string;
  impact?: string;
}

export interface RiskDriver {
  label: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  value: number;
  holdings: { name: string; pct: number }[];
}

export interface ConnectedAccount {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: 'connected' | 'syncing' | 'error';
  lastSynced: string;
  holdings: number;
  dataTypes: string[];
}

export interface PortfolioInsight {
  id: string;
  color: string;
  emoji: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  action?: string;
  actionTarget?: string;
}

// ─── Holdings ─────────────────────────────────────────────────────────────────
export const DEFAULT_HOLDINGS: Holding[] = [
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    asset_class: 'Equity',
    broker: 'Zerodha (CDSL)',
    quantity: 50,
    avg_price: 3500.0,
    current_price: 4364.0,
    total_value: 218200.0,
    day_change: -2.4,
    sparkline: [4364, 4320, 4290, 4280, 4250, 4210],
    isin: 'INE467B01029',
    stcg: 0,
    ltcg: 43200,
    day_high: 4400.0,
    day_low: 4200.0,
    sector: 'Information Technology',
    portfolio_weight: 27.5,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    asset_class: 'Equity',
    broker: 'Zerodha (CDSL)',
    quantity: 100,
    avg_price: 1600.0,
    current_price: 2181.97,
    total_value: 218197.0,
    day_change: -1.8,
    sparkline: [2181.97, 2170, 2150, 2140, 2120, 2100],
    isin: 'INE040A01034',
    stcg: 58197,
    ltcg: 0,
    day_high: 2200.0,
    day_low: 2090.0,
    sector: 'Banking & Financial Services',
    portfolio_weight: 27.5,
  },
  {
    symbol: 'PPFCF',
    name: 'Parag Parikh Flexi Cap Direct',
    asset_class: 'Mutual Funds',
    broker: 'Groww (CAMS)',
    quantity: 2500.5,
    avg_price: 45.0,
    current_price: 51.99,
    total_value: 130000.0,
    day_change: 0.9,
    sparkline: [50.5, 51.0, 51.2, 51.5, 51.8, 51.99],
    isin: 'INF879O01015',
    stcg: 0,
    ltcg: 17477,
    day_high: 52.2,
    day_low: 50.1,
    sector: 'Diversified',
    portfolio_weight: 16.4,
  },
  {
    symbol: 'UTINIFTY',
    name: 'UTI Nifty 50 Index Fund Direct',
    asset_class: 'Mutual Funds',
    broker: 'Kuvera (KFintech)',
    quantity: 450.0,
    avg_price: 140.0,
    current_price: 151.91,
    total_value: 68362.0,
    day_change: 0.6,
    sparkline: [149.0, 149.8, 150.5, 151.2, 151.5, 151.91],
    isin: 'INF229K01018',
    stcg: 5362,
    ltcg: 0,
    day_high: 152.5,
    day_low: 148.5,
    sector: 'Diversified Index',
    portfolio_weight: 8.6,
  },
  {
    symbol: 'INCREDBOND',
    name: 'InCred Financial 9.5% Bond',
    asset_class: 'Fixed Income',
    broker: 'Dhan Sarthi (Direct)',
    quantity: 1,
    avg_price: 75000.0,
    current_price: 79345.0,
    total_value: 79345.0,
    day_change: 0.2,
    sparkline: [78500, 78700, 78900, 79100, 79250, 79345],
    isin: 'INE972X07012',
    stcg: 0,
    ltcg: 4345,
    day_high: 79500.0,
    day_low: 78400.0,
    sector: 'NBFC / Debt',
    portfolio_weight: 10.0,
  },
  {
    symbol: 'SGB2030',
    name: 'Sovereign Gold Bonds (SGB 2030)',
    asset_class: 'Gold',
    broker: 'RBI Retail Direct',
    quantity: 8,
    avg_price: 6500.0,
    current_price: 6942.6,
    total_value: 55541.0,
    day_change: 0.8,
    sparkline: [6800, 6830, 6870, 6900, 6920, 6942.6],
    isin: 'IN0020210098',
    stcg: 0,
    ltcg: 3541,
    day_high: 6980.0,
    day_low: 6790.0,
    sector: 'Commodity / Gold',
    portfolio_weight: 7.0,
  },
  {
    symbol: 'NEXUSREIT',
    name: 'Nexus Select Trust REIT',
    asset_class: 'REITs',
    broker: 'Dhan Sarthi (Direct)',
    quantity: 180,
    avg_price: 125.0,
    current_price: 132.25,
    total_value: 23805.0,
    day_change: 1.2,
    sparkline: [129.0, 130.0, 130.8, 131.5, 132.0, 132.25],
    isin: 'IN0020230018',
    stcg: 0,
    ltcg: 1305,
    day_high: 133.5,
    day_low: 128.8,
    sector: 'Real Estate',
    portfolio_weight: 3.0,
  },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    date: 'Aug 08',
    month: 'August 2026',
    type: 'BUY',
    asset: 'TCS',
    asset_name: 'Tata Consultancy Services Ltd',
    platform: 'Zerodha',
    amount: 20000,
    units: 5,
    price: 4000,
    fees: 40,
    asset_class: 'Equity',
    impact: 'Increased your equity allocation by 2.1%',
  },
  {
    id: 'txn_002',
    date: 'Aug 07',
    month: 'August 2026',
    type: 'BUY',
    asset: 'NEXUSREIT',
    asset_name: 'Nexus Select Trust REIT',
    platform: 'Dhan Sarthi',
    amount: 10000,
    units: 80,
    price: 125,
    fees: 10,
    asset_class: 'REITs',
    impact: 'Increased your REIT allocation by 1.3%',
  },
  {
    id: 'txn_003',
    date: 'Aug 05',
    month: 'August 2026',
    type: 'BUY',
    asset: 'INCREDBOND',
    asset_name: 'InCred Financial 9.5% Bond',
    platform: 'Dhan Sarthi',
    amount: 25000,
    units: 1,
    price: 25000,
    fees: 0,
    asset_class: 'Fixed Income',
    impact: 'Increased your fixed-income allocation by 1.8%',
  },
  {
    id: 'txn_004',
    date: 'Aug 02',
    month: 'August 2026',
    type: 'DIVIDEND',
    asset: 'NEXUSREIT',
    asset_name: 'Nexus Select Trust REIT',
    platform: 'Dhan Sarthi',
    amount: 2340,
    asset_class: 'REITs',
    impact: 'Quarterly distribution credited to your account',
  },
  {
    id: 'txn_005',
    date: 'Jul 30',
    month: 'July 2026',
    type: 'SIP',
    asset: 'PPFCF',
    asset_name: 'Parag Parikh Flexi Cap Direct',
    platform: 'Groww',
    amount: 10000,
    units: 192.3,
    price: 52.0,
    fees: 0,
    asset_class: 'Mutual Funds',
    impact: 'Regular SIP — increased MF allocation by 0.9%',
  },
  {
    id: 'txn_006',
    date: 'Jul 28',
    month: 'July 2026',
    type: 'BUY',
    asset: 'HDFCBANK',
    asset_name: 'HDFC Bank Limited',
    platform: 'Zerodha',
    amount: 32000,
    units: 15,
    price: 2133,
    fees: 65,
    asset_class: 'Equity',
    impact: 'Increased your equity allocation by 3.5%',
  },
  {
    id: 'txn_007',
    date: 'Jul 22',
    month: 'July 2026',
    type: 'INTEREST',
    asset: 'INCREDBOND',
    asset_name: 'InCred Financial 9.5% Bond',
    platform: 'Dhan Sarthi',
    amount: 5937,
    asset_class: 'Fixed Income',
    impact: 'Semi-annual interest payment received',
  },
  {
    id: 'txn_008',
    date: 'Jul 18',
    month: 'July 2026',
    type: 'SELL',
    asset: 'TCS',
    asset_name: 'Tata Consultancy Services Ltd',
    platform: 'Zerodha',
    amount: 43640,
    units: -10,
    price: 4364,
    fees: 87,
    asset_class: 'Equity',
    impact: 'Reduced equity exposure by 4.8%',
  },
  {
    id: 'txn_009',
    date: 'Jul 12',
    month: 'July 2026',
    type: 'SIP',
    asset: 'UTINIFTY',
    asset_name: 'UTI Nifty 50 Index Fund Direct',
    platform: 'Kuvera',
    amount: 5000,
    units: 33.2,
    price: 150.5,
    fees: 0,
    asset_class: 'Mutual Funds',
    impact: 'Regular SIP — increased MF allocation by 0.4%',
  },
];

// ─── Risk Drivers ─────────────────────────────────────────────────────────────
export const RISK_DRIVERS: RiskDriver[] = [
  {
    label: 'Direct Equity Exposure',
    severity: 'HIGH',
    description: '48.2% of your portfolio is in direct equity, significantly above the 35% guideline for moderate-risk investors.',
    value: 48.2,
    holdings: [
      { name: 'TCS', pct: 27.5 },
      { name: 'HDFC Bank', pct: 27.5 },
    ],
  },
  {
    label: 'Sector Concentration',
    severity: 'MEDIUM',
    description: '31% of your equity allocation is concentrated in IT & Banking sectors, creating correlated drawdown risk.',
    value: 31,
    holdings: [
      { name: 'IT Sector (TCS)', pct: 57 },
      { name: 'Banking (HDFC Bank)', pct: 43 },
    ],
  },
  {
    label: 'Fixed Income Exposure',
    severity: 'LOW',
    description: 'Fixed income at 10% is reasonable, though slightly below the recommended 15–20% for portfolio stability.',
    value: 10,
    holdings: [
      { name: 'InCred Bond', pct: 100 },
    ],
  },
  {
    label: 'Asset Diversification',
    severity: 'MEDIUM',
    description: 'Portfolio spans 5 asset classes but is heavily skewed toward equities. REITs and Gold are under-allocated.',
    value: 62,
    holdings: [
      { name: 'Equity', pct: 48 },
      { name: 'Mutual Funds', pct: 25 },
      { name: 'Fixed Income', pct: 10 },
      { name: 'Gold', pct: 7 },
      { name: 'REITs', pct: 3 },
    ],
  },
];

// ─── Connected Accounts ────────────────────────────────────────────────────────
export const CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    id: 'acc_001',
    name: 'Zerodha Demat (CDSL)',
    type: 'Demat / Broker',
    icon: 'Z',
    status: 'connected',
    lastSynced: 'Today, 9:45 AM',
    holdings: 2,
    dataTypes: ['Equity Holdings', 'Transaction History'],
  },
  {
    id: 'acc_002',
    name: 'CAMS (Groww MF)',
    type: 'Mutual Fund RTA',
    icon: 'C',
    status: 'connected',
    lastSynced: 'Today, 9:45 AM',
    holdings: 1,
    dataTypes: ['MF Holdings', 'SIP History', 'NAV Data'],
  },
  {
    id: 'acc_003',
    name: 'KFintech (Kuvera)',
    type: 'Mutual Fund RTA',
    icon: 'K',
    status: 'connected',
    lastSynced: 'Today, 9:45 AM',
    holdings: 1,
    dataTypes: ['MF Holdings', 'SIP History'],
  },
  {
    id: 'acc_004',
    name: 'RBI Retail Direct',
    type: 'Government Bond / SGB',
    icon: 'R',
    status: 'connected',
    lastSynced: 'Yesterday, 11:20 PM',
    holdings: 1,
    dataTypes: ['SGB Holdings', 'Interest History'],
  },
  {
    id: 'acc_005',
    name: 'Dhan Sarthi Direct',
    type: 'Bond & REIT Platform',
    icon: 'D',
    status: 'connected',
    lastSynced: 'Today, 9:45 AM',
    holdings: 2,
    dataTypes: ['REIT Units', 'Bond Holdings', 'Distributions'],
  },
];

// ─── Portfolio Insights ────────────────────────────────────────────────────────
export const PORTFOLIO_INSIGHTS: PortfolioInsight[] = [
  {
    id: 'ins_001',
    color: '#dc2626',
    emoji: '🔴',
    severity: 'HIGH',
    title: 'Concentration Alert',
    description: '48.2% of your portfolio is exposed to direct equity — well above the 35% benchmark for moderate-risk investors. This increases volatility during market corrections.',
    action: 'View Risk Analysis',
    actionTarget: 'RiskExposure',
  },
  {
    id: 'ins_002',
    color: '#d97706',
    emoji: '🟡',
    severity: 'MEDIUM',
    title: 'Recent Activity Pattern',
    description: '72% of your last 5 investments were equity-related. This is accelerating your concentration risk rather than diversifying it.',
    action: 'View Transactions',
    actionTarget: 'Transactions',
  },
  {
    id: 'ins_003',
    color: '#16a34a',
    emoji: '🟢',
    severity: 'LOW',
    title: 'Diversification Improving',
    description: 'Your fixed-income allocation increased by 3.2% this month with the InCred Bond purchase. This is moving in the right direction.',
    action: 'View Holdings',
    actionTarget: 'Holdings',
  },
  {
    id: 'ins_004',
    color: '#2563eb',
    emoji: '🔵',
    severity: 'INFO',
    title: 'Unused Opportunity',
    description: 'Your portfolio currently has only 3% in REITs and 0% in InvITs. These alternate asset classes could reduce volatility and provide regular income.',
    action: 'Explore Alternatives',
    actionTarget: 'DiversificationOpportunity',
  },
];

// ─── Asset Category Mapper ─────────────────────────────────────────────────────
export const mapAssetCategory = (h: Holding): string => {
  const rawClass = (h?.asset_class || '').toString().toLowerCase();
  const sym = (h?.symbol || '').toString().toUpperCase();
  if (sym === 'TCS' || sym === 'HDFCBANK' || rawClass.includes('equity') || rawClass.includes('stock')) return 'Equity';
  if (sym.includes('PPFCF') || sym.includes('UTI') || rawClass.includes('mutual') || rawClass.includes('fund')) return 'Mutual Funds';
  if (sym.includes('BOND') || rawClass.includes('bond') || rawClass.includes('debt') || rawClass.includes('income') || rawClass.includes('fixed')) return 'Bonds';
  if (sym.includes('SGB') || sym.includes('GOLD') || rawClass.includes('gold') || rawClass.includes('sgb')) return 'Other';
  if (sym.includes('REIT') || rawClass.includes('reit') || rawClass.includes('estate')) return 'REIT';
  if (rawClass.includes('invit') || rawClass.includes('infra')) return 'InvIT';
  return 'Equity';
};

export const TARGET_CATEGORIES = [
  { label: 'Equity', color: '#1b3a6b', key: 'Equity', targetPct: 35 },
  { label: 'Mutual Funds', color: '#2563eb', key: 'Mutual Funds', targetPct: 25 },
  { label: 'REIT', color: '#f97316', key: 'REIT', targetPct: 10 },
  { label: 'Bonds', color: '#14b8a6', key: 'Bonds', targetPct: 20 },
  { label: 'Other', color: '#eab308', key: 'Other', targetPct: 5 },
  { label: 'InvIT', color: '#8b5cf6', key: 'InvIT', targetPct: 5 },
];

export const getAssetBreakdown = (holdings: Holding[]) => {
  const catSums: Record<string, number> = { Equity: 0, 'Mutual Funds': 0, 'REIT': 0, Bonds: 0, Other: 0, InvIT: 0 };
  holdings.forEach((h) => {
    const c = mapAssetCategory(h);
    catSums[c] = (catSums[c] || 0) + (Number(h.total_value) || 0);
  });
  const totalSum = Object.values(catSums).reduce((a, b) => a + b, 0);
  return TARGET_CATEGORIES.map(cat => {
    const pct = totalSum > 0 && catSums[cat.key] > 0
      ? (catSums[cat.key] / totalSum) * 100
      : cat.targetPct;
    return {
      ...cat,
      value: catSums[cat.key] > 0 ? catSums[cat.key] : 0,
      percentage: pct,
    };
  });
};

// ─── Portfolio Summary ─────────────────────────────────────────────────────────
export const getPortfolioSummary = (holdings: Holding[]) => {
  const totalValue = holdings.reduce((acc, h) => acc + h.total_value, 0);
  const totalInvested = holdings.reduce((acc, h) => acc + (h.avg_price * h.quantity), 0);
  const totalReturns = totalValue - totalInvested;
  const returnPct = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const todayChange = 48240;
  const todayChangePct = 6.47;
  return { totalValue, totalInvested, totalReturns, returnPct, todayChange, todayChangePct };
};

// ─── Chart Data ────────────────────────────────────────────────────────────────
export const CHART_DATA_BY_TIMEFRAME: Record<string, { points: number[]; dates: string[]; gain: string; gainPct: string }> = {
  '1D': { points: [745210, 752000, 768000, 772500, 784000, 793450], dates: ['09:15', '10:30', '11:45', '13:00', '14:15', '15:30'], gain: '+₹48,240', gainPct: '+6.47%' },
  '1W': { points: [764000, 770000, 768500, 779000, 785000, 793450], dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'], gain: '+₹29,450', gainPct: '+3.85%' },
  '1M': { points: [730000, 742000, 738000, 755000, 772000, 793450], dates: ['1 Jul', '8 Jul', '15 Jul', '22 Jul', '29 Jul', '4 Aug'], gain: '+₹63,450', gainPct: '+8.69%' },
  '6M': { points: [680000, 705000, 718000, 740000, 765000, 793450], dates: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug'], gain: '+₹1,13,450', gainPct: '+16.68%' },
  '1Y': { points: [610000, 635000, 660000, 690000, 735000, 793450], dates: ['Aug 25', 'Nov 25', 'Feb 26', 'May 26', 'Jul 26', 'Aug 26'], gain: '+₹1,83,450', gainPct: '+30.07%' },
  'ALL': { points: [500000, 540000, 590000, 650000, 720000, 793450], dates: ['2023', '2024 H1', '2024 H2', '2025 H1', '2025 H2', '2026'], gain: '+₹2,93,450', gainPct: '+58.69%' },
};

export const TIME_HORIZONS = ['1D', '1W', '1M', '6M', '1Y', 'ALL'];

// ─── Portfolio Health ─────────────────────────────────────────────────────────
export const HEALTH_FACTORS = [
  { label: 'Diversification', score: 72, max: 100, description: 'Portfolio spans 5 asset classes. REITs and InvITs allocation can improve this score.', color: '#2563eb' },
  { label: 'Risk Balance', score: 58, max: 100, description: 'Equity concentration at 48.2% is above optimal. Rebalancing to 35% could improve resilience.', color: '#d97706' },
  { label: 'Liquidity', score: 85, max: 100, description: 'Most assets are highly liquid. Bonds and SGB have some lock-in, but manageable.', color: '#16a34a' },
  { label: 'Concentration', score: 45, max: 100, description: 'Two stocks (TCS + HDFC Bank) make up 55% of equity. Sector overlap creates correlated risk.', color: '#dc2626' },
  { label: 'Asset Variety', score: 68, max: 100, description: '5 of 8 major asset classes covered. Adding InvIT or International Fund could improve this.', color: '#8b5cf6' },
];

export const OVERALL_HEALTH_SCORE = Math.round(
  HEALTH_FACTORS.reduce((acc, f) => acc + f.score, 0) / HEALTH_FACTORS.length
);

// ─── Color Utilities ───────────────────────────────────────────────────────────
export const SEVERITY_COLORS = {
  HIGH: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '#dc2626' },
  MEDIUM: { bg: '#fffbeb', border: '#fde68a', text: '#d97706', badge: '#d97706' },
  LOW: { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a', badge: '#16a34a' },
  INFO: { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb', badge: '#2563eb' },
};

export const TX_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  BUY: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  SELL: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  DIVIDEND: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  INTEREST: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  SIP: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  OTHER: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
};
