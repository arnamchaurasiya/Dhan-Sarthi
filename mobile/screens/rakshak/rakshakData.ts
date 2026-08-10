export interface VerifiedEntity {
  id: string;
  name: string;
  category: string;
  regNo: string;
  regulatedBy: string;
  status: 'Verified' | 'Unverified' | 'Suspicious' | 'Pending';
  verifiedDate: string;
  isSebiRegistered: boolean;
  filingsUpToDate: boolean;
  noComplaints: boolean;
  entityType: string;
  description: string;
  address?: string;
  website?: string;
  registrationDate?: string;
}

export interface ScamScanResultData {
  scamScore: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  flaggedCount: number;
  messageType: string;
  indicators: {
    id: string;
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    snippet: string;
    explanation: string;
  }[];
  overallAssessment: string;
  whyFlagged: string[];
}

export interface SafetyAlert {
  id: string;
  title: string;
  category: 'Portfolio' | 'Entity' | 'Content' | 'Investment' | 'Regulatory';
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  status: 'Needs Attention' | 'Resolved' | 'Reviewed';
  summary: string;
  actionTaken?: string;
  resultMessage?: string;
  recommendedAction?: string;
  targetView?: string;
}

export interface PreInvestmentProduct {
  id: string;
  name: string;
  category: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  suitabilityScore: number;
  warnings: string[];
  entityName: string;
  regNo: string;
  expectedReturn?: string;
}

export const INITIAL_VERIFIED_ENTITIES: Record<string, VerifiedEntity> = {
  zerodha: {
    id: 'zerodha',
    name: 'Zerodha Broking Limited',
    category: 'Stock Broker / DP',
    regNo: 'INZ000031633',
    regulatedBy: 'SEBI',
    status: 'Verified',
    verifiedDate: 'Today, 10:15 AM',
    isSebiRegistered: true,
    filingsUpToDate: true,
    noComplaints: true,
    entityType: 'Stock Broker & Depository Participant',
    description: 'Registered Stock Broker with NSE, BSE, MCX and Depository Participant with CDSL.',
    address: '153/154, 4th Cross, Dollars Colony, JP Nagar 4th Phase, Bengaluru - 560078',
    website: 'https://zerodha.com',
    registrationDate: '15 Aug 2010',
  },
  abc_investment: {
    id: 'abc_investment',
    name: 'ABC Investment Services',
    category: 'Investment Intermediary',
    regNo: 'INA000012345',
    regulatedBy: 'SEBI',
    status: 'Verified',
    verifiedDate: 'Today, 09:30 AM',
    isSebiRegistered: true,
    filingsUpToDate: true,
    noComplaints: true,
    entityType: 'Investment Intermediary',
    description: 'SEBI registered Investment Advisory entity providing wealth management and portfolio advice.',
    address: 'Plot 42, Bandra-Kurla Complex, Mumbai - 400051',
    website: 'https://abcinvestments.example.com',
    registrationDate: '10 Jan 2018',
  },
  nexus_reit: {
    id: 'nexus_reit',
    name: 'Nexus Select Trust',
    category: 'Real Estate Investment Trust',
    regNo: 'IN/REIT/19-20/0007',
    regulatedBy: 'SEBI',
    status: 'Verified',
    verifiedDate: '10 Aug 2026',
    isSebiRegistered: true,
    filingsUpToDate: true,
    noComplaints: true,
    entityType: 'SEBI Registered REIT',
    description: 'India\'s first urban retail real estate investment trust registered with SEBI.',
    address: 'Embassy Office Parks, Outer Ring Road, Bengaluru',
    website: 'https://nexusselecttrust.com',
    registrationDate: '20 May 2020',
  },
  xyz_advisor: {
    id: 'xyz_advisor',
    name: 'XYZ Investment Advisor',
    category: 'Registered Investment Advisor (RIA)',
    regNo: 'INA000098765',
    regulatedBy: 'SEBI',
    status: 'Verified',
    verifiedDate: 'Yesterday, 4:00 PM',
    isSebiRegistered: true,
    filingsUpToDate: true,
    noComplaints: true,
    entityType: 'SEBI Registered Advisor',
    description: 'Fee-only financial advisor offering retail goal planning and portfolio allocation.',
    address: 'Connaught Place, New Delhi - 110001',
    website: 'https://xyzadvisor.example.com',
    registrationDate: '04 Mar 2021',
  },
  abc_wealth: {
    id: 'abc_wealth',
    name: 'ABC Wealth Group',
    category: 'Unverified Entity',
    regNo: 'UNAVAILABLE',
    regulatedBy: 'Unknown',
    status: 'Unverified',
    verifiedDate: 'Today, 11:00 AM',
    isSebiRegistered: false,
    filingsUpToDate: false,
    noComplaints: false,
    entityType: 'Unregistered Wealth Manager',
    description: 'No valid SEBI registration records or intermediary listing found for this entity name.',
  },
};

