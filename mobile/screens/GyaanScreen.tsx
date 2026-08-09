import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import {
  BookOpen,
  Star,
  Award,
  ShieldCheck,
  Flame,
  TrendingUp,
  Building2,
  Landmark,
  ShieldAlert,
  ArrowRight,
  User,
  CheckCircle2,
  Sliders,
  Sparkles,
  Clock,
  X,
  ChevronRight,
  LogOut,
  Play,
  PlayCircle,
  GraduationCap,
  PieChart,
  BarChart3,
  FileText,
  ChevronDown,
  Coins,
  ArrowLeft,
  Bookmark,
  Share2,
  ThumbsUp,
  AlertTriangle,
  Users,
  Filter,
  Search,
  Lock,
  Zap,
} from 'lucide-react-native';

const TOPICS_DATA: Record<string, any> = {
  'What is REIT?': {
    id: 'reit',
    title: 'What is REIT?',
    readTime: '5 min read',
    subtitle: 'Earn from Real Estate, without buying it.',
    nextTopicKey: 'What is InvIT?',
    nextTopicTitle: 'Next: What is InvIT?',
    takeaways: [
      'REIT stands for Real Estate Investment Trust.',
      'It lets you invest in income-generating real estate.',
      'You earn rental income + potential capital appreciation.',
      'SEBI regulated and more transparent.',
      'Good for long-term passive income.',
    ],
    steps: [
      { label: 'REIT owns income-generating properties', iconType: 'building' },
      { label: 'Earns rental income', iconType: 'coin' },
      { label: 'Distributes 90%+ income to investors', iconType: 'people' },
      { label: 'Unit price may appreciate', iconType: 'chart' },
    ],
    example: {
      name: 'Mindspace Business Parks REIT',
      desc: 'Mindspace Business Parks REIT owns offices in India\'s top cities and earns rent from big companies.',
      linkText: 'Explore this REIT >',
    },
    suitability: [
      'You want passive income',
      'You have medium to long term horizon',
      'You want diversification beyond stocks',
      'You understand the risks involved',
    ],
    risks: [
      'Market risk: Unit prices can go down',
      'Interest rate risk: Rising rates can affect returns',
      'Property vacancy & rental risk',
    ],
  },
  'What is InvIT?': {
    id: 'invit',
    title: 'What is InvIT?',
    readTime: '5 min read',
    subtitle: 'Invest in highways, power transmission & infra assets.',
    nextTopicKey: 'Corporate Bonds 101',
    nextTopicTitle: 'Next: Corporate Bonds 101',
    takeaways: [
      'InvIT stands for Infrastructure Investment Trust.',
      'It lets individual investors own toll roads, transmission lines & solar parks.',
      'Quarterly cash distributions paid directly to unit holders.',
      'SEBI regulated infrastructure asset class.',
      'Higher yield potential than traditional fixed deposits.',
    ],
    steps: [
      { label: 'InvIT acquires operational toll roads/power grids', iconType: 'building' },
      { label: 'Collects toll & transmission fees', iconType: 'coin' },
      { label: 'Distributes 90%+ cash flows as yield', iconType: 'people' },
      { label: 'Long-term stable cash generation', iconType: 'chart' },
    ],
    example: {
      name: 'PowerGrid Infrastructure Investment Trust',
      desc: 'PowerGrid InvIT owns power transmission assets across India and distributes steady quarterly returns.',
      linkText: 'Explore this InvIT >',
    },
    suitability: [
      'You seek steady cash flow distributions',
      'You want exposure to national infrastructure projects',
      'You have a 3 to 7 year investment horizon',
      'You want high-yield passive income',
    ],
    risks: [
      'Toll traffic volume fluctuations',
      'Regulatory tariff revisions by power authorities',
      'Interest rate sensitivity',
    ],
  },
  'Corporate Bonds 101': {
    id: 'bonds',
    title: 'Corporate Bonds 101',
    readTime: '5 min read',
    subtitle: 'Earn fixed interest payouts from India\'s top corporates.',
    nextTopicKey: 'What is REIT?',
    nextTopicTitle: 'Next: What is REIT?',
    takeaways: [
      'Bonds are debt instruments issued by companies to borrow capital.',
      'Investors receive fixed periodic coupon (interest) payments.',
      'Rated by CRISIL/ICRA (e.g. AAA, AA+) for credit safety.',
      'Provides capital protection & predictable returns.',
      'Acts as a defensive cushion against equity volatility.',
    ],
    steps: [
      { label: 'Company issues bond with fixed coupon rate', iconType: 'building' },
      { label: 'Investor buys bond units', iconType: 'coin' },
      { label: 'Receives semi-annual/annual interest', iconType: 'people' },
      { label: 'Principal returned at maturity', iconType: 'chart' },
    ],
    example: {
      name: 'InCred Financial 9.5% Senior Bond',
      desc: 'InCred Financial offers 9.5% per annum fixed yield paid monthly with SEBI depositories verification.',
      linkText: 'Explore Corporate Bonds >',
    },
    suitability: [
      'You want regular fixed interest payouts',
      'You want lower volatility than direct stocks',
      'You want to balance an equity-heavy portfolio',
      'You understand credit ratings (AAA vs BBB)',
    ],
    risks: [
      'Credit/Default risk if issuer defaults',
      'Liquidity risk before maturity date',
      'Inflation eroding real returns',
    ],
  },
};

const API_BASE = 'https://dhan-sarthi.onrender.com';

