// ─── Dhan Marg Shared Data & Suitability Engine Layer ────────────────────────
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Landmark,
  PiggyBank,
  Briefcase,
  GraduationCap,
  Home as HomeIcon,
  Target,
} from 'lucide-react-native';

export interface Product {
  id: string;
  name: string;
  category: 'REITs/InvITs' | 'Debt' | 'Equity' | 'Retirement' | 'Others';
  type: string;
  riskLevel: 'Low' | 'Low to Moderate' | 'Moderate' | 'High';
  matchScore: number; // 0-100%
  matchLabel: string;
  expectedYield: string;
  minInvest: string;
  minInvestValue: number;
  aum: string;
  occupancy: string;
  horizonReq: string;
  liquidityLevel: 'High' | 'Medium' | 'Low';
  about: string;
  keyHighlights: string[];
  keyRisks: string[];
  gyaanTopicId: string;
  icon: any;
}

export interface InvestorProfile {
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentHorizon: '< 1 year' | '1–3 years' | '3–5 years' | '5–10 years' | '10+ years';
  primaryGoal: 'Capital Preservation' | 'Regular Income' | 'Wealth Creation' | 'Retirement' | 'Child Education' | 'Other';
  targetAmount: number; // e.g. 2500000
  targetTimeframeYears: number; // e.g. 8
  liquidityNeed: 'High' | 'Medium' | 'Low';
  portfolioValue: number; // e.g. 790000
  directEquityAllocationPct: number; // e.g. 48.2
  reitAllocationPct: number; // e.g. 9.5
  debtAllocationPct: number; // e.g. 25.0
  isComplete: boolean;
}

export interface RiskQuestion {
  id: number;
  question: string;
  explanation: string;
  options: {
    id: string;
    text: string;
    subtext: string;
    points: number; // 1 = conservative, 2 = moderate, 3 = aggressive
  }[];
}

export interface ExplainabilityFactor {
  factor: 'Risk' | 'Horizon' | 'Goal' | 'Liquidity' | 'Portfolio';
  yourProfile: string;
  productParam: string;
  matched: boolean;
  resultTag: string;
}

export interface ProductComparisonRow {
  metric: string;
  reit: string;
  invit: string;
  bond: string;
}

// ─── Default Investor Profile ────────────────────────────────────────────────
export const DEFAULT_INVESTOR_PROFILE: InvestorProfile = {
  riskProfile: 'Moderate',
  investmentHorizon: '5–10 years',
  primaryGoal: 'Wealth Creation',
  targetAmount: 2500000,
  targetTimeframeYears: 8,
  liquidityNeed: 'Medium',
  portfolioValue: 790000,
  directEquityAllocationPct: 48.2,
  reitAllocationPct: 9.5,
  debtAllocationPct: 25.0,
  isComplete: true,
};

