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
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {
  BookOpen,
  Star,
  Award,
  ShieldCheck,
  Flame,
  TrendingUp,
  Building2,
  Coins,
  Landmark,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Sparkles,
  Clock,
  X,
} from 'lucide-react-native';

const API_BASE = 'https://dhan-sarthi.onrender.com';

export default function GyaanScreen() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutor' | 'path' | 'simulators' | 'readiness'>('dashboard');

  // User Gamification State
  const [streakDays, setStreakDays] = useState(7);
  const [gyaanCoins, setGyaanCoins] = useState(350);
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
      setGyaanCoins((prev) => prev + 50);
      setActiveBadge('REIT Master');
    }
  };

  const sipResults = calculateSIP();
  const bondResults = calculateBond();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HERO BANNER - SEBI NAVY BLUE */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroTitleWrap}>
              <View style={styles.heroBadgeRow}>
                <Text style={styles.heroBadgeText}>SEBI INVESTOR EDUCATION</Text>
                <Text style={styles.heroBadgeSub}>• Dhan Gyaan</Text>
              </View>
              <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>Financial Awareness Hub</Text>
            </View>
            <View style={styles.coinsBadge}>
              <Coins color="#d97706" size={16} />
              <Text style={styles.coinsText}>{gyaanCoins} Coins</Text>
            </View>
          </View>
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
              style={[styles.tabButton, activeTab === 'path' && styles.tabButtonActive]}
              onPress={() => setActiveTab('path')}
            >
              <TrendingUp color={activeTab === 'path' ? '#ffffff' : '#1b3a6b'} size={14} />
              <Text style={[styles.tabText, activeTab === 'path' && styles.tabTextActive]}>Learning Path</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'simulators' && styles.tabButtonActive]}
              onPress={() => setActiveTab('simulators')}
            >
              <Sliders color={activeTab === 'simulators' ? '#ffffff' : '#1b3a6b'} size={14} />
              <Text style={[styles.tabText, activeTab === 'simulators' && styles.tabTextActive]}>Simulators</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'readiness' && styles.tabButtonActive]}
              onPress={() => setActiveTab('readiness')}
            >
              <ShieldCheck color={activeTab === 'readiness' ? '#ffffff' : '#1b3a6b'} size={14} />
              <Text style={[styles.tabText, activeTab === 'readiness' && styles.tabTextActive]}>Smart Checkpoints ⭐</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD / HOME */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <View>
              {/* USER GREETING & STREAK BANNER */}
              <View style={styles.userBanner}>
                <Text style={styles.userGreeting}>👋 Hi Arnam,</Text>
                <Text style={styles.userSubText}>Based on your portfolio, learn what matters for you.</Text>

                <View style={styles.badgeStreakRow}>
                  <View style={styles.streakPill}>
                    <Flame color="#dc2626" size={16} fill="#dc2626" />
                    <Text style={styles.streakText}>{streakDays} Day Learning Streak</Text>
                  </View>
                  <View style={styles.badgePill}>
                    <Award color="#d97706" size={16} />
                    <Text style={styles.badgeText} numberOfLines={1} ellipsizeMode="tail">{activeBadge}</Text>
                  </View>
                </View>
              </View>

              {/* SECTION 1: CONTINUE LEARNING CARD */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Continue Learning</Text>
              </View>

              <View style={styles.continueCard}>
                <View style={styles.continueHeader}>
                  <View style={styles.continueBadge}>
                    <BookOpen color="#1b3a6b" size={14} />
                    <Text style={styles.continueBadgeText}>Continue Learning</Text>
                  </View>
                  <View style={styles.timerRow}>
                    <Clock color="#64748b" size={14} />
                    <Text style={styles.timerText}>3 mins remaining</Text>
                  </View>
                </View>

                <Text style={styles.courseTitle}>Understanding REITs</Text>
                <Text style={styles.courseSub}>Real Estate Investment Trusts & Commercial Yields</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: '70%' }]} />
                  </View>
                  <Text style={styles.progressPctText}>70%</Text>
                </View>

                <TouchableOpacity style={styles.resumeButton} onPress={() => setActiveTab('tutor')}>
                  <Text style={styles.resumeButtonText}>Resume →</Text>
                </TouchableOpacity>
              </View>

              {/* SECTION 2: EXPLAIN MY PORTFOLIO FEATURE */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explain My Portfolio ⭐</Text>
                <Text style={styles.sectionSubtitle}>Dhan Darpan Analytics + Education Link</Text>
              </View>

              <View style={styles.portfolioCard}>
                <View style={styles.portfolioTopRow}>
                  <Text style={styles.portfolioTitle}>Your Holdings Summary</Text>
                  <View style={styles.warningPill}>
                    <ShieldAlert color="#dc2626" size={12} />
                    <Text style={styles.warningText}>75% Equity Exposure ⚠️</Text>
                  </View>
                </View>

                <View style={styles.holdingItem}>
                  <Text style={styles.holdingName}>Reliance Industries</Text>
                  <Text style={styles.holdingAmount}>₹1,20,000 (Equity)</Text>
                </View>
                <View style={styles.holdingItem}>
                  <Text style={styles.holdingName}>HDFC Mutual Fund</Text>
                  <Text style={styles.holdingAmount}>₹80,000 (Equity)</Text>
                </View>
                <View style={[styles.holdingItem, { borderBottomWidth: 0 }]}>
                  <Text style={styles.holdingName}>Bonds / Fixed Income</Text>
                  <Text style={styles.holdingAmountZero}>₹0 (No Debt Allocation)</Text>
                </View>

                <View style={styles.aiInsightBox}>
                  <Sparkles color="#1b3a6b" size={16} />
                  <Text style={styles.aiInsightText}>
                    AI Analysis: Your portfolio has high concentration risk in Equities without bond cushions. Here is what you should learn:
                  </Text>
                </View>

                <View style={styles.recommendLessonsList}>
                  <TouchableOpacity style={styles.recommendLessonRow} onPress={() => setActiveTab('path')}>
                    <BookOpen color="#1b3a6b" size={14} />
                    <Text style={styles.recommendLessonText}>Why diversification matters</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.recommendLessonRow} onPress={() => setActiveTab('simulators')}>
                    <Landmark color="#16a34a" size={14} />
                    <Text style={styles.recommendLessonText}>Introduction to Bonds</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.recommendLessonRow} onPress={() => setActiveTab('readiness')}>
                    <ShieldCheck color="#d97706" size={14} />
                    <Text style={styles.recommendLessonText}>Understanding Risk & Liquidity</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.startLearningBtn} onPress={() => setActiveTab('path')}>
                  <Text style={styles.startLearningBtnText}>Start Learning →</Text>
                </TouchableOpacity>
              </View>

              {/* SECTION 3: LEARNING CATEGORIES */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore Topics</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('tutor')}>
                  <View style={[styles.catIconWrap, { backgroundColor: '#eff6ff' }]}>
                    <TrendingUp color="#1b3a6b" size={20} />
                  </View>
                  <Text style={styles.catTitle}>📈 Stock Market</Text>
                  <Text style={styles.catSub}>Beginner → Advanced</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('tutor')}>
                  <View style={[styles.catIconWrap, { backgroundColor: '#f3e8ff' }]}>
                    <Building2 color="#7e22ce" size={20} />
                  </View>
                  <Text style={styles.catTitle}>🏢 REITs & InvITs</Text>
                  <Text style={styles.catSub}>Passive income explained</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('tutor')}>
                  <View style={[styles.catIconWrap, { backgroundColor: '#dcfce7' }]}>
                    <Coins color="#16a34a" size={20} />
                  </View>
                  <Text style={styles.catTitle}>💰 Mutual Funds</Text>
                  <Text style={styles.catSub}>SIP, NAV & Expense Ratio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('tutor')}>
                  <View style={[styles.catIconWrap, { backgroundColor: '#fef3c7' }]}>
                    <Landmark color="#d97706" size={20} />
                  </View>
                  <Text style={styles.catTitle}>🏦 Bonds</Text>
                  <Text style={styles.catSub}>Fixed income investing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('tutor')}>
                  <View style={[styles.catIconWrap, { backgroundColor: '#fee2e2' }]}>
                    <ShieldAlert color="#dc2626" size={20} />
                  </View>
                  <Text style={styles.catTitle}>🛡 Investor Safety</Text>
                  <Text style={styles.catSub}>Frauds & scams prevention</Text>
                </TouchableOpacity>
              </ScrollView>
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
                        <Text style={styles.takeQuizBtnText}>Take quick quiz to earn 50 Gyaan Coins</Text>
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
                    {quizScore === 100 ? '🎉 Correct! +50 Gyaan Coins Earned!' : '❌ Try again!'}
                  </Text>
                  <TouchableOpacity style={styles.closeQuizBtn} onPress={() => setShowQuiz(false)}>
                    <Text style={styles.closeQuizBtnText}>Claim Reward & Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 18,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitleWrap: {
    flex: 1,
    marginRight: 10,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  heroBadgeText: {
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  heroBadgeSub: {
    color: '#bfdbfe',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#e2e8f0',
    fontSize: 12,
    marginTop: 4,
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    flexShrink: 0,
  },
  coinsText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  tabBarWrap: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
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
    padding: 16,
    paddingBottom: 110,
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 1,
    maxWidth: '100%',
  },
  badgeText: {
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
});