export default function GyaanScreen() {
  const navigation = useNavigation<any>();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutor' | 'path' | 'simulators' | 'readiness'>('dashboard');

  // Topic Lesson Modal State
  const [selectedTopicKey, setSelectedTopicKey] = useState<string | null>(null);
  const [topicLang, setTopicLang] = useState<string>('हिंदी');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [helpfulCount, setHelpfulCount] = useState<number>(128);
  const [isHelpfulClicked, setIsHelpfulClicked] = useState<boolean>(false);

  // Screen 1 - 8 Multi-Screen Navigation State
  const [viewMode, setViewMode] = useState<'main' | 'all_topics' | 'interactive' | 'suitability' | 'suitability_result' | 'explore_reits' | 'invest_action'>('main');
  const [allTopicsFilter, setAllTopicsFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Not Started'>('All');
  const [searchTopicQuery, setSearchTopicQuery] = useState('');
  const [interactiveStep, setInteractiveStep] = useState(1);
  const [suitabilityStep, setSuitabilityStep] = useState(1);
  const [selectedGoalOption, setSelectedGoalOption] = useState('Passive Income');
  const [selectedReitTab, setSelectedReitTab] = useState<'All' | 'Office' | 'Retail' | 'Industrial'>('All');
  const [selectedReitAsset, setSelectedReitAsset] = useState<any>({
    name: 'Mindspace Business Parks REIT',
    tag: 'Office',
    price: 275.40,
    change: '+1.02%',
    yield: '7.36%',
    nav: '275.40',
    occupancy: '92.4%',
    aum: '₹21,296 Cr',
    desc: 'Mindspace REIT owns quality office assets in India\'s top cities with strong tenants and stable cash flows.',
  });
  const [investType, setInvestType] = useState<'one_time' | 'sip'>('one_time');
  const [investAmount, setInvestAmount] = useState('10000');
  const [investSuccess, setInvestSuccess] = useState(false);

  // User Gamification State
  const [streakDays, setStreakDays] = useState(7);
  const [activeBadge, setActiveBadge] = useState('Beginner Investor Badge');

  // AI Tutor State
  const [query, setQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('English');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; topic?: string; badge?: string }>>([
    {
      sender: 'ai',
      text: '👋 Namaste Arnam! I am your AI Financial Tutor. Ask me anything about REITs, Mutual Funds, Bonds, or Stock Market risks in your preferred language.',
    },
  ]);

  // Quiz Modal State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // SIP Simulator State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipReturnRate, setSipReturnRate] = useState(12);

  // Bond Simulator State
  const [bondInvestment, setBondInvestment] = useState(100000);
  const [bondYield, setBondYield] = useState(8);

  // Before You Invest Readiness State
  const [readinessChecklist, setReadinessChecklist] = useState([
    { id: 1, title: 'What is a REIT / Commercial Realty Trust?', checked: true },
    { id: 2, title: 'Risk involved & dividend yield fluctuations', checked: true },
    { id: 3, title: 'Expected rental distribution schedule (90% payout)', checked: true },
    { id: 4, title: 'Liquidity & lock-in requirements under SEBI norms', checked: false },
  ]);
  const [certificationCompleted, setCertificationCompleted] = useState(false);

  const languages = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Marathi'];

  // Calculate SIP wealth formula
  const calculateSIP = () => {
    const i = sipReturnRate / 12 / 100;
    const n = sipYears * 12;
    const futureVal = sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedVal = sipMonthly * n;
    const wealthGain = futureVal - investedVal;
    return {
      futureVal: Math.round(futureVal),
      investedVal: Math.round(investedVal),
      wealthGain: Math.round(wealthGain),
    };
  };

  // Calculate Bond Returns
  const calculateBond = () => {
    const annualPayout = (bondInvestment * bondYield) / 100;
    const totalReturn5Yrs = bondInvestment + annualPayout * 5;
    return {
      annualPayout: Math.round(annualPayout),
      monthlyPayout: Math.round(annualPayout / 12),
      totalReturn5Yrs: Math.round(totalReturn5Yrs),
    };
  };

  // Send question to AI Tutor API
  const askGyaan = async (promptText?: string) => {
    const textToAsk = promptText || query;
    if (!textToAsk.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: textToAsk }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/ask-gyaan`, {
        query: textToAsk,
        language: selectedLang,
      });

      const data = res.data;
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.explanation || `Here is a bite-sized lesson on ${textToAsk}.`,
          topic: data.topic,
          badge: data.badge_awarded,
        },
      ]);
    } catch (err) {
      let fallbackText = `A REIT is like owning a small part of a commercial property without buying the whole building. Example: Instead of buying a ₹5 crore mall, you can invest ₹5,000 and earn proportional rental income!`;
      if (selectedLang === 'Hindi') {
        fallbackText = `REIT (रीट) एक व्यावसायिक संपत्ति में छोटी हिस्सेदारी खरीदने जैसा है। उदाहरण: ₹5 करोड़ का पूरा मॉल खरीदने के बजाय, आप ₹5,000 का निवेश कर किराए की आय कमा सकते हैं!`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackText,
          topic: textToAsk,
          badge: 'Market Explorer',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (selectedIndex: number) => {
    setQuizAnswered(true);
    setQuizScore(selectedIndex === 1 ? 100 : 0);
    if (selectedIndex === 1) {
      setActiveBadge('REIT Master');
    }
  };

  const sipResults = calculateSIP();
  const bondResults = calculateBond();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
          {/* HERO BANNER - SEBI NAVY BLUE */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.badgePill}>
                  <BookOpen color="#ffffff" size={12} />
                  <Text style={styles.heroBadgeText}>SEBI INVESTOR EDUCATION</Text>
                </View>
                <Text style={styles.heroBadgeSub}>• Dhan Gyaan</Text>
              </View>

              <TouchableOpacity
                style={styles.userProfileBtn}
                onPress={() => setProfileModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.avatarCircle}>
                  <User color="#1b3a6b" size={13} />
                </View>
                <Text style={styles.profileNameText}>Arnam</Text>
                <ChevronRight color="rgba(255,255,255,0.7)" size={12} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>

            <Text style={styles.heroTitle}>Financial Awareness Hub</Text>
            <Text style={styles.heroSub}>Learn about Securities Markets, Investor Rights & Portfolio Suitability</Text>
          </View>

          {/* DEMO NAVIGATION SEGMENT TAB BAR */}
          <View style={styles.tabBarWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'dashboard' && styles.tabButtonActive]}
                onPress={() => setActiveTab('dashboard')}
              >
                <BookOpen color={activeTab === 'dashboard' ? '#ffffff' : '#1b3a6b'} size={14} />
                <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'tutor' && styles.tabButtonActive]}
                onPress={() => setActiveTab('tutor')}
              >
                <Sparkles color={activeTab === 'tutor' ? '#ffffff' : '#1b3a6b'} size={14} />
                <Text style={[styles.tabText, activeTab === 'tutor' && styles.tabTextActive]}>AI Tutor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'simulators' && styles.tabButtonActive]}
                onPress={() => setActiveTab('simulators')}
              >
                <Sliders color={activeTab === 'simulators' ? '#ffffff' : '#1b3a6b'} size={14} />
                <Text style={[styles.tabText, activeTab === 'simulators' && styles.tabTextActive]}>Simulators</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.contentPadding}>
            {/* ======================================================== */}
          {/* TAB 1: DASHBOARD / HOME */}
          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD / HOME (WITH ALL 8 USER JOURNEY SCREENS) */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <View style={{ gap: 20 }}>
              {/* SCREEN 1: HOME VIEW */}
              {viewMode === 'main' && (
                <View style={{ gap: 20 }}>
                  {/* 1. TOP HERO BANNER */}
                  <View style={styles.heroBannerNew}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={styles.heroBannerTitle}>Gyaan se hi{'\n'}nivesh ka gyaan!</Text>
                      <Text style={styles.heroBannerSub}>Learn in 5 mins,{'\n'}Invest for life.</Text>
                    </View>
                    <View style={styles.heroBannerIllustration}>
                      <Svg width={105} height={95} viewBox="0 0 105 95">
                        <Circle cx="52" cy="50" r="40" fill="#dbeafe" opacity={0.6} />
                        <Circle cx="82" cy="18" r="9" fill="#fef08a" />
                        <Path d="M 82 9 A 6 6 0 0 1 82 22 L 82 24 M 79 24 L 85 24" stroke="#d97706" strokeWidth="2" fill="none" />
                        <Circle cx="50" cy="34" r="14" fill="#fed7aa" />
                        <Path d="M 36 65 C 36 48, 64 48, 64 65 Z" fill="#1e3a8a" />
                        <Path d="M 28 58 L 50 50 L 72 58 L 72 74 L 50 66 L 28 74 Z" fill="#3b82f6" />
                        <Path d="M 50 50 L 50 66" stroke="#1d4ed8" strokeWidth="1.5" />
                      </Svg>
                    </View>
                  </View>

                  {/* 2. YOUR LEARNING PROGRESS */}
                  <View>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowHeaderTitle}>Your Learning Progress</Text>
                      <TouchableOpacity onPress={() => setViewMode('all_topics')}>
                        <Text style={styles.rowHeaderLink}>View all</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.progressCardNew}>
                      <View style={styles.progressStatsRow}>
                        <View style={styles.statCol}>
                          <Text style={styles.statNumberBlue}>7</Text>
                          <Text style={styles.statLabelSub}>Topics Learned</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statCol}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Coins color="#eab308" size={18} fill="#fef08a" />
                            <Text style={styles.statNumberBlue}>250</Text>
                          </View>
                          <Text style={styles.statLabelSub}>Gyaan Points</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statCol}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Flame color="#f97316" size={18} fill="#f97316" />
                            <Text style={styles.statNumberBlue}>{streakDays}</Text>
                          </View>
                          <Text style={styles.statLabelSub}>Day Streak</Text>
                        </View>
                      </View>

                      <View style={{ marginTop: 16 }}>
                        <View style={styles.progressBarTrackNew}>
                          <View style={[styles.progressBarFillNew, { width: '70%' }]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <Text style={styles.progressSubHint}>Keep learning! 3 more topics to unlock next badge.</Text>
                          <Text style={styles.progressPctBold}>70%</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* 3. QUICK LEARN (5 mins or less) */}
                  <View>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowHeaderTitle}>Quick Learn (5 mins or less)</Text>
                      <TouchableOpacity onPress={() => setViewMode('all_topics')}>
                        <Text style={styles.rowHeaderLink}>See all</Text>
                      </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                      <TouchableOpacity style={styles.quickLearnCard} onPress={() => setSelectedTopicKey('What is REIT?')}>
                        <View style={[styles.quickCardIllusBox, { backgroundColor: '#ecfdf5' }]}>
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularBadgeText}>Popular</Text>
                          </View>
                          <Building2 color="#059669" size={38} style={{ opacity: 0.8 }} />
                        </View>
                        <Text style={styles.quickCardTitle}>What is REIT?</Text>
                        <View style={styles.quickCardFooter}>
                          <Text style={styles.quickCardTime}>5 min read</Text>
                          <PlayCircle color="#2563eb" size={20} />
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.quickLearnCard} onPress={() => setSelectedTopicKey('What is InvIT?')}>
                        <View style={[styles.quickCardIllusBox, { backgroundColor: '#f3e8ff' }]}>
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>New</Text>
                          </View>
                          <Landmark color="#7e22ce" size={38} style={{ opacity: 0.8 }} />
                        </View>
                        <Text style={styles.quickCardTitle}>What is InvIT?</Text>
                        <View style={styles.quickCardFooter}>
                          <Text style={styles.quickCardTime}>5 min read</Text>
                          <PlayCircle color="#2563eb" size={20} />
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.quickLearnCard} onPress={() => setSelectedTopicKey('Corporate Bonds 101')}>
                        <View style={[styles.quickCardIllusBox, { backgroundColor: '#fffbe6' }]}>
                          <Award color="#d97706" size={38} style={{ opacity: 0.8 }} />
                        </View>
                        <Text style={styles.quickCardTitle}>Corporate Bonds 101</Text>
                        <View style={styles.quickCardFooter}>
                          <Text style={styles.quickCardTime}>5 min read</Text>
                          <PlayCircle color="#2563eb" size={20} />
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>

                  {/* 4. CONTINUE LEARNING */}
                  <View>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowHeaderTitle}>Continue Learning</Text>
                    </View>

                    <TouchableOpacity style={styles.continueMintCard} onPress={() => setSelectedTopicKey('What is REIT?')}>
                      <View style={styles.continueThumbBox}>
                        <Svg width={48} height={48} viewBox="0 0 48 48">
                          <Rect width="48" height="48" rx="10" fill="#93c5fd" />
                          <Path d="M 8 40 L 24 16 L 40 40 Z" fill="#1e40af" />
                          <Path d="M 18 40 L 30 24 L 42 40 Z" fill="#3b82f6" opacity={0.7} />
                          <Path d="M 24 16 L 24 10 L 30 13 Z" fill="#ef4444" />
                        </Svg>
                      </View>

                      <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Text style={styles.continueMintTitle} numberOfLines={2}>Risk vs Return: Samjho pehle, nivesh karo phir</Text>
                        <Text style={styles.continueMintSub}>Part 2 of 5  •  3 min left</Text>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <View style={styles.continueBarTrack}>
                            <View style={[styles.continueBarFill, { width: '60%' }]} />
                          </View>
                          <Text style={styles.continueMintPct}>60%</Text>
                        </View>
                      </View>

                      <View style={styles.playTealCircleBtn}>
                        <Play color="#ffffff" size={16} fill="#ffffff" style={{ marginLeft: 2 }} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* 5. LEARN BY CATEGORY */}
                  <View>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowHeaderTitle}>Learn by Category</Text>
                      <TouchableOpacity onPress={() => setViewMode('all_topics')}>
                        <Text style={styles.rowHeaderLink}>See all</Text>
                      </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
                      <TouchableOpacity style={styles.categoryItemCol} onPress={() => setViewMode('all_topics')}>
                        <View style={[styles.catSquareIcon, { backgroundColor: '#eff6ff' }]}>
                          <GraduationCap color="#1d4ed8" size={26} />
                        </View>
                        <Text style={styles.catSquareLabel}>Basics</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.categoryItemCol} onPress={() => setViewMode('all_topics')}>
                        <View style={[styles.catSquareIcon, { backgroundColor: '#ecfdf5' }]}>
                          <BarChart3 color="#059669" size={26} />
                        </View>
                        <Text style={styles.catSquareLabel}>Equity</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.categoryItemCol} onPress={() => setViewMode('all_topics')}>
                        <View style={[styles.catSquareIcon, { backgroundColor: '#f3e8ff' }]}>
                          <PieChart color="#7e22ce" size={26} />
                        </View>
                        <Text style={styles.catSquareLabel}>Mutual Funds</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.categoryItemCol} onPress={() => setSelectedTopicKey('What is REIT?')}>
                        <View style={[styles.catSquareIcon, { backgroundColor: '#e0f2fe' }]}>
                          <Building2 color="#0284c7" size={26} />
                        </View>
                        <Text style={styles.catSquareLabel}>REITs & InvITs</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.categoryItemCol} onPress={() => setSelectedTopicKey('Corporate Bonds 101')}>
                        <View style={[styles.catSquareIcon, { backgroundColor: '#fef3c7' }]}>
                          <Award color="#d97706" size={26} />
                        </View>
                        <Text style={styles.catSquareLabel}>Bonds</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>

                  {/* 6. BEFORE YOU INVEST */}
                  <TouchableOpacity style={styles.beforeInvestCard} onPress={() => setViewMode('suitability')}>
                    <View style={styles.beforeInvestIconBadge}>
                      <ShieldCheck color="#d97706" size={24} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <Text style={styles.beforeInvestTitle}>Before You Invest</Text>
                      <Text style={styles.beforeInvestSub}>Complete mandatory lessons before investing in new products.</Text>
                    </View>
                    <View style={styles.exploreNowBtn}>
                      <Text style={styles.exploreNowBtnText}>Explore Now</Text>
                    </View>
                  </TouchableOpacity>

                  {/* 7. FROM SEBI */}
                  <View>
                    <View style={styles.rowHeader}>
                      <Text style={styles.rowHeaderTitle}>From SEBI</Text>
                      <TouchableOpacity onPress={() => setActiveTab('readiness')}>
                        <Text style={styles.rowHeaderLink}>See all</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.sebiNewsCard} onPress={() => setActiveTab('readiness')}>
                      <View style={styles.sebiDocIconBox}>
                        <FileText color="#0284c7" size={24} />
                      </View>
                      <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Text style={styles.sebiNewsTitle}>Latest SEBI Circular Explained</Text>
                        <Text style={styles.sebiNewsSub}>SEBI (LODR) Amendment Simplified</Text>
                        <Text style={styles.sebiNewsMeta}>4 min read  •  Hindi</Text>
                      </View>
                      <View style={styles.sebiChevronCircle}>
                        <ChevronDown color="#64748b" size={16} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SCREEN 2: ALL TOPICS / PROGRESS */}
              {viewMode === 'all_topics' && (
                <View style={{ gap: 16 }}>
                  <View style={styles.subHeaderNav}>
                    <TouchableOpacity onPress={() => setViewMode('main')} style={{ padding: 4 }}>
                      <ArrowLeft color="#0f172a" size={22} />
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>My Learning Progress</Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.statSummaryCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                      <Text style={{ fontSize: 22, fontWeight: '800', color: '#1d4ed8' }}>70%</Text>
                      <Text style={{ fontSize: 11, color: '#475569', fontWeight: '500', marginTop: 2 }}>Overall Progress</Text>
                    </View>
                    <View style={[styles.statSummaryCard, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Flame color="#f97316" size={20} fill="#f97316" />
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#c2410c' }}>250</Text>
                      </View>
                      <Text style={{ fontSize: 11, color: '#475569', fontWeight: '500', marginTop: 2 }}>Gyaan Points</Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {[
                      { label: 'All (12)', key: 'All' },
                      { label: 'Completed (7)', key: 'Completed' },
                      { label: 'In Progress (2)', key: 'In Progress' },
                      { label: 'Not Started (3)', key: 'Not Started' },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[styles.allFilterChip, allTopicsFilter === item.key && styles.allFilterChipActive]}
                        onPress={() => setAllTopicsFilter(item.key as any)}
                      >
                        <Text style={[styles.allFilterChipText, allTopicsFilter === item.key && styles.allFilterChipTextActive]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.searchBarRow}>
                    <Search color="#94a3b8" size={18} style={{ marginLeft: 12 }} />
                    <TextInput
                      style={styles.searchInputField}
                      placeholder="Search topics..."
                      placeholderTextColor="#94a3b8"
                      value={searchTopicQuery}
                      onChangeText={setSearchTopicQuery}
                    />
                    <TouchableOpacity style={styles.filterIconBtn}>
                      <Filter color="#475569" size={18} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.listSectionHeader}>Recommended for You</Text>
                  <View style={{ gap: 10 }}>
                    {[
                      { title: 'What is REIT?', desc: 'Real Estate Investment Trusts', time: '5 min read', status: 'completed' },
                      { title: 'What is InvIT?', desc: 'Infrastructure Investment Trusts', time: '5 min read', status: 'in_progress', pct: '60%' },
                      { title: 'Corporate Bonds 101', desc: 'Understanding Debt Investments', time: '5 min read', status: 'not_started' },
                    ].map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.topicListItemCard}
                        onPress={() => setSelectedTopicKey(item.title)}
                      >
                        <View style={styles.topicListThumb}>
                          {idx === 0 && <Building2 color="#059669" size={24} />}
                          {idx === 1 && <Landmark color="#7e22ce" size={24} />}
                          {idx === 2 && <Award color="#d97706" size={24} />}
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 10 }}>
                          <Text style={styles.topicListTitle}>{item.title}</Text>
                          <Text style={styles.topicListSub}>{item.desc}</Text>
                          <Text style={styles.topicListTime}>⏱ {item.time}</Text>
                        </View>
                        <View>
                          {item.status === 'completed' && <CheckCircle2 color="#16a34a" size={22} fill="#dcfce7" />}
                          {item.status === 'in_progress' && (
                            <View style={styles.pctBadgeCircle}>
                              <Text style={{ fontSize: 10, fontWeight: '800', color: '#2563eb' }}>{item.pct}</Text>
                            </View>
                          )}
                          {item.status === 'not_started' && <View style={styles.emptyCircleIndicator} />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.listSectionHeader}>All Topics</Text>
                  <View style={{ gap: 10 }}>
                    {[
                      { title: 'Basics of Investing', desc: 'Start your journey', time: '8 min read', status: 'completed' },
                      { title: 'Equity Investing 101', desc: 'Understand Stocks', time: '7 min read', status: 'completed' },
                      { title: 'Mutual Funds Basics', desc: 'SIP, NAV, Returns', time: '6 min read', status: 'in_progress', badge: 'In Progress' },
                      { title: 'REITs vs Stocks', desc: 'Which is better?', time: '5 min read', status: 'not_started' },
                    ].map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.topicListItemCard}
                        onPress={() => setSelectedTopicKey('What is REIT?')}
                      >
                        <View style={[styles.topicListThumb, { backgroundColor: '#f1f5f9' }]}>
                          <BookOpen color="#334155" size={22} />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 10 }}>
                          <Text style={styles.topicListTitle}>{item.title}</Text>
                          <Text style={styles.topicListSub}>{item.desc}</Text>
                          <Text style={styles.topicListTime}>⏱ {item.time}</Text>
                        </View>
                        <View>
                          {item.status === 'completed' && <CheckCircle2 color="#16a34a" size={22} fill="#dcfce7" />}
                          {item.badge && (
                            <View style={styles.blueTagBadge}>
                              <Text style={styles.blueTagText}>{item.badge}</Text>
                            </View>
                          )}
                          {item.status === 'not_started' && <View style={styles.emptyCircleIndicator} />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* SCREEN 4: INTERACTIVE CONTENT / STEPPER */}
              {viewMode === 'interactive' && (
                <View style={{ gap: 16 }}>
                  <View style={styles.subHeaderNav}>
                    <TouchableOpacity onPress={() => setViewMode('main')} style={{ padding: 4 }}>
                      <ArrowLeft color="#0f172a" size={22} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.subHeaderTitle}>How REITs Work?</Text>
                      <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '500' }}>Step {interactiveStep} of 4</Text>
                    </View>
                  </View>

                  <View style={styles.interactiveStepperTrack}>
                    <View style={[styles.interactiveStepperFill, { width: `${(interactiveStep / 4) * 100}%` }]} />
                  </View>

                  <View style={styles.interactiveGraphicCard}>
                    <Svg width="100%" height={180} viewBox="0 0 320 180">
                      <Rect width="320" height="180" rx="20" fill="#dbeafe" />
                      <Path d="M 60 180 L 60 30 L 160 30 L 160 180 Z" fill="#1e40af" />
                      <Path d="M 160 180 L 160 30 L 220 50 L 220 180 Z" fill="#3b82f6" opacity={0.8} />
                      {[45, 75, 105, 135].map((y) => (
                        <React.Fragment key={y}>
                          <Rect x="75" y={y} width="22" height="18" fill="#93c5fd" rx="2" />
                          <Rect x="115" y={y} width="22" height="18" fill="#93c5fd" rx="2" />
                          <Rect x="172" y={y + 5} width="18" height="15" fill="#60a5fa" rx="2" />
                        </React.Fragment>
                      ))}
                      <Circle cx="35" cy="165" r="16" fill="#15803d" />
                      <Circle cx="250" cy="165" r="18" fill="#16a34a" />
                    </Svg>
                  </View>

                  <Text style={styles.stepTitleHeading}>Step {interactiveStep}: REIT प्रॉपर्टी खरीदता है</Text>
                  <Text style={styles.stepDescBody}>
                    REIT वही है जो आपके लिए बड़ी प्रॉपर्टीज़ जैसे ऑफिस, मॉल, वेअरहाउस, हॉस्पिटल्स आदि को खरीदता या बनवाता है।
                  </Text>

                  <Text style={styles.examplePropLabel}>Example Properties</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {[
                      { title: 'Office Parks', color: '#dbeafe' },
                      { title: 'Retail Malls', color: '#fbcfe8' },
                      { title: 'Warehouses', color: '#fef08a' },
                    ].map((item, idx) => (
                      <View key={idx} style={styles.examplePropCard}>
                        <View style={[styles.examplePropIconBox, { backgroundColor: item.color }]}>
                          <Building2 color="#1e3a8a" size={24} />
                        </View>
                        <Text style={styles.examplePropTitle}>{item.title}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.didYouKnowBox}>
                    <CheckCircle2 color="#16a34a" size={20} style={{ marginTop: 1 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.didYouKnowTitle}>Did you know?</Text>
                      <Text style={styles.didYouKnowText}>
                        भारत में REITs को कम से कम 80% प्रॉपर्टी में निवेश करना होता है।
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                    <TouchableOpacity
                      style={styles.stepBackBtn}
                      onPress={() => {
                        if (interactiveStep > 1) setInteractiveStep(prev => prev - 1);
                        else setViewMode('main');
                      }}
                    >
                      <Text style={styles.stepBackText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepNextBtn}
                      onPress={() => {
                        if (interactiveStep < 4) setInteractiveStep(prev => prev + 1);
                        else setViewMode('suitability');
                      }}
                    >
                      <Text style={styles.stepNextText}>Next Step →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SCREEN 5: SUITABILITY CHECK QUIZ */}
              {viewMode === 'suitability' && (
                <View style={{ gap: 16 }}>
                  <View style={styles.subHeaderNav}>
                    <TouchableOpacity onPress={() => setViewMode('interactive')} style={{ padding: 4 }}>
                      <ArrowLeft color="#0f172a" size={22} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.subHeaderTitle}>Is REIT right for you?</Text>
                      <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '500' }}>Step {suitabilityStep} of 5</Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500' }}>
                    कुछ सवालों के जवाब दें और जानें कि क्या REIT आपके लिए सही है।
                  </Text>

                  <View style={styles.interactiveStepperTrack}>
                    <View style={[styles.interactiveStepperFill, { width: `${(suitabilityStep / 5) * 100}%` }]} />
                  </View>

                  <Text style={styles.quizGoalQuestion}>आपका मुख्य निवेश लक्ष्य क्या है?</Text>

                  <View style={{ gap: 10 }}>
                    {[
                      { label: 'नियमित आय (Passive Income)', key: 'Passive Income' },
                      { label: 'पूंजी वृद्धि (Capital Appreciation)', key: 'Capital Growth' },
                      { label: 'धन संरक्षण (Wealth Protection)', key: 'Protection' },
                      { label: 'टैक्स बचत (Tax Saving)', key: 'Tax Saving' },
                      { label: 'अन्य', key: 'Other' },
                    ].map((opt) => (
                      <TouchableOpacity
                        key={opt.key}
                        style={[styles.quizGoalCard, selectedGoalOption === opt.key && styles.quizGoalCardActive]}
                        onPress={() => setSelectedGoalOption(opt.key)}
                      >
                        <View style={styles.quizGoalIconWrap}>
                          {opt.key === 'Passive Income' && <Coins color="#059669" size={20} fill="#fef08a" />}
                          {opt.key === 'Capital Growth' && <TrendingUp color="#1d4ed8" size={20} />}
                          {opt.key === 'Protection' && <ShieldCheck color="#7e22ce" size={20} />}
                          {opt.key === 'Tax Saving' && <Award color="#d97706" size={20} />}
                          {opt.key === 'Other' && <BookOpen color="#475569" size={20} />}
                        </View>
                        <Text style={[styles.quizGoalLabel, selectedGoalOption === opt.key && styles.quizGoalLabelActive]}>
                          {opt.label}
                        </Text>
                        <View>
                          {selectedGoalOption === opt.key ? (
                            <CheckCircle2 color="#10b981" size={22} fill="#10b981" />
                          ) : (
                            <View style={styles.radioEmptyCircle} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.infoNoticeCallout}>
                    <Sparkles color="#0284c7" size={18} />
                    <Text style={styles.infoNoticeText}>
                      यह जानकारी आपकी उपयुक्तता जांचने में मदद करेगी
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.suitabilityContinueBtn}
                    onPress={() => setViewMode('suitability_result')}
                  >
                    <Text style={styles.suitabilityContinueText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* SCREEN 6: SUITABILITY RESULT */}
              {viewMode === 'suitability_result' && (
                <View style={{ gap: 16 }}>
                  <View style={styles.subHeaderNav}>
                    <TouchableOpacity onPress={() => setViewMode('suitability')} style={{ padding: 4 }}>
                      <ArrowLeft color="#0f172a" size={22} />
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>Suitability Result</Text>
                  </View>

                  <View style={styles.resultCheckBurstBox}>
                    <Svg width={110} height={110} viewBox="0 0 110 110">
                      <Circle cx="55" cy="55" r="45" fill="#10b981" />
                      <Path d="M 38 55 L 50 67 L 74 43" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <Circle cx="15" cy="25" r="4" fill="#f59e0b" />
                      <Circle cx="95" cy="30" r="5" fill="#3b82f6" />
                      <Circle cx="20" cy="85" r="5" fill="#ec4899" />
                      <Circle cx="90" cy="80" r="4" fill="#10b981" />
                    </Svg>

                    <Text style={styles.matchHeadingTitle}>Good Match! 🟩</Text>
                    <Text style={styles.matchHeadingSub}>REIT आपके लिए उपयुक्त हो सकता है।</Text>
                  </View>

                  <View style={styles.whySuitableCard}>
                    <Text style={styles.whySectionTitle}>क्यों?</Text>
                    <View style={{ gap: 8, marginTop: 8 }}>
                      {[
                        'आपका लक्ष्य: नियमित आय',
                        'आपका जोखिम स्तर: मध्यम',
                        'निवेश अवधि: 3-5 साल',
                        'आपका पोर्टफोलियो: विविध है',
                      ].map((point, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 color="#10b981" size={18} />
                          <Text style={styles.whyPointText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.whySuitableCard}>
                    <Text style={styles.whySectionTitle}>अनुशंसित आवंटन</Text>
                    <Text style={{ fontSize: 12, color: '#475569', marginTop: 4, fontWeight: '500' }}>
                      अपने पोर्टफोलियो का <Text style={{ fontWeight: '800', color: '#047857' }}>10% - 15%</Text> REITs में निवेश करें।
                    </Text>

                    <View style={{ marginTop: 14 }}>
                      <View style={styles.allocTrackBg}>
                        <View style={[styles.allocFillBar, { left: '30%', width: '40%' }]} />
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                        <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>10%</Text>
                        <Text style={{ fontSize: 12, color: '#059669', fontWeight: '800' }}>15%</Text>
                        <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>20%</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                    <TouchableOpacity
                      style={styles.resultSecondaryBtn}
                      onPress={() => setSelectedTopicKey('What is REIT?')}
                    >
                      <Text style={styles.resultSecondaryText}>और जानें</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.resultPrimaryBtn}
                      onPress={() => setViewMode('explore_reits')}
                    >
                      <Text style={styles.resultPrimaryText}>REITs देखें →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SCREEN 7: EXPLORE REITS MARKETPLACE */}
              {viewMode === 'explore_reits' && (
                <View style={{ gap: 16 }}>
                  <View style={styles.subHeaderNav}>
                    <TouchableOpacity onPress={() => setViewMode('suitability_result')} style={{ padding: 4 }}>
                      <ArrowLeft color="#0f172a" size={22} />
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>Explore REITs</Text>
                    <TouchableOpacity style={[styles.filterIconBtn, { marginLeft: 'auto' }]}>
                      <Filter color="#475569" size={18} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {(['All REITs', 'Office', 'Retail', 'Industrial'] as const).map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[styles.allFilterChip, selectedReitTab === (tab.startsWith('All') ? 'All' : tab) && styles.allFilterChipActive]}
                        onPress={() => setSelectedReitTab(tab.startsWith('All') ? 'All' : (tab as any))}
                      >
                        <Text style={[styles.allFilterChipText, selectedReitTab === (tab.startsWith('All') ? 'All' : tab) && styles.allFilterChipTextActive]}>
                          {tab}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>📅 Data as of today</Text>

                  <View style={{ gap: 12 }}>
                    {[
                      { name: 'Mindspace Business Parks REIT', tag: 'Office', price: 275.40, change: '+1.02%', yield: '7.36%', nav: '275.40', occupancy: '92.4%', aum: '₹21,296 Cr', desc: 'Mindspace REIT owns quality office assets in India\'s top cities with strong tenants and stable cash flows.' },
                      { name: 'Brookfield India REIT', tag: 'Office', price: 357.10, change: '+1.25%', yield: '6.90%', nav: '357.10', occupancy: '89.5%', aum: '₹18,500 Cr', desc: 'Brookfield India REIT holds premier IT parks in Mumbai, Gurugram, and Noida.' },
                      { name: 'Nexus Select Trust', tag: 'Retail', price: 104.30, change: '+0.95%', yield: '7.12%', nav: '104.30', occupancy: '95.2%', aum: '₹23,000 Cr', desc: 'Nexus Select Trust is India\'s premier retail mall REIT owning 17 Grade A shopping malls.' },
                      { name: 'Embassy REIT', tag: 'Office', price: 321.60, change: '+1.46%', yield: '6.75%', nav: '321.60', occupancy: '90.1%', aum: '₹33,000 Cr', desc: 'Embassy Office Parks REIT is Asia\'s largest office REIT by area.' },
                    ].map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.reitMarketCard}
                        onPress={() => {
                          setSelectedReitAsset(item);
                          setViewMode('invest_action');
                        }}
                      >
                        <View style={styles.reitCardHeaderRow}>
                          <View style={styles.reitThumbIcon}>
                            <Building2 color="#0284c7" size={26} />
                          </View>
                          <View style={{ flex: 1, marginHorizontal: 10 }}>
                            <Text style={styles.reitMarketName}>{item.name}</Text>
                            <View style={styles.reitTagBadge}>
                              <Text style={styles.reitTagText}>{item.tag}</Text>
                            </View>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.reitPriceText}>₹{item.price.toFixed(2)}</Text>
                            <Text style={styles.reitChangeText}>{item.change}</Text>
                          </View>
                        </View>

                        <View style={styles.reitMetricsRow}>
                          <View>
                            <Text style={styles.metricLabelText}>Dividend Yield</Text>
                            <Text style={styles.metricValBold}>{item.yield}</Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.metricLabelText}>NAV (₹)</Text>
                            <Text style={styles.metricValBold}>{item.nav}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', marginTop: 6 }}>
                    Prices are indicative. Please read offer document carefully before investing.
                  </Text>
                </View>
              )}

              {/* SCREEN 8: INVEST / ACTION SCREEN */}
              {viewMode === 'invest_action' && (
                <View style={{ gap: 16 }}>
                  <View style={styles.subHeaderNav}>
                    <TouchableOpacity onPress={() => setViewMode('explore_reits')} style={{ padding: 4 }}>
                      <ArrowLeft color="#0f172a" size={22} />
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle} numberOfLines={1}>{selectedReitAsset.name}</Text>
                  </View>

                  <View style={styles.assetDetailCard}>
                    <View style={styles.assetHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.reitTagBadge}>
                          <Text style={styles.reitTagText}>{selectedReitAsset.tag}</Text>
                        </View>
                        <Text style={styles.assetDetailPrice}>₹{selectedReitAsset.price.toFixed(2)}</Text>
                      </View>
                      <Text style={styles.assetDetailChange}>{selectedReitAsset.change}</Text>
                    </View>

                    <Text style={styles.assetAboutHeading}>About</Text>
                    <Text style={styles.assetDescBody}>{selectedReitAsset.desc}</Text>

                    <View style={styles.threeMetricsBox}>
                      <View style={styles.metricColThree}>
                        <Text style={styles.metricColLabel}>Dividend Yield</Text>
                        <Text style={styles.metricColValGreen}>{selectedReitAsset.yield}</Text>
                      </View>
                      <View style={styles.metricColThree}>
                        <Text style={styles.metricColLabel}>Occupancy</Text>
                        <Text style={styles.metricColValGreen}>{selectedReitAsset.occupancy}</Text>
                      </View>
                      <View style={styles.metricColThree}>
                        <Text style={styles.metricColLabel}>AUM</Text>
                        <Text style={styles.metricColValGreen}>{selectedReitAsset.aum}</Text>
                      </View>
                    </View>

                    <Text style={styles.investFormTitle}>Invest Now</Text>

                    <View style={styles.investTypeToggleWrap}>
                      <TouchableOpacity
                        style={[styles.typeToggleBtn, investType === 'one_time' && styles.typeToggleBtnActive]}
                        onPress={() => setInvestType('one_time')}
                      >
                        <Text style={[styles.typeToggleText, investType === 'one_time' && styles.typeToggleTextActive]}>One-time</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.typeToggleBtn, investType === 'sip' && styles.typeToggleBtnActive]}
                        onPress={() => setInvestType('sip')}
                      >
                        <Text style={[styles.typeToggleText, investType === 'sip' && styles.typeToggleTextActive]}>SIP</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 12 }}>Amount (₹)</Text>
                    <View style={styles.amountInputRow}>
                      <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>₹</Text>
                      <TextInput
                        style={styles.amountInputField}
                        value={investAmount}
                        onChangeText={setInvestAmount}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                      {['1000', '5000', '10000'].map((amt) => (
                        <TouchableOpacity
                          key={amt}
                          style={styles.quickAmtChip}
                          onPress={() => setInvestAmount((prev) => (parseInt(prev || '0') + parseInt(amt)).toString())}
                        >
                          <Text style={styles.quickAmtChipText}>+₹{parseInt(amt).toLocaleString()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={{ fontSize: 11, color: '#64748b', marginTop: 10 }}>
                      Available Balance: <Text style={{ fontWeight: '700', color: '#0f172a' }}>₹1,25,430</Text>
                    </Text>

                    <TouchableOpacity
                      style={styles.finalInvestBtn}
                      onPress={() => {
                        setInvestSuccess(true);
                        setTimeout(() => setInvestSuccess(false), 3500);
                      }}
                    >
                      <Lock color="#ffffff" size={16} style={{ marginRight: 6 }} />
                      <Text style={styles.finalInvestBtnText}>
                        {investSuccess ? '✓ Order Executed Successfully!' : 'Invest Now'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ marginTop: 12, alignItems: 'center' }}
                      onPress={() => setViewMode('suitability')}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#047857' }}>
                        Review Suitability & Risks &gt;
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ======================================================== */}
          {/* TAB 2: AI FINANCIAL TUTOR */}
          {/* ======================================================== */}
          {activeTab === 'tutor' && (
            <View>
              <View style={styles.tutorHeader}>
                <View style={styles.tutorTitleRow}>
                  <Sparkles color="#1b3a6b" size={22} />
                  <Text style={styles.tutorTitle}>AI Financial Tutor</Text>
                </View>
                <Text style={styles.tutorSub}>Ask anything about investing in 12 Indian languages</Text>

                {/* VERNACULAR LANGUAGE SELECTOR PILLS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langScroll}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.langPill, selectedLang === lang && styles.langPillActive]}
                      onPress={() => setSelectedLang(lang)}
                    >
                      <Text style={[styles.langText, selectedLang === lang && styles.langTextActive]}>{lang}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* QUICK PROMPT CHIPS */}
              <Text style={styles.quickPromptLabel}>Suggested Questions:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptScroll}>
                <TouchableOpacity style={styles.promptChip} onPress={() => askGyaan('What is REIT?')}>
                  <Text style={styles.promptChipText}>"What is REIT?"</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.promptChip} onPress={() => askGyaan('Why diversify beyond stocks?')}>
                  <Text style={styles.promptChipText}>"Why diversify beyond stocks?"</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.promptChip} onPress={() => askGyaan('How do Mutual Funds work?')}>
                  <Text style={styles.promptChipText}>"How do Mutual Funds work?"</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* CHAT MESSAGES STREAM */}
              <View style={styles.chatContainer}>
                {chatMessages.map((msg, index) => (
                  <View
                    key={index}
                    style={[styles.chatBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}
                  >
                    <Text style={msg.sender === 'user' ? styles.userBubbleText : styles.aiBubbleText}>{msg.text}</Text>
                    {msg.sender === 'ai' && msg.topic && (
                      <TouchableOpacity style={styles.takeQuizBtn} onPress={() => setShowQuiz(true)}>
                        <BookOpen color="#1b3a6b" size={14} />
                        <Text style={styles.takeQuizBtnText}>Take 30-Second Smart Checkpoint</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {loading && (
                  <View style={[styles.chatBubble, styles.aiBubble, styles.loadingBubble]}>
                    <ActivityIndicator color="#1b3a6b" />
                    <Text style={styles.loadingText}>AI is generating vernacular real-world analogy...</Text>
                  </View>
                )}
              </View>

              {/* CHAT INPUT ROW */}
              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder={`Ask AI in ${selectedLang}...`}
                  placeholderTextColor="#94a3b8"
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={() => askGyaan()}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => askGyaan()} disabled={loading}>
                  <ArrowRight color="#ffffff" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PERSONALIZED LEARNING PATH */}
          {/* ======================================================== */}
          {activeTab === 'path' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>AI Personalized Learning Path</Text>
                <Text style={styles.sectionSubtitle}>Your tailored journey from portfolio holdings</Text>
              </View>

              {/* PROFILE CARD */}
              <View style={styles.profileCard}>
                <Text style={styles.profileCardTitle}>Your Investment Profile</Text>
                <View style={styles.profileGrid}>
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatLabel}>Age</Text>
                    <Text style={styles.profileStatVal}>25 Years</Text>
                  </View>
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatLabel}>Monthly Income</Text>
                    <Text style={styles.profileStatVal}>₹80,000/mo</Text>
                  </View>
                  <View style={styles.profileStat}>
                    <Text style={styles.profileStatLabel}>Current Risk</Text>
                    <Text style={styles.profileStatVal}>80% Equity</Text>
                  </View>
                </View>
              </View>

              {/* RECOMMENDED PATH TIMELINE */}
              <Text style={styles.pathHeaderTitle}>Your Recommended Path:</Text>
              <View style={styles.timelineContainer}>
                {/* STEP 1 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconWrap, styles.iconDone]}>
                    <CheckCircle2 color="#16a34a" size={18} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStepTitle}>1. ✅ Basics of Mutual Funds</Text>
                    <Text style={styles.timelineStepSub}>Completed • Earned Fund Explorer Badge</Text>
                  </View>
                </View>

                {/* STEP 2 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconWrap, styles.iconActive]}>
                    <Flame color="#dc2626" size={18} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStepTitle}>2. 🔥 Why diversify beyond stocks?</Text>
                    <Text style={styles.timelineStepSub}>In Progress (70%) • 3 mins left</Text>
                    <TouchableOpacity style={styles.continuePathBtn} onPress={() => setActiveTab('tutor')}>
                      <Text style={styles.continuePathBtnText}>Continue Lesson →</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* STEP 3 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconWrap, styles.iconUpNext]}>
                    <BookOpen color="#1b3a6b" size={18} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStepTitle}>3. 📚 REITs explained</Text>
                    <Text style={styles.timelineStepSub}>Passive income from commercial real estate</Text>
                  </View>
                </View>

                {/* STEP 4 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconWrap, styles.iconLocked]}>
                    <Landmark color="#94a3b8" size={18} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStepTitle}>4. 📊 Understanding Bonds</Text>
                    <Text style={styles.timelineStepSub}>Fixed income investing & yield metrics</Text>
                  </View>
                </View>

                {/* STEP 5 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconWrap, styles.iconLocked]}>
                    <Award color="#94a3b8" size={18} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStepTitle}>5. 🎯 Build your first balanced portfolio</Text>
                    <Text style={styles.timelineStepSub}>Final certification for investment readiness</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* TAB 4: INTERACTIVE SIMULATORS */}
          {/* ======================================================== */}
          {activeTab === 'simulators' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Interactive Financial Simulators</Text>
                <Text style={styles.sectionSubtitle}>Test your compounding & bond yields live</Text>
              </View>

              {/* SIP SIMULATOR CARD */}
              <View style={styles.simulatorCard}>
                <View style={styles.simCardHeader}>
                  <TrendingUp color="#16a34a" size={20} />
                  <Text style={styles.simCardTitle}>SIP Simulator (Monthly Investment)</Text>
                </View>

                <View style={styles.simInputGroup}>
                  <View style={styles.simLabelRow}>
                    <Text style={styles.simLabel}>Monthly Investment:</Text>
                    <Text style={styles.simValue}>₹{sipMonthly.toLocaleString()}</Text>
                  </View>
                  <View style={styles.presetButtonsRow}>
                    {[1000, 5000, 10000, 25000].map((amt) => (
                      <TouchableOpacity
                        key={amt}
                        style={[styles.presetBtn, sipMonthly === amt && styles.presetBtnActive]}
                        onPress={() => setSipMonthly(amt)}
                      >
                        <Text style={[styles.presetBtnText, sipMonthly === amt && styles.presetBtnTextActive]}>
                          ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.simInputGroup}>
                  <View style={styles.simLabelRow}>
                    <Text style={styles.simLabel}>Duration (Years):</Text>
                    <Text style={styles.simValue}>{sipYears} Years</Text>
                  </View>
                  <View style={styles.presetButtonsRow}>
                    {[3, 5, 10, 15, 20].map((yrs) => (
                      <TouchableOpacity
                        key={yrs}
                        style={[styles.presetBtn, sipYears === yrs && styles.presetBtnActive]}
                        onPress={() => setSipYears(yrs)}
                      >
                        <Text style={[styles.presetBtnText, sipYears === yrs && styles.presetBtnTextActive]}>
                          {yrs} yrs
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.simInputGroup}>
                  <View style={styles.simLabelRow}>
                    <Text style={styles.simLabel}>Expected Return (% p.a.):</Text>
                    <Text style={styles.simValue}>{sipReturnRate}%</Text>
                  </View>
                  <View style={styles.presetButtonsRow}>
                    {[8, 10, 12, 15].map((rate) => (
                      <TouchableOpacity
                        key={rate}
                        style={[styles.presetBtn, sipReturnRate === rate && styles.presetBtnActive]}
                        onPress={() => setSipReturnRate(rate)}
                      >
                        <Text style={[styles.presetBtnText, sipReturnRate === rate && styles.presetBtnTextActive]}>
                          {rate}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* RESULT DISPLAY */}
                <View style={styles.simResultBox}>
                  <Text style={styles.simResultLabel}>Your Projected Future Wealth:</Text>
                  <Text style={styles.simResultMain}>₹{(sipResults.futureVal / 100000).toFixed(1)} Lakhs</Text>
                  <View style={styles.simResultSplit}>
                    <Text style={styles.simResultSub}>Invested: ₹{(sipResults.investedVal / 100000).toFixed(1)} L</Text>
                    <Text style={styles.simResultSubGain}>Gains: +₹{(sipResults.wealthGain / 100000).toFixed(1)} L</Text>
                  </View>
                </View>
              </View>

              {/* BOND YIELD SIMULATOR CARD */}
              <View style={styles.simulatorCard}>
                <View style={styles.simCardHeader}>
                  <Landmark color="#d97706" size={20} />
                  <Text style={styles.simCardTitle}>Bond Yield Simulator</Text>
                </View>

                <View style={styles.simInputGroup}>
                  <View style={styles.simLabelRow}>
                    <Text style={styles.simLabel}>Bond Investment Amount:</Text>
                    <Text style={styles.simValue}>₹{bondInvestment.toLocaleString()}</Text>
                  </View>
                  <View style={styles.presetButtonsRow}>
                    {[50000, 100000, 500000].map((amt) => (
                      <TouchableOpacity
                        key={amt}
                        style={[styles.presetBtn, bondInvestment === amt && styles.presetBtnActive]}
                        onPress={() => setBondInvestment(amt)}
                      >
                        <Text style={[styles.presetBtnText, bondInvestment === amt && styles.presetBtnTextActive]}>
                          ₹{amt / 1000}k
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.simInputGroup}>
                  <View style={styles.simLabelRow}>
                    <Text style={styles.simLabel}>Fixed Yield / Coupon Rate:</Text>
                    <Text style={styles.simValue}>{bondYield}% p.a.</Text>
                  </View>
                  <View style={styles.presetButtonsRow}>
                    {[7, 8, 9, 10].map((y) => (
                      <TouchableOpacity
                        key={y}
                        style={[styles.presetBtn, bondYield === y && styles.presetBtnActive]}
                        onPress={() => setBondYield(y)}
                      >
                        <Text style={[styles.presetBtnText, bondYield === y && styles.presetBtnTextActive]}>
                          {y}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.simResultBoxAmber}>
                  <Text style={styles.simResultLabel}>You Receive Guaranteed Interest:</Text>
                  <Text style={styles.simResultMainAmber}>₹{bondResults.annualPayout.toLocaleString()} / year</Text>
                  <Text style={styles.simResultSubAmber}>(₹{bondResults.monthlyPayout.toLocaleString()} / month fixed income)</Text>
                </View>
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SMART CHECKPOINTS (DECISION SUPPORT ENGINE) */}
          {/* ======================================================== */}
          {activeTab === 'readiness' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Smart Checkpoints ⭐ (Decision Support)</Text>
                <Text style={styles.sectionSubtitle}>
                  "Dhan Gyaan doesn't teach investors after mistakes; it educates them at the moment of decision."
                </Text>
              </View>

              <View style={styles.readinessCard}>
                <View style={styles.readinessHeaderRow}>
                  <ShieldCheck color="#16a34a" size={24} />
                  <View>
                    <Text style={styles.readinessAssetTitle}>Decision Checkpoint: Nexus Select REIT</Text>
                    <Text style={styles.readinessAssetSub}>Target Asset: Real Estate Investment Trust (Yield: 6.2%)</Text>
                  </View>
                </View>

                <Text style={styles.readinessPrompt}>
                  Instead of 10-minute boring videos, Dhan Gyaan runs 30-second decision checks when you click "Invest Now":
                </Text>

                {readinessChecklist.map((item) => (
                  <View key={item.id} style={styles.checkItemRow}>
                    <TouchableOpacity
                      onPress={() =>
                        setReadinessChecklist((prev) =>
                          prev.map((c) => (c.id === item.id ? { ...c, checked: !c.checked } : c))
                        )
                      }
                    >
                      <CheckCircle2 color={item.checked ? '#16a34a' : '#cbd5e1'} size={20} />
                    </TouchableOpacity>
                    <Text style={[styles.checkItemText, item.checked && styles.checkItemTextChecked]}>
                      {item.title}
                    </Text>
                  </View>
                ))}

                <View style={styles.fastGuideBox}>
                  <Sparkles color="#1b3a6b" size={16} />
                  <View style={styles.fastGuideTextWrap}>
                    <Text style={styles.fastGuideTitle}>Behavioral Feedback Loop</Text>
                    <Text style={styles.fastGuideSub}>
                      Your understanding score (85%) automatically feeds back into Dhan Gyaan to personalize your future learning journey!
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.continueInvestBtn}
                  onPress={() => setCertificationCompleted(true)}
                >
                  <Text style={styles.continueInvestBtnText}>
                    {certificationCompleted ? '✓ Understanding Verified! Proceed to Invest via Dhan Marg →' : 'Run 30-Second Smart Checkpoint →'}
                  </Text>
                </TouchableOpacity>

                {certificationCompleted && (
                  <View style={styles.certifiedSuccessBox}>
                    <CheckCircle2 color="#16a34a" size={18} />
                    <Text style={styles.certifiedSuccessText}>
                      SEBI Understanding Score: 85%. You may now safely execute order in Dhan Marg.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          </View>
        </ScrollView>

        {/* QUIZ MODAL */}
        <Modal visible={showQuiz} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Quick Knowledge Check 🧠</Text>
                <TouchableOpacity onPress={() => setShowQuiz(false)}>
                  <X color="#64748b" size={20} />
                </TouchableOpacity>
              </View>

              <Text style={styles.quizQuestion}>
                Question: What is the main benefit of investing in a REIT compared to buying physical property?
              </Text>

              <TouchableOpacity
                style={styles.quizOption}
                onPress={() => handleQuizAnswer(0)}
              >
                <Text style={styles.quizOptionText}>A) It guarantees double your capital in 30 days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quizOption, quizAnswered && quizScore === 100 && styles.quizOptionCorrect]}
                onPress={() => handleQuizAnswer(1)}
              >
                <Text style={styles.quizOptionText}>
                  B) Low entry capital (₹5,000) & proportional rental yield without maintenance hassle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quizOption}
                onPress={() => handleQuizAnswer(2)}
              >
                <Text style={styles.quizOptionText}>C) It is exempt from all SEBI regulations</Text>
              </TouchableOpacity>

              {quizAnswered && (
                <View style={styles.quizResultBox}>
                  <Text style={styles.quizResultTitle}>
                    {quizScore === 100 ? '🎉 Correct! Understanding Verified!' : '❌ Try again!'}
                  </Text>
                  <TouchableOpacity style={styles.closeQuizBtn} onPress={() => setShowQuiz(false)}>
                    <Text style={styles.closeQuizBtnText}>Close Checkpoint</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* USER PROFILE MODAL */}
        <Modal
          visible={profileModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.profileAvatarLarge}>
                    <User color="#1b3a6b" size={22} />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.profileModalTitle}>Arnam Chaurasiya</Text>
                    <View style={styles.verifiedBadgeRow}>
                      <CheckCircle2 color="#16a34a" size={12} />
                      <Text style={styles.verifiedBadgeText}>SEBI DPI Verified Investor</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.modalCloseBtn}>
                  <X color="#64748b" size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileDetailsContainer}>
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>DPI Handle ID</Text>
                  <Text style={styles.profileDetailVal}>DPI-2026-88910</Text>
                </View>

                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>Account Aggregator</Text>
                  <View style={styles.activePillGreen}>
                    <CheckCircle2 color="#16a34a" size={12} />
                    <Text style={styles.activePillGreenText}>Sahamati AA Active</Text>
                  </View>
                </View>

                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>eKYC Status</Text>
                  <View style={styles.activePillGreen}>
                    <ShieldCheck color="#16a34a" size={12} />
                    <Text style={styles.activePillGreenText}>SEBI KRA Verified</Text>
                  </View>
                </View>

                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>Investor Risk Profile</Text>
                  <Text style={styles.profileDetailVal}>Aggressive Growth (85/100)</Text>
                </View>

                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>Linked FIP Accounts</Text>
                  <Text style={styles.profileDetailVal}>Zerodha, CAMS, RBI Direct</Text>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.profileModalActions}>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={() => {
                    setProfileModalVisible(false);
                    if (navigation) {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                      });
                    }
                  }}
                >
                  <LogOut color="#dc2626" size={16} />
                  <Text style={styles.logoutBtnText}>Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeProfileBtn}
                  onPress={() => setProfileModalVisible(false)}
                >
                  <Text style={styles.closeProfileBtnText}>Close Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* TOPIC LESSON DETAIL MODAL (Matching attached UI) */}
        <Modal
          visible={!!selectedTopicKey}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setSelectedTopicKey(null)}
        >
          {(() => {
            if (!selectedTopicKey) return null;
            const topic = TOPICS_DATA[selectedTopicKey] || TOPICS_DATA['What is REIT?'];

            return (
              <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <StatusBar barStyle="dark-content" />
                
                {/* Top Navigation Bar */}
                <View style={styles.topicNavHeader}>
                  <TouchableOpacity onPress={() => setSelectedTopicKey(null)} style={styles.topicNavBtn}>
                    <ArrowLeft color="#0f172a" size={22} />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)} style={styles.topicNavBtn}>
                      <Bookmark color={isBookmarked ? '#2563eb' : '#0f172a'} fill={isBookmarked ? '#2563eb' : 'none'} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topicNavBtn}>
                      <Share2 color="#0f172a" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                  {/* Topic Title & Badges */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <Text style={styles.topicTitleText}>{topic.title}</Text>
                    <View style={styles.topicReadBadge}>
                      <Text style={styles.topicReadBadgeText}>{topic.readTime}</Text>
                    </View>
                  </View>

                  <Text style={styles.topicSubtitleText}>{topic.subtitle}</Text>

                  {/* Multilingual Selector */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
                    {['English', 'हिंदी', 'मराठी', 'தமிழ்', 'বাংলা', 'More ∨'].map((lang) => (
                      <TouchableOpacity
                        key={lang}
                        style={[styles.topicLangChip, topicLang === lang && styles.topicLangChipActive]}
                        onPress={() => setTopicLang(lang)}
                      >
                        <Text style={[styles.topicLangText, topicLang === lang && styles.topicLangTextActive]}>
                          {lang}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Banner Graphic / Video Preview */}
                  <View style={styles.topicVideoPreview}>
                    <Svg width="100%" height={160} viewBox="0 0 340 160">
                      <Rect width="340" height="160" rx="16" fill="#bfdbfe" />
                      {/* Skyline */}
                      <Path d="M 20 160 L 20 80 L 50 80 L 50 160 Z" fill="#93c5fd" />
                      <Path d="M 60 160 L 60 50 L 100 50 L 100 160 Z" fill="#3b82f6" />
                      <Path d="M 110 160 L 110 90 L 140 90 L 140 160 Z" fill="#60a5fa" />
                      <Path d="M 150 160 L 150 40 L 190 40 L 190 160 Z" fill="#1d4ed8" />
                      <Path d="M 200 160 L 200 70 L 240 70 L 240 160 Z" fill="#2563eb" />
                      <Path d="M 250 160 L 250 85 L 290 85 L 290 160 Z" fill="#93c5fd" />
                      <Path d="M 0 145 C 100 135, 240 155, 340 140 L 340 160 L 0 160 Z" fill="#15803d" opacity={0.7} />
                    </Svg>
                    <View style={styles.topicPlayOverlay}>
                      <View style={styles.topicPlayCircleBtn}>
                        <Play color="#1e293b" size={24} fill="#ffffff" style={{ marginLeft: 3 }} />
                      </View>
                    </View>
                  </View>

                  {/* Key Takeaways Card */}
                  <Text style={styles.topicSectionHeader}>Key Takeaways</Text>
                  <View style={styles.keyTakeawaysCard}>
                    {topic.takeaways.map((item: string, idx: number) => (
                      <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        <CheckCircle2 color="#2563eb" size={18} style={{ marginTop: 2 }} />
                        <Text style={styles.takeawayText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* How It Works Flow */}
                  <Text style={styles.topicSectionHeader}>How {topic.title.replace('What is ', '')}s Work?</Text>
                  <View style={styles.flowStepsRow}>
                    {topic.steps.map((step: any, idx: number) => (
                      <React.Fragment key={idx}>
                        <View style={styles.flowNodeCol}>
                          <View style={styles.flowCircleIcon}>
                            {step.iconType === 'building' && <Building2 color="#1d4ed8" size={20} />}
                            {step.iconType === 'coin' && <Coins color="#d97706" size={20} fill="#fef08a" />}
                            {step.iconType === 'people' && <Users color="#4338ca" size={20} />}
                            {step.iconType === 'chart' && <BarChart3 color="#059669" size={20} />}
                          </View>
                          <Text style={styles.flowNodeText}>{step.label}</Text>
                        </View>
                        {idx < topic.steps.length - 1 && (
                          <Text style={{ fontSize: 16, color: '#94a3b8', fontWeight: 'bold', marginTop: 14 }}>→</Text>
                        )}
                      </React.Fragment>
                    ))}
                  </View>

                  {/* Example Card */}
                  <View style={styles.topicExampleCard}>
                    <Text style={styles.topicExampleTag}>Example</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <View style={styles.exampleThumbBox}>
                        <Building2 color="#0284c7" size={28} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exampleDescText}>{topic.example.desc}</Text>
                        <TouchableOpacity style={{ marginTop: 4 }}>
                          <Text style={styles.exampleLinkText}>{topic.example.linkText}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Is It Right For You? */}
                  <Text style={styles.topicSectionHeader}>Is it Right for You?</Text>
                  <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                    {topic.title.replace('What is ', '')}s may be suitable if:
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, gap: 10, paddingRight: 10 }}>
                      {topic.suitability.map((item: string, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 color="#10b981" size={18} />
                          <Text style={styles.suitabilityText}>{item}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Target Graphic */}
                    <View style={styles.targetGraphicBox}>
                      <Svg width={75} height={75} viewBox="0 0 80 80">
                        <Circle cx="40" cy="40" r="36" fill="#dbeafe" />
                        <Circle cx="40" cy="40" r="28" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
                        <Circle cx="40" cy="40" r="20" fill="#dbeafe" />
                        <Circle cx="40" cy="40" r="12" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
                        <Circle cx="40" cy="40" r="5" fill="#1e3a8a" />
                        {/* Arrow */}
                        <Path d="M 62 18 L 42 38" stroke="#1e293b" strokeWidth="3" />
                        <Path d="M 66 14 L 62 18 L 68 22 Z" fill="#1e293b" />
                      </Svg>
                    </View>
                  </View>

                  {/* Risks to Know Card */}
                  <View style={styles.topicRisksCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <AlertTriangle color="#d97706" size={18} />
                      <Text style={styles.topicRisksTitle}>Risks to Know</Text>
                    </View>

                    {topic.risks.map((risk: string, idx: number) => (
                      <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                        <Text style={{ color: '#b45309', fontSize: 12 }}>•</Text>
                        <Text style={styles.riskText}>{risk}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Bottom Action / Sticky Bar */}
                <View style={styles.topicStickyBottomBar}>
                  <TouchableOpacity
                    style={[styles.topicHelpfulBtn, isHelpfulClicked && styles.topicHelpfulBtnActive]}
                    onPress={() => {
                      setIsHelpfulClicked(!isHelpfulClicked);
                      setHelpfulCount(prev => isHelpfulClicked ? prev - 1 : prev + 1);
                    }}
                  >
                    <ThumbsUp color={isHelpfulClicked ? '#1d4ed8' : '#475569'} size={16} />
                    <Text style={[styles.topicHelpfulText, isHelpfulClicked && styles.topicHelpfulTextActive]}>
                      Helpful ({helpfulCount})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.topicNextBtn}
                    onPress={() => {
                      if (topic.nextTopicKey) {
                        setSelectedTopicKey(topic.nextTopicKey);
                        setIsHelpfulClicked(false);
                      }
                    }}
                  >
                    <Text style={styles.topicNextBtnText}>{topic.nextTopicTitle} →</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            );
          })()}
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* SUB-SCREENS 1 - 8 STYLES */
  subHeaderNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 4,
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  statSummaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  allFilterChip: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  allFilterChipActive: {
    backgroundColor: '#1b3a6b',
    borderColor: '#1b3a6b',
  },
  allFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  allFilterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 14,
    height: 44,
  },
  searchInputField: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    paddingHorizontal: 8,
  },
  filterIconBtn: {
    padding: 10,
  },
  listSectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 10,
  },
  topicListItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  topicListThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  topicListSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  topicListTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 3,
  },
  pctBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: '#bfdbfe',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  },
  emptyCircleIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderColor: '#cbd5e1',
    borderWidth: 2,
  },
  blueTagBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  blueTagText: {
    color: '#1d4ed8',
    fontSize: 10,
    fontWeight: '700',
  },
  interactiveStepperTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  interactiveStepperFill: {
    height: '100%',
    backgroundColor: '#1d4ed8',
    borderRadius: 3,
  },
  interactiveGraphicCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
  },
  stepTitleHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  stepDescBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  examplePropLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  examplePropCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  examplePropIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  examplePropTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  didYouKnowBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  didYouKnowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46',
  },
  didYouKnowText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  stepBackBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  stepBackText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 13,
  },
  stepNextBtn: {
    flex: 2,
    backgroundColor: '#1b3a6b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  stepNextText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  quizGoalQuestion: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 6,
  },
  quizGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  quizGoalCardActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  quizGoalIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quizGoalLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  quizGoalLabelActive: {
    fontWeight: '800',
    color: '#065f46',
  },
  radioEmptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderColor: '#cbd5e1',
    borderWidth: 2,
  },
  infoNoticeCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e0f2fe',
    borderColor: '#bae6fd',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  infoNoticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  suitabilityContinueBtn: {
    backgroundColor: '#1b3a6b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  suitabilityContinueText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  resultCheckBurstBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  matchHeadingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#059669',
    marginTop: 12,
  },
  matchHeadingSub: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginTop: 4,
  },
  whySuitableCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  whySectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  whyPointText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  allocTrackBg: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  allocFillBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 5,
  },
  resultSecondaryBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultSecondaryText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 13,
  },
  resultPrimaryBtn: {
    flex: 1,
    backgroundColor: '#1b3a6b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultPrimaryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  reitMarketCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  reitCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reitThumbIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reitMarketName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  reitTagBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  reitTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  reitPriceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  reitChangeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  reitMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metricLabelText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  metricValBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  assetDetailCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  assetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  assetDetailPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 4,
  },
  assetDetailChange: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  assetAboutHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 14,
  },
  assetDescBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginTop: 4,
  },
  threeMetricsBox: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    justifyContent: 'space-between',
  },
  metricColThree: {
    alignItems: 'center',
    flex: 1,
  },
  metricColLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  metricColValGreen: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  investFormTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 18,
  },
  investTypeToggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
    marginTop: 8,
  },
  typeToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  typeToggleBtnActive: {
    backgroundColor: '#ffffff',
  },
  typeToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  typeToggleTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 6,
    height: 48,
  },
  amountInputField: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 6,
  },
  quickAmtChip: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  quickAmtChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  finalInvestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  finalInvestBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  /* TOPIC LESSON DETAIL STYLES */
  topicNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topicNavBtn: {
    padding: 6,
  },
  topicTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  topicReadBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topicReadBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
  topicSubtitleText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    fontWeight: '500',
  },
  topicLangChip: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    marginRight: 8,
  },
  topicLangChipActive: {
    backgroundColor: '#1b3a6b',
    borderColor: '#1b3a6b',
  },
  topicLangText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  topicLangTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  topicVideoPreview: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  topicPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicPlayCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicSectionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 18,
    marginBottom: 10,
  },
  keyTakeawaysCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  takeawayText: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  flowStepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  flowNodeCol: {
    flex: 1,
    alignItems: 'center',
  },
  flowCircleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  flowNodeText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 13,
  },
  topicExampleCard: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
  },
  topicExampleTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065f46',
  },
  exampleThumbBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleDescText: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '500',
    lineHeight: 16,
  },
  exampleLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  suitabilityText: {
    fontSize: 12.5,
    color: '#1e293b',
    fontWeight: '600',
  },
  targetGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicRisksCard: {
    backgroundColor: '#fffbe6',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },
  topicRisksTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350f',
  },
  riskText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
    flex: 1,
    lineHeight: 17,
  },
  topicStickyBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  topicHelpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  topicHelpfulBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  topicHelpfulText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  topicHelpfulTextActive: {
    color: '#1d4ed8',
  },
  topicNextBtn: {
    flex: 1,
    backgroundColor: '#1b3a6b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicNextBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  /* NEW GYAAAN REDESIGN STYLES */
  heroBannerNew: {
    backgroundColor: '#eef2ff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#e0e7ff',
    borderWidth: 1,
  },
  heroBannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e1b4b',
    lineHeight: 28,
  },
  heroBannerSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginTop: 8,
    lineHeight: 18,
  },
  heroBannerIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  rowHeaderLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  progressCardNew: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e2e8f0',
  },
  statNumberBlue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  statLabelSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  progressBarTrackNew: {
    height: 7,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFillNew: {
    height: '100%',
    backgroundColor: '#1d4ed8',
    borderRadius: 4,
  },
  progressSubHint: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  progressPctBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  quickLearnCard: {
    width: 145,
    backgroundColor: '#ffffff',
    borderColor: '#f1f5f9',
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  quickCardIllusBox: {
    height: 85,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#10b981',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  quickCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  quickCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickCardTime: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  continueMintCard: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueThumbBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueMintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#064e3b',
  },
  continueMintSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    fontWeight: '500',
  },
  continueBarTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  continueBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  continueMintPct: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  playTealCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#065f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItemCol: {
    alignItems: 'center',
    width: 68,
  },
  catSquareIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catSquareLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  beforeInvestCard: {
    backgroundColor: '#fffbe6',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  beforeInvestIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beforeInvestTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350f',
  },
  beforeInvestSub: {
    fontSize: 11,
    color: '#92400e',
    marginTop: 2,
    lineHeight: 15,
  },
  exploreNowBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#f59e0b',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  exploreNowBtnText: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '700',
  },
  sebiNewsCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sebiDocIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sebiNewsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  sebiNewsSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  sebiNewsMeta: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 3,
  },
  sebiChevronCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  heroCard: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 22,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  heroBadgeSub: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  userProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  profileNameText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#e2e8f0',
    fontSize: 12,
    marginTop: 4,
  },
  tabBarWrap: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
    zIndex: 10,
    elevation: 4,
  },
  tabBarContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
  },
  tabButtonActive: {
    backgroundColor: '#1b3a6b',
  },
  tabText: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  contentPadding: {
    padding: 16,
  },
  userBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  userGreeting: {
    color: '#1b3a6b',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userSubText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 4,
  },
  badgeStreakRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  streakText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  rewardBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 1,
    maxWidth: '100%',
  },
  rewardBadgeText: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    flexShrink: 1,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#1b3a6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  continueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  continueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf3fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  continueBadgeText: {
    color: '#1b3a6b',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#64748b',
    fontSize: 11,
    marginLeft: 4,
  },
  courseTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseSub: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1b3a6b',
    borderRadius: 4,
  },
  progressPctText: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resumeButton: {
    backgroundColor: '#1b3a6b',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  portfolioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderColor: '#fca5a5',
    borderWidth: 1,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  portfolioTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portfolioTitle: {
    color: '#1b3a6b',
    fontSize: 15,
    fontWeight: 'bold',
  },
  warningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  warningText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  holdingName: {
    color: '#334155',
    fontSize: 13,
  },
  holdingAmount: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  holdingAmountZero: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: 'bold',
  },
  aiInsightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ebf3fa',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  aiInsightText: {
    color: '#1b3a6b',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  recommendLessonsList: {
    marginBottom: 14,
  },
  recommendLessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  recommendLessonText: {
    color: '#1e293b',
    fontSize: 13,
    marginLeft: 8,
  },
  startLearningBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  startLearningBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoryCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catTitle: {
    color: '#1b3a6b',
    fontSize: 13,
    fontWeight: 'bold',
  },
  catSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
  },
  tutorHeader: {
    marginBottom: 16,
  },
  tutorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorTitle: {
    color: '#1b3a6b',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tutorSub: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  langScroll: {
    marginBottom: 8,
  },
  langPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  langPillActive: {
    backgroundColor: '#1b3a6b',
    borderColor: '#1b3a6b',
  },
  langText: {
    color: '#64748b',
    fontSize: 12,
  },
  langTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  quickPromptLabel: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 6,
  },
  quickPromptScroll: {
    marginBottom: 14,
  },
  promptChip: {
    backgroundColor: '#ebf3fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  promptChipText: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: '600',
  },
  chatContainer: {
    minHeight: 220,
    marginBottom: 14,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '88%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1b3a6b',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  userBubbleText: {
    color: '#ffffff',
    fontSize: 13,
  },
  aiBubbleText: {
    color: '#1e293b',
    fontSize: 13,
    lineHeight: 18,
  },
  takeQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  takeQuizBtnText: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 8,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#0f172a',
    fontSize: 13,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  sendButton: {
    backgroundColor: '#1b3a6b',
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileCardTitle: {
    color: '#1b3a6b',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  profileGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatLabel: {
    color: '#64748b',
    fontSize: 11,
  },
  profileStatVal: {
    color: '#1b3a6b',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  pathHeaderTitle: {
    color: '#1b3a6b',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconDone: {
    backgroundColor: '#dcfce7',
  },
  iconActive: {
    backgroundColor: '#fee2e2',
  },
  iconUpNext: {
    backgroundColor: '#eff6ff',
  },
  iconLocked: {
    backgroundColor: '#f1f5f9',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStepTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timelineStepSub: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  continuePathBtn: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  continuePathBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  simulatorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  simCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  simCardTitle: {
    color: '#1b3a6b',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  simInputGroup: {
    marginBottom: 12,
  },
  simLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  simLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  simValue: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  presetButtonsRow: {
    flexDirection: 'row',
  },
  presetBtn: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  presetBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  presetBtnText: {
    color: '#64748b',
    fontSize: 11,
  },
  presetBtnTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  simResultBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  simResultLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  simResultMain: {
    color: '#16a34a',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  simResultSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  simResultSub: {
    color: '#64748b',
    fontSize: 11,
  },
  simResultSubGain: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  simResultBoxAmber: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  simResultMainAmber: {
    color: '#d97706',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  simResultSubAmber: {
    color: '#b45309',
    fontSize: 11,
  },
  readinessCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  readinessHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  readinessAssetTitle: {
    color: '#1b3a6b',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  readinessAssetSub: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 10,
  },
  readinessPrompt: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkItemText: {
    color: '#64748b',
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },
  checkItemTextChecked: {
    color: '#0f172a',
  },
  fastGuideBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf3fa',
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  fastGuideTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  fastGuideTitle: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fastGuideSub: {
    color: '#334155',
    fontSize: 11,
    marginTop: 2,
  },
  continueInvestBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueInvestBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  certifiedSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  certifiedSuccessText: {
    color: '#15803d',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    color: '#1b3a6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizQuestion: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  quizOption: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  quizOptionCorrect: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  quizOptionText: {
    color: '#0f172a',
    fontSize: 13,
  },
  quizResultBox: {
    marginTop: 14,
    alignItems: 'center',
  },
  quizResultTitle: {
    color: '#16a34a',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeQuizBtn: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeQuizBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  profileDetailsContainer: {
    marginVertical: 12,
  },
  profileDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  profileDetailVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  activePillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  activePillGreenText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  profileModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  logoutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fca5a5',
    gap: 6,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeProfileBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b3a6b',
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeProfileBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  profileAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verifiedBadgeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