// ─── Products Dataset ────────────────────────────────────────────────────────
export const PRODUCTS_DATA: Product[] = [
  {
    id: 'NEXUS_REIT',
    name: 'Nexus Select Trust',
    category: 'REITs/InvITs',
    type: 'REIT • Retail & Office',
    riskLevel: 'Moderate',
    matchScore: 92,
    matchLabel: '92% Suitability',
    expectedYield: '7.2% – 7.8%',
    minInvest: '₹10,430',
    minInvestValue: 10430,
    aum: '₹4,210 Cr',
    occupancy: '94.1%',
    horizonReq: '5+ years',
    liquidityLevel: 'Medium',
    about:
      'Nexus Select Trust owns quality Grade-A retail mall assets across top Indian metro cities, generating quarterly rental distributions.',
    keyHighlights: [
      'Regular quarterly distribution payout',
      'SEBI regulated real estate trust framework',
      '94.1% tenant occupancy rate across prime malls',
      'Adds physical asset exposure to equity heavy portfolios',
    ],
    keyRisks: [
      'Market price can fluctuate based on interest rate cycles',
      'Quarterly dividend payouts are subject to rental collection',
      'Commercial real estate sector concentration risk',
    ],
    gyaanTopicId: 'what_is_reit',
    icon: Building2,
  },
  {
    id: 'CORP_BOND',
    name: 'AAA Corporate Bonds Basket',
    category: 'Debt',
    type: 'Debt • 3-5 Year Fixed Coupon',
    riskLevel: 'Low to Moderate',
    matchScore: 88,
    matchLabel: '88% Suitability',
    expectedYield: '8.1% – 8.5%',
    minInvest: '₹10,000',
    minInvestValue: 10000,
    aum: '₹15,400 Cr',
    occupancy: 'N/A',
    horizonReq: '3+ years',
    liquidityLevel: 'Medium',
    about:
      'High-grade AAA rated corporate debt basket providing predictable semi-annual coupon payouts with capital preservation preference.',
    keyHighlights: [
      'Highest AAA credit rating safety',
      'Predictable fixed coupon payouts',
      'Lower price volatility than direct equity',
    ],
    keyRisks: [
      'Interest rate changes affect secondary bond prices',
      'Taxation at income slab rate for short term holders',
    ],
    gyaanTopicId: 'bonds_101',
    icon: Landmark,
  },
  {
    id: 'EMBASSY_INVIT',
    name: 'IndGrid Infrastructure Trust (InvIT)',
    category: 'REITs/InvITs',
    type: 'InvIT • Power Transmission',
    riskLevel: 'Moderate',
    matchScore: 86,
    matchLabel: '86% Suitability',
    expectedYield: '9.0% – 9.5%',
    minInvest: '₹12,500',
    minInvestValue: 12500,
    aum: '₹22,800 Cr',
    occupancy: '99.2%',
    horizonReq: '5+ years',
    liquidityLevel: 'Medium',
    about:
      'India’s leading power transmission InvIT distributing predictable cash flows from long-term concession power lines.',
    keyHighlights: [
      'High yield infrastructure distribution',
      'Long-term 30-year government concession contracts',
      'Inflation-hedged cashflow structure',
    ],
    keyRisks: [
      'Regulatory tariff renegotiation risks',
      'Grid connection disruption contingencies',
    ],
    gyaanTopicId: 'invit_explained',
    icon: ShieldCheck,
  },
  {
    id: 'HDFC_BAF',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Equity',
    type: 'Hybrid • Dynamic Asset Allocation',
    riskLevel: 'Moderate',
    matchScore: 82,
    matchLabel: '82% Suitability',
    expectedYield: '12% – 14%',
    minInvest: '₹500',
    minInvestValue: 500,
    aum: '₹68,400 Cr',
    occupancy: 'N/A',
    horizonReq: '3–5 years',
    liquidityLevel: 'High',
    about:
      'Dynamically shifts asset allocation between equity and fixed income depending on market valuation multiples.',
    keyHighlights: [
      'Automated equity-debt rebalancing',
      'Tax-efficient equity treatment',
      'Smooths out equity drawdowns',
    ],
    keyRisks: [
      'Market volatility affects underlying stock portfolio',
      'Fund manager strategy execution risk',
    ],
    gyaanTopicId: 'mutual_funds_101',
    icon: TrendingUp,
  },
];

// ─── 4-Question Risk Assessment Questionnaire ─────────────────────────────────
export const RISK_QUESTIONNAIRE: RiskQuestion[] = [
  {
    id: 1,
    question: 'Your investment temporarily falls by 15-20%. What would you most likely do?',
    explanation: 'Assesses your emotional and financial tolerance for short-term market drawdowns.',
    options: [
      {
        id: 'sell',
        text: 'Sell immediately',
        subtext: 'I prefer to cut losses and protect remaining cash.',
        points: 1,
      },
      {
        id: 'worried',
        text: 'Wait until it recovers',
        subtext: 'I will hold back but stop making new investments.',
        points: 2,
      },
      {
        id: 'stay',
        text: 'Stay invested',
        subtext: 'I understand short-term ups and downs are normal.',
        points: 2,
      },
      {
        id: 'buy_more',
        text: 'Invest more money',
        subtext: 'I view market drops as buying opportunities.',
        points: 3,
      },
    ],
  },
  {
    id: 2,
    question: 'What is your primary financial priority for this capital?',
    explanation: 'Defines your expectation for capital protection vs inflation-beating returns.',
    options: [
      {
        id: 'protect',
        text: 'Protect principal at all costs',
        subtext: 'I cannot afford to lose any portion of capital.',
        points: 1,
      },
      {
        id: 'balanced',
        text: 'Moderate growth with income',
        subtext: 'I want steady income while keeping risk balanced.',
        points: 2,
      },
      {
        id: 'growth',
        text: 'Maximize long-term wealth',
        subtext: 'I accept higher volatility for higher capital growth.',
        points: 3,
      },
    ],
  },
  {
    id: 3,
    question: 'How experienced are you with capital market investments?',
    explanation: 'Helps ensure recommended products match your financial comprehension.',
    options: [
      {
        id: 'beginner',
        text: 'Beginner (FDs / Savings)',
        subtext: 'Mainly familiar with fixed deposits and bank savings.',
        points: 1,
      },
      {
        id: 'intermediate',
        text: 'Intermediate (MFs / REITs)',
        subtext: 'Invested in mutual funds, REITs, or bonds previously.',
        points: 2,
      },
      {
        id: 'advanced',
        text: 'Advanced (Direct Equities / F&O)',
        subtext: 'Comfortable with stock picking and complex instruments.',
        points: 3,
      },
    ],
  },
  {
    id: 4,
    question: 'How soon might you need emergency access to these funds?',
    explanation: 'Determines liquidity buffers and minimum lock-in constraints.',
    options: [
      {
        id: 'soon',
        text: 'Within 6–12 months',
        subtext: 'I might need this money for near-term expenses.',
        points: 1,
      },
      {
        id: 'medium_term',
        text: 'In 1–3 years',
        subtext: 'I have some buffer but prefer reasonable liquidity.',
        points: 2,
      },
      {
        id: 'long_term',
        text: 'Unlikely (Separate emergency fund built)',
        subtext: 'I have emergency savings and can stay locked in long-term.',
        points: 3,
      },
    ],
  },
];

