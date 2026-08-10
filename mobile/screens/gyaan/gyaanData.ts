export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  topicCount: number;
  completedCount: number;
  popular?: boolean;
}

export interface Topic {
  id: string;
  categoryId: string;
  title: string;
  readTime: string;
  points: number;
  status: 'completed' | 'in_progress' | 'unlocked' | 'locked';
  unlockRequirement?: string;
  summary: string;
}

export interface LessonDetail {
  id: string;
  topicId: string;
  title: string;
  categoryId: string;
  readTime: string;
  points: number;
  subtitle: string;
  inSimpleWords: string;
  diagramType: 'reit_flow' | 'invit_flow' | 'bond_yield' | 'sip_compounding' | 'risk_return';
  explanation: string;
  keyPoints: string[];
  risks: string[];
  investorConsiderations: string[];
  example: {
    name: string;
    description: string;
    linkText: string;
  };
  quizId: string;
  nextTopicId?: string;
  nextTopicTitle?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topicId: string;
  title: string;
  pointsReward: number;
  questions: QuizQuestion[];
}

export interface JourneyStage {
  id: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'locked';
  topics: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface ReadinessChecklist {
  productId: string;
  productName: string;
  requiredItems: {
    id: string;
    title: string;
    completed: boolean;
    topicId?: string;
  }[];
}

export interface BookmarkItem {
  id: string;
  topicId: string;
  title: string;
  category: string;
  savedDate: string;
  note?: string;
  type: 'Lesson' | 'Article' | 'Video';
}

// 12 SEBI-Aligned Categories
export const CATEGORIES_DATA: Category[] = [
  {
    id: 'basics',
    name: 'Basics',
    description: 'Fundamental concepts of financial planning, inflation, & budgeting.',
    iconName: 'BookOpen',
    color: '#2563eb',
    topicCount: 8,
    completedCount: 8,
    popular: true,
  },
  {
    id: 'equity',
    name: 'Equity',
    description: 'Direct stock investing, market cap, earnings & dividend yields.',
    iconName: 'TrendingUp',
    color: '#059669',
    topicCount: 12,
    completedCount: 4,
    popular: true,
  },
  {
    id: 'mutual_funds',
    name: 'Mutual Funds',
    description: 'SIPs, NAV, expense ratio, debt vs equity funds.',
    iconName: 'PieChart',
    color: '#7c3aed',
    topicCount: 10,
    completedCount: 6,
    popular: true,
  },
  {
    id: 'debt_bonds',
    name: 'Debt & Bonds',
    description: 'Fixed income, government securities, corporate bonds & yield curves.',
    iconName: 'Landmark',
    color: '#d97706',
    topicCount: 9,
    completedCount: 3,
  },
  {
    id: 'reits_invits',
    name: 'REITs & InvITs',
    description: 'Real Estate & Infra Trusts: 90% payout rules, quarterly yields.',
    iconName: 'Building2',
    color: '#0284c7',
    topicCount: 7,
    completedCount: 2,
    popular: true,
  },
  {
    id: 'derivatives',
    name: 'Derivatives',
    description: 'Futures & Options: leverage, hedging, risk disclosures & SEBI rules.',
    iconName: 'Zap',
    color: '#dc2626',
    topicCount: 6,
    completedCount: 0,
  },
  {
    id: 'taxation',
    name: 'Taxation',
    description: 'STCG, LTCG, dividend tax, Section 80C & tax harvest basics.',
    iconName: 'Coins',
    color: '#4f46e5',
    topicCount: 8,
    completedCount: 2,
  },
  {
    id: 'investor_rights',
    name: 'Investor Rights',
    description: 'SEBI SCORES portal, grievance redressal, nomination & transparency.',
    iconName: 'ShieldCheck',
    color: '#0891b2',
    topicCount: 5,
    completedCount: 5,
  },
  {
    id: 'market_basics',
    name: 'Market Basics',
    description: 'BSE, NSE, order types, circuit breakers & clearing houses.',
    iconName: 'BarChart3',
    color: '#9333ea',
    topicCount: 8,
    completedCount: 1,
  },
  {
    id: 'fraud_awareness',
    name: 'Fraud Awareness',
    description: 'Identifying unauthorized tipsters, Ponzi schemes & fake trading apps.',
    iconName: 'ShieldAlert',
    color: '#ea580c',
    topicCount: 6,
    completedCount: 6,
    popular: true,
  },
  {
    id: 'financial_planning',
    name: 'Financial Planning',
    description: 'Emergency funds, term insurance, asset allocation & retirement goals.',
    iconName: 'Sliders',
    color: '#16a34a',
    topicCount: 9,
    completedCount: 3,
  },
  {
    id: 'sebi_regulations',
    name: 'SEBI & Regulations',
    description: 'SEBI guidelines, insider trading rules, investor protection fund.',
    iconName: 'Award',
    color: '#2563eb',
    topicCount: 7,
    completedCount: 2,
  },
];

// Topics Map per Category
export const TOPICS_BY_CATEGORY: Record<string, Topic[]> = {
  reits_invits: [
    {
      id: 'what_is_reit',
      categoryId: 'reits_invits',
      title: 'What is REIT?',
      readTime: '4 min read',
      points: 10,
      status: 'completed',
      summary: 'Earn regular income from commercial real estate without buying properties.',
    },
    {
      id: 'how_reits_work',
      categoryId: 'reits_invits',
      title: 'How REITs Work',
      readTime: '5 min read',
      points: 10,
      status: 'completed',
      summary: 'SEBI mandate: 90% rental cash flows distributed as quarterly dividends.',
    },
    {
      id: 'types_of_reits',
      categoryId: 'reits_invits',
      title: 'Types of REITs in India',
      readTime: '4 min read',
      points: 10,
      status: 'in_progress',
      summary: 'Office parks, retail malls, & industrial warehousing REIT structures.',
    },
    {
      id: 'benefits_of_reits',
      categoryId: 'reits_invits',
      title: 'Benefits of REITs',
      readTime: '3 min read',
      points: 10,
      status: 'unlocked',
      summary: 'High yield distributions, inflation protection, & demat liquidity.',
    },
    {
      id: 'risks_of_reits',
      categoryId: 'reits_invits',
      title: 'Risks of REITs',
      readTime: '5 min read',
      points: 10,
      status: 'locked',
      unlockRequirement: 'Complete Benefits of REITs',
      summary: 'Interest rate sensitivity, vacancy risk, & real estate market cycles.',
    },
    {
      id: 'what_is_invit',
      categoryId: 'reits_invits',
      title: 'What is InvIT?',
      readTime: '5 min read',
      points: 10,
      status: 'locked',
      unlockRequirement: 'Complete Risks of REITs',
      summary: 'Infrastructure Investment Trusts: highways, power transmission & solar grids.',
    },
    {
      id: 'how_invits_work',
      categoryId: 'reits_invits',
      title: 'How InvITs Work',
      readTime: '6 min read',
      points: 10,
      status: 'locked',
      unlockRequirement: 'Complete What is InvIT?',
      summary: 'Long-term toll collection & power tariffs turned into quarterly cash flows.',
    },
  ],
  debt_bonds: [
    {
      id: 'corporate_bonds_101',
      categoryId: 'debt_bonds',
      title: 'Corporate Bonds 101',
      readTime: '5 min read',
      points: 10,
      status: 'completed',
      summary: 'Earn fixed periodic coupon payouts from top Indian companies.',
    },
    {
      id: 'credit_ratings_explained',
      categoryId: 'debt_bonds',
      title: 'Credit Ratings (AAA to D)',
      readTime: '4 min read',
      points: 10,
      status: 'completed',
      summary: 'Understanding CRISIL, ICRA & CARE safety grades.',
    },
    {
      id: 'bond_yields_interest_rates',
      categoryId: 'debt_bonds',
      title: 'Bond Yields vs RBI Interest Rates',
      readTime: '6 min read',
      points: 10,
      status: 'in_progress',
      summary: 'Why bond prices drop when repo rates rise (Inverse Relationship).',
    },
  ],
};

// Full Lessons Map
export const LESSONS_DATA: Record<string, LessonDetail> = {
  what_is_reit: {
    id: 'what_is_reit',
    topicId: 'what_is_reit',
    categoryId: 'reits_invits',
    title: 'What is a REIT?',
    readTime: '4 min read',
    points: 10,
    subtitle: 'Earn passive income from India\'s top office parks without buying property.',
    inSimpleWords: 'Think of a REIT like a mutual fund for real estate. Instead of buying a whole ₹100 Crore commercial building, thousands of investors put in ₹3,000 each. The REIT buys premium offices, collects monthly rent from tech giants, and pays 90% of that rent directly to you!',
    diagramType: 'reit_flow',
    explanation: 'A Real Estate Investment Trust (REIT) is a SEBI-regulated entity that owns, operates, or finances income-generating real estate. In India, REITs must invest at least 80% of their asset value in completed, revenue-generating commercial properties like IT parks, tech campuses, and shopping malls.',
    keyPoints: [
      'REIT stands for Real Estate Investment Trust.',
      'Mandated by SEBI to distribute at least 90% of net cash flow (NDCF) to unit holders.',
      'Quarterly payout distributions in your bank account.',
      'Traded on BSE and NSE just like regular equity shares.',
      'No property maintenance or tenant hassle for individual investors.',
    ],
    risks: [
      'Market Risk: Unit prices fluctuate daily on stock exchanges based on interest rates.',
      'Tenant Vacancy Risk: If major IT companies reduce office space, rental income can drop.',
      'Interest Rate Risk: When RBI hikes interest rates, fixed-income alternatives become more attractive.',
    ],
    investorConsiderations: [
      'Check Dividend Yield % (Typically 6.5% - 8.0% per annum in India).',
      'Examine Occupancy Rate (Healthy REITs maintain 88%+ tenant occupancy).',
      'Look at Weighted Average Lease Expiry (WALE) for income security.',
    ],
    example: {
      name: 'Mindspace Business Parks REIT',
      description: 'Owns 32+ million sq. ft. of prime office parks across Mumbai, Pune, Hyderabad, & Chennai, leasing to clients like Google, Accenture, & L&T.',
      linkText: 'Simulate REIT Dividend Returns →',
    },
    quizId: 'quiz_reit_1',
    nextTopicId: 'how_reits_work',
    nextTopicTitle: 'Next Lesson: How REITs Work',
  },
  how_reits_work: {
    id: 'how_reits_work',
    topicId: 'how_reits_work',
    categoryId: 'reits_invits',
    title: 'How REITs Work',
    readTime: '5 min read',
    points: 10,
    subtitle: 'Inside the 90% cash distribution mandate under SEBI regulations.',
    inSimpleWords: 'When a tech company pays ₹1 Crore rent to a REIT, the REIT uses 10% for property management & taxes, and legally must send the remaining ₹90 Lakhs straight into unit holders\' bank accounts as quarterly payouts!',
    diagramType: 'reit_flow',
    explanation: 'SEBI REIT Regulations 2014 mandate strict investor protection rules. A REIT structure comprises a Sponsor (promoter), a Trustee (independent custodian), and an Asset Manager. Properties are held under Special Purpose Vehicles (SPVs) that transfer rental collections upward to unit holders.',
    keyPoints: [
      '80% minimum investment in rent-producing operational real estate.',
      'Maximum 20% in under-construction assets, debt, or government securities.',
      'Minimum 90% NDCF mandatory quarterly distribution.',
      'Bi-annual independent valuation of all real estate assets.',
    ],
    risks: [
      'Economic downturns causing corporate downsizings.',
      'Taxation changes on dividend vs interest vs capital repayment portions.',
    ],
    investorConsiderations: [
      'Review distribution history over the last 4 quarters.',
      'Evaluate loan-to-value (LTV) ratio (SEBI caps leverage at 49%).',
    ],
    example: {
      name: 'Embassy Office Parks REIT',
      description: 'India\'s first listed REIT, distributing over ₹1,000 Cr annually to unit holders across top tech hubs.',
      linkText: 'Check REIT Investment Readiness →',
    },
    quizId: 'quiz_reit_2',
    nextTopicId: 'types_of_reits',
    nextTopicTitle: 'Next Lesson: Types of REITs in India',
  },
};

// Quizzes Map
export const QUIZZES_DATA: Record<string, Quiz> = {
  quiz_reit_1: {
    id: 'quiz_reit_1',
    topicId: 'what_is_reit',
    title: 'REIT Basics Knowledge Check',
    pointsReward: 50,
    questions: [
      {
        id: 1,
        question: 'Under SEBI rules, what percentage of Net Distributable Cash Flows (NDCF) must a REIT distribute to investors?',
        options: ['At least 50%', 'At least 75%', 'At least 90%', '100% mandatory'],
        correctAnswer: 2,
        explanation: 'Correct! SEBI REIT Regulations 2014 mandate that at least 90% of net cash flow generated by properties must be distributed to unit holders as dividends/distributions.',
      },
      {
        id: 2,
        question: 'Which of the following is a primary benefit of investing in a REIT over buying direct property?',
        options: [
          'Guaranteed zero capital risk',
          'Liquidity to buy/sell single units on stock exchanges',
          'Exemption from all income tax forever',
          'Fixed return guaranteed by the Government of India',
        ],
        correctAnswer: 1,
        explanation: 'Correct! Unlike physical real estate requiring lakhs and months to sell, REIT units trade on BSE/NSE daily with high liquidity.',
      },
      {
        id: 3,
        question: 'Are REIT returns guaranteed like bank Fixed Deposits?',
        options: [
          'Yes, SEBI guarantees 8% return',
          'No, returns depend on tenant occupancy & market prices',
          'Yes, sponsors guarantee fixed quarterly payouts',
          'No, but insurance covers all price losses',
        ],
        correctAnswer: 1,
        explanation: 'Correct! REITs are market-linked instruments. Rental distributions depend on tenant renewal rates and market conditions.',
      },
    ],
  },
};

// 5-Stage Learning Journey Pathway
export const LEARNING_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    title: 'Stage 1 — Foundations',
    subtitle: 'Master inflation, compounding, & financial goal setting.',
    status: 'completed',
    topics: [
      { id: 't1', title: 'What is Investing?', completed: true },
      { id: 't2', title: 'Risk vs Return Matrix', completed: true },
      { id: 't3', title: 'Power of Compounding', completed: true },
      { id: 't4', title: 'Inflation & Real Returns', completed: true },
    ],
  },
  {
    id: 2,
    title: 'Stage 2 — Investment Options',
    subtitle: 'Understand Equity, Mutual Funds, REITs, InvITs, & Corporate Bonds.',
    status: 'current',
    topics: [
      { id: 't5', title: 'Equity Stocks 101', completed: true },
      { id: 't6', title: 'Mutual Funds & SIPs', completed: true },
      { id: 'what_is_reit', title: 'What is REIT?', completed: true },
      { id: 'how_reits_work', title: 'How REITs Work', completed: true },
      { id: 'corporate_bonds_101', title: 'Corporate Bonds 101', completed: false },
      { id: 'what_is_invit', title: 'What is InvIT?', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Stage 3 — Risk & Asset Allocation',
    subtitle: 'Balancing your portfolio, diversification, & market volatility.',
    status: 'locked',
    topics: [
      { id: 't7', title: 'Portfolio Asset Allocation', completed: false },
      { id: 't8', title: 'Managing Market Volatility', completed: false },
      { id: 't9', title: 'Risk Adjusted Returns (Sharpe Ratio)', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Stage 4 — Advanced Strategies',
    subtitle: 'Tax-efficient harvesting, REIT yields, & bond laddering.',
    status: 'locked',
    topics: [
      { id: 't10', title: 'Capital Gain Tax Optimization', completed: false },
      { id: 't11', title: 'Corporate Bond Yield Curves', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Stage 5 — Investor Mastery',
    subtitle: 'SEBI rights, SCORES portal, & fraud prevention.',
    status: 'locked',
    topics: [
      { id: 't12', title: 'SEBI SCORES & Investor Rights', completed: false },
      { id: 't13', title: 'Recognizing Unregulated Schemes', completed: false },
    ],
  },
];

// Product Readiness Checklists for "Before You Invest" Screen
export const READINESS_CHECKLISTS: Record<string, ReadinessChecklist> = {
  reit: {
    productId: 'reit',
    productName: 'REITs & InvITs (Real Estate & Infra Trusts)',
    requiredItems: [
      { id: 'r1', title: 'Investor Rights & SEBI Safeguards', completed: true, topicId: 'investor_rights' },
      { id: 'r2', title: 'What is a REIT? (Concept & Mechanism)', completed: true, topicId: 'what_is_reit' },
      { id: 'r3', title: 'How REITs Work & 90% Payout Rule', completed: true, topicId: 'how_reits_work' },
      { id: 'r4', title: 'Understanding REIT Market Risks & Interest Rate Cycles', completed: false, topicId: 'risks_of_reits' },
      { id: 'r5', title: 'Know Your Product (NDCF & Occupancy metrics)', completed: false, topicId: 'types_of_reits' },
    ],
  },
  bonds: {
    productId: 'bonds',
    productName: 'Corporate Bonds & High Yield Debt',
    requiredItems: [
      { id: 'b1', title: 'Corporate Bonds 101 & Fixed Income Basics', completed: true, topicId: 'corporate_bonds_101' },
      { id: 'b2', title: 'Credit Ratings (AAA, AA+, BBB & Default Risk)', completed: true, topicId: 'credit_ratings_explained' },
      { id: 'b3', title: 'Interest Rate Inverse Sensitivity', completed: false, topicId: 'bond_yields_interest_rates' },
      { id: 'b4', title: 'SEBI Debt Market Liquidity Rules', completed: false, topicId: 'sebi_regulations' },
    ],
  },
  mutual_funds: {
    productId: 'mutual_funds',
    productName: 'Mutual Funds & Equity SIPs',
    requiredItems: [
      { id: 'm1', title: 'Mutual Funds 101: NAV & Expense Ratio', completed: true },
      { id: 'm2', title: 'SIP vs Lumpsum Compounding', completed: true },
      { id: 'm3', title: 'Direct vs Regular Plans', completed: true },
      { id: 'm4', title: 'SEBI Categorization Norms', completed: true },
    ],
  },
};

// Initial User Stats & Bookmarks
export const INITIAL_USER_STATS = {
  gyaanPoints: 480,
  topicsCompleted: 12,
  learningStreak: 7,
  currentLevel: 'Stage 2 — Investment Options',
  activeBadge: 'Smart Product Learner',
};

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'b_1',
    topicId: 'what_is_reit',
    title: 'What is REIT?',
    category: 'REITs & InvITs',
    savedDate: 'Yesterday',
    note: 'Review this before allocating 10% portfolio funds into Mindspace or Embassy REIT.',
    type: 'Lesson',
  },
  {
    id: 'b_2',
    topicId: 'corporate_bonds_101',
    title: 'Corporate Bonds 101',
    category: 'Debt & Bonds',
    savedDate: '3 days ago',
    note: 'Remember to check CRISIL AAA ratings before buying fixed income bonds.',
    type: 'Lesson',
  },
];