export const PRESET_SCAM_EXAMPLES = [
  {
    title: 'Guaranteed 30% Return Offer',
    text: 'Guaranteed 30% returns in 30 days! Special VIP insider stock tips channel. Transfer Rs 25,000 now to our official UPI account to activate your daily payout account before slots close at 5 PM today!',
  },
  {
    title: 'Limited Time Crypto/Equity Offer',
    text: 'Limited time secret algorithm investment opportunity. Double your capital in 15 days with 0% risk. Send money directly to personal GPay handle fast!',
  },
  {
    title: 'Fake SEBI Authorized Advisor Claim',
    text: 'We are 100% SEBI approved top tier advisors. Guaranteed 5% weekly profit without any stop loss. Click link to join telegram group for private bank transfer details.',
  },
];

export const INITIAL_SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'alt_1',
    title: 'Portfolio Concentration Alert',
    category: 'Portfolio',
    severity: 'Medium',
    timestamp: 'Today, 10:32 AM',
    status: 'Needs Attention',
    summary: 'Direct equity represents 48.2% of your total portfolio, exposing you to sector concentration risk.',
    recommendedAction: 'Explore diversification options in Dhan Marg',
    targetView: 'portfolio_risk_alert',
  },
  {
    id: 'alt_2',
    title: 'Entity Verification Completed',
    category: 'Entity',
    severity: 'Low',
    timestamp: 'Today, 09:14 AM',
    status: 'Resolved',
    summary: 'Nexus Select Trust information matches official SEBI registry (IN/REIT/19-20/0007).',
    actionTaken: 'Verified against SEBI official database',
    resultMessage: 'Entity verified as SEBI Registered REIT. No further action required.',
    targetView: 'entity_result',
  },
  {
    id: 'alt:3',
    title: 'Investment Content Flagged',
    category: 'Content',
    severity: 'High',
    timestamp: 'Yesterday',
    status: 'Resolved',
    summary: 'Message promising 30% guaranteed return flagged with 4 high risk indicators.',
    actionTaken: 'Flagged by AI Scanner & verified entity as unregistered',
    resultMessage: 'User advised not to transfer funds to unverified account.',
    targetView: 'content_scan_result',
  },
  {
    id: 'alt_4',
    title: 'Pre-Investment Safety Check',
    category: 'Investment',
    severity: 'Low',
    timestamp: '08 Aug 2026',
    status: 'Reviewed',
    summary: 'Safety check completed before REIT subscription. All 4 risk checks verified.',
    actionTaken: 'Risk disclosure & suitability reviewed',
    resultMessage: 'Cleared for order placement.',
    targetView: 'safety_check',
  },
];

export const SAFETY_EDUCATION_ARTICLES = [
  {
    id: 'edu_1',
    title: 'Common Investment Scams & Red Flags',
    subtitle: 'Learn how to identify fake return promises, urgency tactics, and fraudulent groups.',
    readTime: '4 min read',
    iconName: 'AlertTriangle',
    gyaanTopicId: 'scam_prevention_101',
    bullets: [
      'Guaranteed return promises are illegal under SEBI regulations.',
      'Scammers use countdown timer tactics to induce quick money transfers.',
      'Never pay investment funds directly into personal bank or UPI accounts.',
    ],
  },
  {
    id: 'edu_2',
    title: 'How to Verify a SEBI Intermediary',
    subtitle: 'Step-by-step guide to checking registration numbers on the official SEBI portal.',
    readTime: '3 min read',
    iconName: 'ShieldCheck',
    gyaanTopicId: 'sebi_verification_guide',
    bullets: [
      'Check the 12-digit registration number starting with INZ, INA, or IN/REIT.',
      'Verify that the company name on the bank account matches the SEBI entity exactly.',
      'Cross-check listed phone numbers and emails on the official SEBI directory.',
    ],
  },
  {
    id: 'edu_3',
    title: 'Understanding Portfolio Risk & Concentration',
    subtitle: 'Why holding over 40% in a single asset class increases vulnerability.',
    readTime: '5 min read',
    iconName: 'PieChart',
    gyaanTopicId: 'portfolio_risk_basics',
    bullets: [
      'Concentration amplifies drawdowns when specific sectors underperform.',
      'Diversification balances growth assets with stable income instruments.',
      'Regular portfolio rebalancing aligns exposure with your risk profile.',
    ],
  },
  {
    id: 'edu_4',
    title: 'Fake Advisors & Telegram Channel Scams',
    subtitle: 'Protecting your capital against uncertified tipsters operating on social media.',
    readTime: '4 min read',
    iconName: 'ShieldAlert',
    gyaanTopicId: 'fake_advisors_alert',
    bullets: [
      'Only SEBI-registered advisers (RIAs) can legally provide personalized stock advice.',
      'Unregistered Telegram channels often pump stock prices before dumping.',
      'Report fake impersonation accounts to SEBI SCORES portal immediately.',
    ],
  },
];