// ─── Financial Goals List ────────────────────────────────────────────────────
export const FINANCIAL_GOALS_LIST = [
  {
    id: 'Wealth Creation',
    title: 'Wealth Creation',
    desc: 'Grow my money faster than inflation over time',
    icon: TrendingUp,
  },
  {
    id: 'Regular Income',
    title: 'Regular Income',
    desc: 'Generate passive quarterly or monthly income',
    icon: PiggyBank,
  },
  {
    id: 'Capital Preservation',
    title: 'Capital Preservation',
    desc: 'Protect my capital with low volatility',
    icon: ShieldCheck,
  },
  {
    id: 'Retirement',
    title: 'Retirement Planning',
    desc: 'Build a corpus for comfortable retirement',
    icon: Briefcase,
  },
  {
    id: 'Child Education',
    title: 'Child Education',
    desc: 'Save for higher studies and future goals',
    icon: GraduationCap,
  },
  {
    id: 'Other',
    title: 'Other Custom Goal',
    desc: 'Specify a custom financial target',
    icon: Target,
  },
];

// ─── Explainability Matrix Generator ─────────────────────────────────────────
export function getExplainabilityMatrix(
  profile: InvestorProfile,
  product: Product
): ExplainabilityFactor[] {
  return [
    {
      factor: 'Risk',
      yourProfile: profile.riskProfile,
      productParam: product.riskLevel,
      matched: true,
      resultTag: '✅ Aligned Risk Profile',
    },
    {
      factor: 'Horizon',
      yourProfile: profile.investmentHorizon,
      productParam: product.horizonReq,
      matched: true,
      resultTag: '✅ Matches Timeframe',
    },
    {
      factor: 'Goal',
      yourProfile: profile.primaryGoal,
      productParam: 'Growth & Income',
      matched: true,
      resultTag: '✅ Meets Objective',
    },
    {
      factor: 'Liquidity',
      yourProfile: `${profile.liquidityNeed} Liquidity`,
      productParam: `${product.liquidityLevel} Liquidity`,
      matched: true,
      resultTag: '✅ Adequate Liquidity',
    },
    {
      factor: 'Portfolio',
      yourProfile: `${profile.directEquityAllocationPct}% Direct Equity`,
      productParam: product.category,
      matched: true,
      resultTag: '✅ Diversifies Equity Exposure',
    },
  ];
}

// ─── Comparison Matrix Data ──────────────────────────────────────────────────
export const COMPARISON_MATRIX_ROWS: ProductComparisonRow[] = [
  {
    metric: 'Risk Profile',
    reit: 'Moderate',
    invit: 'Moderate',
    bond: 'Low to Moderate',
  },
  {
    metric: 'Income Type',
    reit: 'Quarterly Distribution',
    invit: 'Quarterly Payout',
    bond: 'Semi-Annual Coupon',
  },
  {
    metric: 'Expected Yield',
    reit: '7.2% – 7.8%',
    invit: '9.0% – 9.5%',
    bond: '8.1% – 8.5%',
  },
  {
    metric: 'Liquidity',
    reit: 'Medium (Stock Exchange)',
    invit: 'Medium (Stock Exchange)',
    bond: 'Medium (Secondary Market)',
  },
  {
    metric: 'Min. Investment',
    reit: '₹10,430',
    invit: '₹12,500',
    bond: '₹10,000',
  },
  {
    metric: 'Min. Horizon',
    reit: '5+ Years',
    invit: '5+ Years',
    bond: '3+ Years',
  },
  {
    metric: 'Your Suitability',
    reit: '92% Match',
    invit: '86% Match',
    bond: '88% Match',
  },
];

// ─── Portfolio Impact Helper ─────────────────────────────────────────────────
export function calculatePortfolioImpact(
  currentPortfolioValue: number,
  currentEquityPct: number,
  currentReitPct: number,
  investAmount: number
) {
  const newTotalValue = currentPortfolioValue + investAmount;
  const currentReitValue = currentPortfolioValue * (currentReitPct / 100);
  const newReitValue = currentReitValue + investAmount;
  const newReitPct = (newReitValue / newTotalValue) * 100;

  const currentEquityValue = currentPortfolioValue * (currentEquityPct / 100);
  const newEquityPct = (currentEquityValue / newTotalValue) * 100;

  return {
    newTotalValue,
    oldReitPct: currentReitPct.toFixed(1),
    newReitPct: newReitPct.toFixed(1),
    oldEquityPct: currentEquityPct.toFixed(1),
    newEquityPct: newEquityPct.toFixed(1),
    unitsApprox: Math.max(1, Math.floor(investAmount / 138.5)),
  };
}
