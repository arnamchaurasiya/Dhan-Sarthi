import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Landmark,
  Heart,
  Share2,
  ChevronRight,
  Lock,
  Wallet,
  Check,
  HelpCircle,
  PiggyBank,
  GraduationCap,
  Home as HomeIcon,
  Briefcase,
  PieChart,
  RefreshCw,
  Download,
  Sparkles,
  Target,
  User,
} from 'lucide-react-native';

type ScreenState =
  | 'HOME'
  | 'ONBOARDING_GOALS'
  | 'RISK_ASSESSMENT'
  | 'PROFILE_SUMMARY'
  | 'RECOMMENDATIONS'
  | 'PRODUCT_DETAILS'
  | 'SUITABILITY_CHECK'
  | 'SUITABILITY_RESULT'
  | 'CHOOSE_MODE'
  | 'ENTER_AMOUNT'
  | 'ORDER_REVIEW'
  | 'SUCCESS';

interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  risk: string;
  matchScore: number;
  matchLabel: string;
  expectedYield: string;
  minInvest: string;
  minInvestValue: number;
  aum: string;
  occupancy: string;
  about: string;
  highlights: string[];
  icon: any;
}

const PRODUCTS: Product[] = [
  {
    id: 'NEXUS_REIT',
    name: 'Nexus Select Trust',
    category: 'REITs/InvITs',
    type: 'REIT • Office',
    risk: 'Moderate',
    matchScore: 92,
    matchLabel: 'Very High Match',
    expectedYield: '7.2% – 7.8%',
    minInvest: '₹10,430',
    minInvestValue: 10430,
    aum: '₹4,210 Cr',
    occupancy: '94.1%',
    about:
      "Nexus Select Trust owns quality office assets across India's top business districts and generates rental income.",
    highlights: ['Regular rental income', 'SEBI regulated', 'High occupancy assets'],
    icon: Building2,
  },
  {
    id: 'HDFC_BAF',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Equity',
    type: 'Mutual Fund',
    risk: 'Moderate',
    matchScore: 88,
    matchLabel: 'High Match',
    expectedYield: '12% – 14%',
    minInvest: '₹500',
    minInvestValue: 500,
    aum: '₹65,400 Cr',
    occupancy: 'N/A',
    about:
      'Dynamically managed asset allocation fund balancing equity growth and debt stability.',
    highlights: ['Dynamic allocation', 'Tax efficient returns', 'Professional management'],
    icon: TrendingUp,
  },
  {
    id: 'NPS_SCHEME',
    name: 'National Pension System (NPS)',
    category: 'Others',
    type: 'Retirement Fund',
    risk: 'Low to Moderate',
    matchScore: 86,
    matchLabel: 'Strong Match',
    expectedYield: '10% – 12%',
    minInvest: '₹500',
    minInvestValue: 500,
    aum: '₹10,200 Cr',
    occupancy: 'N/A',
    about:
      'Government-sponsored retirement savings scheme providing long-term wealth accumulation.',
    highlights: ['Extra Tax Benefit u/s 80CCD', 'Flexible pension choices', 'Sovereign backed'],
    icon: ShieldCheck,
  },
  {
    id: 'CORP_BOND',
    name: 'Corporate Bond - AAA',
    category: 'Debt',
    type: 'Debt • 3 Year',
    risk: 'Low Risk',
    matchScore: 82,
    matchLabel: 'Good Match',
    expectedYield: '8.1% – 8.5%',
    minInvest: '₹1,00,000',
    minInvestValue: 100000,
    aum: '₹15,000 Cr',
    occupancy: 'N/A',
    about:
      'High-grade AAA rated corporate debt instruments offering steady fixed payout income.',
    highlights: ['AAA Rating safety', 'Predictable returns', '3-year tenure'],
    icon: Landmark,
  },
];

export default function MargScreen() {
  const [screen, setScreen] = useState<ScreenState>('HOME');

  // User Profile State
  const [selectedGoal, setSelectedGoal] = useState<string>('Wealth Creation');
  const [selectedRiskReaction, setSelectedRiskReaction] = useState<string>('I will stay invested');

  // Selection & Transaction State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [productTab, setProductTab] = useState<'Overview' | 'Performance' | 'Risks' | 'Fees'>('Overview');
  const [investmentMode, setInvestmentMode] = useState<'LUMPSUM' | 'SIP' | 'AUTO'>('LUMPSUM');
  const [investAmount, setInvestAmount] = useState<number>(50000);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(true);

  // Helper unit calculation
  const calculatedUnits = Math.max(1, Math.floor(investAmount / 12500));

  // Category filter
  const filteredProducts =
    selectedCategoryFilter === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategoryFilter);

  // Helper for step progress
  const renderProgressBar = (currentStep: number, totalSteps: number = 5) => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressStepText}>Step {currentStep} of {totalSteps}</Text>
        </View>
        <View style={styles.trackBar}>
          <View style={[styles.filledBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>
    );
  };

  // Screen Headers
  const renderHeader = (title: string, showBack: boolean = true, onBack?: () => void, rightAction?: React.ReactNode) => {
    return (
      <View style={styles.navHeader}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (onBack) onBack();
              else handleDefaultBack();
            }}
          >
            <ArrowLeft color="#0f172a" size={22} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text style={styles.navTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.navRightSlot}>{rightAction || <View style={{ width: 24 }} />}</View>
      </View>
    );
  };

  const handleDefaultBack = () => {
    switch (screen) {
      case 'ONBOARDING_GOALS':
        setScreen('HOME');
        break;
      case 'RISK_ASSESSMENT':
        setScreen('ONBOARDING_GOALS');
        break;
      case 'PROFILE_SUMMARY':
        setScreen('RISK_ASSESSMENT');
        break;
      case 'RECOMMENDATIONS':
        setScreen('HOME');
        break;
      case 'PRODUCT_DETAILS':
        setScreen('RECOMMENDATIONS');
        break;
      case 'SUITABILITY_CHECK':
        setScreen('PRODUCT_DETAILS');
        break;
      case 'SUITABILITY_RESULT':
        setScreen('SUITABILITY_CHECK');
        break;
      case 'CHOOSE_MODE':
        setScreen('SUITABILITY_RESULT');
        break;
      case 'ENTER_AMOUNT':
        setScreen('CHOOSE_MODE');
        break;
      case 'ORDER_REVIEW':
        setScreen('ENTER_AMOUNT');
        break;
      case 'SUCCESS':
        setScreen('HOME');
        break;
      default:
        setScreen('HOME');
    }
  };

  /* ======================================================== */
  /* SCREEN 1: DHAN MARG HOME                                  */
  /* ======================================================== */
  const renderScreenHome = () => (
    <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContentHome} showsVerticalScrollIndicator={false}>
      {/* SEBI Saarthi Hero Banner (Dhan Darpan style) */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.badgePill}>
              <ShieldCheck color="#ffffff" size={12} />
              <Text style={styles.heroBadgeText}>SEBI REGISTERED DPI</Text>
            </View>
            <Text style={styles.heroBadgeSub}>• Dhan Marg</Text>
          </View>

          {/* USER PROFILE BUTTON */}
          <TouchableOpacity
            style={styles.userProfileBtn}
            onPress={() => setScreen('ONBOARDING_GOALS')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <User color="#1b3a6b" size={13} />
            </View>
            <Text style={styles.profileNameText}>Arnam</Text>
            <ChevronRight color="rgba(255,255,255,0.7)" size={12} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>Dhan Marg Engine</Text>
        <Text style={styles.heroSub}>Find the right investments & AI-powered suitability recommendations</Text>
      </View>

      <View style={styles.homeContentPadding}>

      {/* Snapshot Card */}
      <View style={styles.snapshotCard}>
        <Text style={styles.snapshotHeaderTitle}>Your Investment Snapshot</Text>
        <View style={styles.snapshotGrid}>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotItemIconRow}>
              <ShieldCheck color="#16a34a" size={16} />
              <Text style={styles.snapshotItemLabel}>Risk Profile</Text>
            </View>
            <Text style={[styles.snapshotItemVal, { color: '#16a34a' }]}>Moderate</Text>
          </View>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotItemIconRow}>
              <Target color="#2563eb" size={16} />
              <Text style={styles.snapshotItemLabel}>Investment Horizon</Text>
            </View>
            <Text style={styles.snapshotItemVal}>5 – 10 Years</Text>
          </View>
        </View>

        <View style={[styles.snapshotGrid, { marginTop: 12 }]}>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotItemIconRow}>
              <Sparkles color="#d97706" size={16} />
              <Text style={styles.snapshotItemLabel}>Primary Goal</Text>
            </View>
            <Text style={styles.snapshotItemVal}>{selectedGoal}</Text>
          </View>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotItemIconRow}>
              <Wallet color="#4f46e5" size={16} />
              <Text style={styles.snapshotItemLabel}>Monthly Investible</Text>
            </View>
            <Text style={styles.snapshotItemVal}>₹25,000</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateProfileLink}
          onPress={() => setScreen('ONBOARDING_GOALS')}
        >
          <RefreshCw color="#2563eb" size={14} style={{ marginRight: 6 }} />
          <Text style={styles.updateProfileLinkText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Actions Prompt */}
      <Text style={styles.sectionHeadingText}>What would you like to do?</Text>

      {/* Action 1 */}
      <TouchableOpacity
        style={styles.actionMenuCard}
        onPress={() => setScreen('ONBOARDING_GOALS')}
      >
        <View style={styles.actionMenuIconWrap}>
          <Sparkles color="#2563eb" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionMenuTitle}>Find suitable investments</Text>
          <Text style={styles.actionMenuSub}>Get AI recommendations</Text>
        </View>
        <ChevronRight color="#64748b" size={20} />
      </TouchableOpacity>

      {/* Action 2 */}
      <TouchableOpacity
        style={styles.actionMenuCard}
        onPress={() => setScreen('RECOMMENDATIONS')}
      >
        <View style={styles.actionMenuIconWrap}>
          <Building2 color="#2563eb" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionMenuTitle}>Explore all products</Text>
          <Text style={styles.actionMenuSub}>Browse all asset classes</Text>
        </View>
        <ChevronRight color="#64748b" size={20} />
      </TouchableOpacity>

      {/* Action 3 */}
      <TouchableOpacity
        style={styles.actionMenuCard}
        onPress={() => setScreen('RECOMMENDATIONS')}
      >
        <View style={styles.actionMenuIconWrap}>
          <PieChart color="#2563eb" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionMenuTitle}>Compare products</Text>
          <Text style={styles.actionMenuSub}>Compare features & returns</Text>
        </View>
        <ChevronRight color="#64748b" size={20} />
      </TouchableOpacity>
      </View>
    </ScrollView>
  );

  /* ======================================================== */
  /* SCREEN 2: SUITABILITY ONBOARDING - GOALS                 */
  /* ======================================================== */
  const renderScreenOnboardingGoals = () => {
    const goals = [
      {
        id: 'Wealth Creation',
        title: 'Wealth Creation',
        desc: 'Grow my money for the future',
        icon: TrendingUp,
      },
      {
        id: 'Passive Income',
        title: 'Passive Income',
        desc: 'Earn regular income',
        icon: PiggyBank,
      },
      {
        id: 'Retirement Planning',
        title: 'Retirement Planning',
        desc: 'Save for a comfortable retirement',
        icon: Briefcase,
      },
      {
        id: "Child's Education",
        title: "Child's Education",
        desc: 'Save for my child\'s future',
        icon: GraduationCap,
      },
      {
        id: 'Buy a Home',
        title: 'Buy a Home',
        desc: 'Save for my dream home',
        icon: HomeIcon,
      },
      {
        id: 'Others',
        title: 'Others',
        desc: 'Other financial goals',
        icon: Target,
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        {renderHeader('Tell us about you')}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerSubCaption}>Help us find what's right for you</Text>

          {renderProgressBar(1, 5)}

          <Text style={styles.onboardQuestionTitle}>What is your primary financial goal?</Text>

          {goals.map((g) => {
            const isSelected = selectedGoal === g.id;
            const IconComp = g.icon;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                onPress={() => setSelectedGoal(g.id)}
              >
                <View style={styles.radioIconWrap}>
                  <IconComp color={isSelected ? '#2563eb' : '#64748b'} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.radioCardTitle, isSelected && styles.radioCardTitleSelected]}>
                    {g.title}
                  </Text>
                  <Text style={styles.radioCardDesc}>{g.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radioCircleOuter,
                    isSelected && styles.radioCircleOuterSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioCircleInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.bottomFixedBar}>
          <TouchableOpacity
            style={styles.primaryNavyBtn}
            onPress={() => setScreen('RISK_ASSESSMENT')}
          >
            <Text style={styles.primaryNavyBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 3: RISK PROFILING                                 */
  /* ======================================================== */
  const renderScreenRiskAssessment = () => {
    const reactions = [
      {
        id: 'I will panic and sell',
        title: 'I will panic and sell',
        desc: 'I prefer to avoid risk',
      },
      {
        id: 'I will be worried',
        title: 'I will be worried',
        desc: 'But I may not sell',
      },
      {
        id: 'I will stay invested',
        title: 'I will stay invested',
        desc: 'I understand ups and downs',
      },
      {
        id: 'I will invest more',
        title: 'I will invest more',
        desc: 'I see it as an opportunity',
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        {renderHeader('Risk Assessment')}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {renderProgressBar(3, 5)}

          <Text style={styles.onboardQuestionTitle}>
            How would you react if your investment value fell by 20% in a short period?
          </Text>

          {reactions.map((r) => {
            const isSelected = selectedRiskReaction === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                onPress={() => setSelectedRiskReaction(r.id)}
              >
                <View
                  style={[
                    styles.radioCircleOuter,
                    isSelected && styles.radioCircleOuterSelected,
                    { marginRight: 12 },
                  ]}
                >
                  {isSelected && <View style={styles.radioCircleInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.radioCardTitle, isSelected && styles.radioCardTitleSelected]}>
                    {r.title}
                  </Text>
                  <Text style={styles.radioCardDesc}>{r.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Educational Callout */}
          <View style={styles.whyAskBox}>
            <View style={styles.whyAskIconWrap}>
              <HelpCircle color="#d97706" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.whyAskTitle}>Why we ask this?</Text>
              <Text style={styles.whyAskText}>
                It helps us understand your comfort with market volatility.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomFixedBar}>
          <TouchableOpacity
            style={styles.primaryNavyBtn}
            onPress={() => setScreen('PROFILE_SUMMARY')}
          >
            <Text style={styles.primaryNavyBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 4: PROFILE SUMMARY                                */
  /* ======================================================== */
  const renderScreenProfileSummary = () => (
    <View style={{ flex: 1 }}>
      {renderHeader('Review Your Profile')}
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* Risk Banner Card */}
        <View style={styles.profileSummaryCard}>
          <View style={styles.summaryBadgeHeader}>
            <View style={styles.summaryBadgeIcon}>
              <ShieldCheck color="#16a34a" size={22} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Your Risk Profile</Text>
              <Text style={styles.summaryRiskVal}>Moderate</Text>
            </View>
          </View>

          {/* Spectrum Bar */}
          <View style={styles.spectrumContainer}>
            <View style={styles.spectrumBar}>
              <View style={[styles.spectrumSegment, { backgroundColor: '#86efac' }]} />
              <View style={[styles.spectrumSegment, { backgroundColor: '#fde047' }]} />
              <View style={[styles.spectrumSegment, { backgroundColor: '#fca5a5' }]} />
              {/* Pointer indicator at Moderate */}
              <View style={styles.spectrumPointer} />
            </View>
            <View style={styles.spectrumLabels}>
              <Text style={styles.spectrumLabelText}>Conservative</Text>
              <Text style={styles.spectrumLabelText}>Aggressive</Text>
            </View>
          </View>

          {/* Key attributes */}
          <View style={styles.summaryDetailsBox}>
            <View style={styles.summaryDetailRow}>
              <Text style={styles.summaryDetailLabel}>Investment Horizon</Text>
              <Text style={styles.summaryDetailVal}>5 – 10 Years</Text>
            </View>
            <View style={styles.summaryDetailRow}>
              <Text style={styles.summaryDetailLabel}>Primary Goal</Text>
              <Text style={styles.summaryDetailVal}>{selectedGoal}</Text>
            </View>
            <View style={styles.summaryDetailRow}>
              <Text style={styles.summaryDetailLabel}>Monthly Investible</Text>
              <Text style={styles.summaryDetailVal}>₹25,000</Text>
            </View>
            <View style={styles.summaryDetailRow}>
              <Text style={styles.summaryDetailLabel}>Experience in Investing</Text>
              <Text style={styles.summaryDetailVal}>Intermediate</Text>
            </View>
            <View style={[styles.summaryDetailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryDetailLabel}>Preferred Liquidity</Text>
              <Text style={styles.summaryDetailVal}>Medium</Text>
            </View>
          </View>
        </View>

        {/* Green Reassurance Callout */}
        <View style={styles.reassuranceBanner}>
          <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reassuranceTitle}>Profile looks good!</Text>
            <Text style={styles.reassuranceSub}>
              You can update anytime in settings.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity
          style={styles.primaryNavyBtn}
          onPress={() => setScreen('RECOMMENDATIONS')}
        >
          <Text style={styles.primaryNavyBtnText}>See Suitable Investments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ======================================================== */
  /* SCREEN 5: RECOMMENDATIONS                                */
  /* ======================================================== */
  const renderScreenRecommendations = () => {
    const filters = ['All', 'Equity', 'Debt', 'REITs/InvITs', 'Others'];

    return (
      <View style={{ flex: 1 }}>
        {renderHeader(
          'Your Suitable Investments',
          true,
          undefined,
          <TouchableOpacity>
            <Heart color="#0f172a" size={20} />
          </TouchableOpacity>
        )}

        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerSubCaption}>Recommended for your profile</Text>

          {/* Horizontal Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterPillScroll}
          >
            {filters.map((f) => {
              const active = selectedCategoryFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => setSelectedCategoryFilter(f)}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* AI Banner */}
          <View style={styles.aiMatchBanner}>
            <Sparkles color="#16a34a" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.aiMatchBannerText}>
              AI Match Score shows how well a product matches your profile
            </Text>
          </View>

          {/* Product Cards */}
          {filteredProducts.map((p) => {
            const IconComp = p.icon;
            return (
              <TouchableOpacity
                key={p.id}
                style={styles.recommendationCard}
                onPress={() => {
                  setSelectedProduct(p);
                  setScreen('PRODUCT_DETAILS');
                }}
              >
                <View style={styles.recCardHeader}>
                  <View style={styles.recIconWrap}>
                    <IconComp color="#1b3a6b" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recProductName}>{p.name}</Text>
                    <Text style={styles.recProductType}>{p.type}</Text>
                  </View>

                  {/* AI Ring Score */}
                  <View style={styles.recScoreRing}>
                    <Text style={styles.recScoreValue}>{p.matchScore}%</Text>
                    <Text style={styles.recScoreTag}>AI Match</Text>
                  </View>
                </View>

                <View style={styles.recMetricsRow}>
                  <View>
                    <Text style={styles.recMetricLabel}>
                      {p.category === 'Equity' ? 'Exp. Return' : 'Expected Yield'}
                    </Text>
                    <Text style={styles.recMetricVal}>{p.expectedYield}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.recMetricLabel}>Min. Investment</Text>
                    <Text style={styles.recMetricVal}>{p.minInvest}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.viewMoreLink}>
            <Text style={styles.viewMoreLinkText}>View more products →</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 6: PRODUCT DETAILS                                */
  /* ======================================================== */
  const renderScreenProductDetails = () => {
    const IconComp = selectedProduct.icon;
    return (
      <View style={{ flex: 1 }}>
        {renderHeader(
          'Product Details',
          true,
          undefined,
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <TouchableOpacity>
              <Share2 color="#0f172a" size={20} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Heart color="#0f172a" size={20} />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {/* Header Asset Card */}
          <View style={styles.productDetailHeaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.recIconWrap}>
                <IconComp color="#1b3a6b" size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.productDetailName}>{selectedProduct.name}</Text>
                <Text style={styles.recProductType}>{selectedProduct.type}</Text>
              </View>

              <View style={styles.recScoreRingBig}>
                <Text style={styles.recScoreValueBig}>{selectedProduct.matchScore}%</Text>
              </View>
            </View>

            {/* Rationale Banner */}
            <View style={styles.veryHighMatchCallout}>
              <Text style={styles.veryHighMatchTitle}>{selectedProduct.matchLabel}</Text>
              <Text style={styles.veryHighMatchSub}>
                This product strongly aligns with your risk profile and goals.
              </Text>
            </View>
          </View>

          {/* Key Highlights Grid */}
          <View style={styles.statsGridCard}>
            <View style={styles.statCell}>
              <Text style={styles.statCellLabel}>Expected Dividend Yield</Text>
              <Text style={styles.statCellVal}>{selectedProduct.expectedYield}</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.statCellLabel}>Min. Investment</Text>
              <Text style={styles.statCellVal}>{selectedProduct.minInvest}</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.statCellLabel}>AUM</Text>
              <Text style={styles.statCellVal}>{selectedProduct.aum}</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.statCellLabel}>Occupancy</Text>
              <Text style={styles.statCellVal}>{selectedProduct.occupancy}</Text>
            </View>
          </View>

          {/* Tabs Bar */}
          <View style={styles.tabsRow}>
            {(['Overview', 'Performance', 'Risks', 'Fees'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, productTab === t && styles.tabBtnActive]}
                onPress={() => setProductTab(t)}
              >
                <Text style={[styles.tabBtnText, productTab === t && styles.tabBtnTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentCard}>
            <Text style={styles.tabContentHeading}>About</Text>
            <Text style={styles.tabContentBody}>{selectedProduct.about}</Text>

            <Text style={[styles.tabContentHeading, { marginTop: 14 }]}>Key Highlights</Text>
            {selectedProduct.highlights.map((h, i) => (
              <View key={i} style={styles.highlightBulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.highlightBulletText}>{h}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.dualBottomBar}>
          <TouchableOpacity style={styles.outlineCompareBtn}>
            <Text style={styles.outlineCompareBtnText}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.greenActionBtn}
            onPress={() => setScreen('SUITABILITY_CHECK')}
          >
            <Text style={styles.greenActionBtnText}>Check Suitability</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 7: SUITABILITY CHECK                              */
  /* ======================================================== */
  const renderScreenSuitabilityCheck = () => {
    const IconComp = selectedProduct.icon;

    return (
      <View style={{ flex: 1 }}>
        {renderHeader('Suitability Check')}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {renderProgressBar(1, 5)}

          <Text style={styles.onboardQuestionTitle}>Let's confirm if this is right for you</Text>

          {/* Selected Product Snippet Card */}
          <View style={styles.snippetCard}>
            <View style={styles.recIconWrap}>
              <IconComp color="#1b3a6b" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.snippetTitle}>{selectedProduct.name}</Text>
              <Text style={styles.snippetSub}>{selectedProduct.type}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.snippetLabel}>Min. Investment</Text>
              <Text style={styles.snippetVal}>{selectedProduct.minInvest}</Text>
            </View>
          </View>

          {/* Why We Recommend Section */}
          <Text style={styles.sectionHeadingText}>Why we recommend this?</Text>

          <View style={styles.checkReasonsList}>
            <View style={styles.checkReasonRow}>
              <CheckCircle2 color="#16a34a" size={18} style={{ marginRight: 10 }} />
              <Text style={styles.checkReasonText}>Matches your Moderate risk profile</Text>
            </View>
            <View style={styles.checkReasonRow}>
              <CheckCircle2 color="#16a34a" size={18} style={{ marginRight: 10 }} />
              <Text style={styles.checkReasonText}>Aligned with {selectedGoal} goal</Text>
            </View>
            <View style={styles.checkReasonRow}>
              <CheckCircle2 color="#16a34a" size={18} style={{ marginRight: 10 }} />
              <Text style={styles.checkReasonText}>Suitable for 5 – 10 years horizon</Text>
            </View>
            <View style={styles.checkReasonRow}>
              <CheckCircle2 color="#16a34a" size={18} style={{ marginRight: 10 }} />
              <Text style={styles.checkReasonText}>Provides regular passive income</Text>
            </View>
          </View>

          <Text style={styles.nextCheckNote}>Next: We'll check a few more things</Text>
        </ScrollView>

        <View style={styles.bottomFixedBar}>
          <TouchableOpacity
            style={styles.primaryNavyBtn}
            onPress={() => setScreen('SUITABILITY_RESULT')}
          >
            <Text style={styles.primaryNavyBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 8: SUITABILITY RESULT                             */
  /* ======================================================== */
  const renderScreenSuitabilityResult = () => (
    <View style={{ flex: 1 }}>
      {renderHeader('Suitability Result')}
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* Celebration Visual Hero */}
        <View style={styles.celebrationHero}>
          <View style={styles.bigCheckCircle}>
            <Check color="#ffffff" size={36} strokeWidth={3} />
          </View>
          <Text style={styles.suitabilitySuccessTitle}>This product is suitable for you!</Text>
          <Text style={styles.suitabilitySuccessSub}>
            You can invest in {selectedProduct.name}.
          </Text>
        </View>

        {/* Recommended Allocation Card */}
        <View style={styles.allocationCard}>
          <Text style={styles.allocationTitle}>Recommended Allocation</Text>
          <Text style={styles.allocationVal}>10% – 15% of your portfolio</Text>

          <Text style={[styles.allocationSubHeading, { marginTop: 12 }]}>Why this allocation?</Text>
          <Text style={styles.allocationText}>
            Based on your profile, this allocation helps balance growth and income with lower risk.
          </Text>

          <Text style={[styles.allocationSubHeading, { marginTop: 12 }]}>
            Potential Role in your portfolio
          </Text>

          <View style={styles.checkReasonRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.checkReasonText}>Provides stable income</Text>
          </View>
          <View style={styles.checkReasonRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.checkReasonText}>Reduces overall portfolio volatility</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity
          style={styles.primaryNavyBtn}
          onPress={() => setScreen('CHOOSE_MODE')}
        >
          <Text style={styles.primaryNavyBtnText}>Proceed to Invest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ======================================================== */
  /* SCREEN 9: CHOOSE INVESTMENT MODE                         */
  /* ======================================================== */
  const renderScreenChooseMode = () => {
    const IconComp = selectedProduct.icon;
    const modes = [
      {
        id: 'LUMPSUM',
        title: 'One-time Investment',
        desc: 'Invest a lump sum amount',
        icon: Wallet,
      },
      {
        id: 'SIP',
        title: 'SIP in REIT',
        desc: 'Invest at regular intervals',
        icon: RefreshCw,
      },
      {
        id: 'AUTO',
        title: 'Auto Invest',
        desc: 'Set rules and automate',
        icon: Sparkles,
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        {renderHeader('Choose Investment Mode')}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {/* Product Snippet */}
          <View style={styles.snippetCard}>
            <View style={styles.recIconWrap}>
              <IconComp color="#1b3a6b" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.snippetTitle}>{selectedProduct.name}</Text>
              <Text style={styles.snippetSub}>{selectedProduct.type}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.snippetLabel}>Min. Investment</Text>
              <Text style={styles.snippetVal}>{selectedProduct.minInvest}</Text>
            </View>
          </View>

          <Text style={styles.onboardQuestionTitle}>How do you want to invest?</Text>

          {modes.map((m) => {
            const isSelected = investmentMode === m.id;
            const ModeIcon = m.icon;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                onPress={() => setInvestmentMode(m.id as any)}
              >
                <View style={styles.radioIconWrap}>
                  <ModeIcon color={isSelected ? '#2563eb' : '#64748b'} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.radioCardTitle, isSelected && styles.radioCardTitleSelected]}>
                    {m.title}
                  </Text>
                  <Text style={styles.radioCardDesc}>{m.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radioCircleOuter,
                    isSelected && styles.radioCircleOuterSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioCircleInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.bottomFixedBar}>
          <TouchableOpacity
            style={styles.primaryNavyBtn}
            onPress={() => setScreen('ENTER_AMOUNT')}
          >
            <Text style={styles.primaryNavyBtnText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 10: ENTER AMOUNT & PAY                            */
  /* ======================================================== */
  const renderScreenEnterAmount = () => {
    const IconComp = selectedProduct.icon;

    return (
      <View style={{ flex: 1 }}>
        {renderHeader('One-time Investment')}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {/* Product Snippet */}
          <View style={styles.snippetCard}>
            <View style={styles.recIconWrap}>
              <IconComp color="#1b3a6b" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.snippetTitle}>{selectedProduct.name}</Text>
              <Text style={styles.snippetSub}>{selectedProduct.type}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.snippetLabel}>Exp. Yield</Text>
              <Text style={styles.snippetVal}>{selectedProduct.expectedYield}</Text>
            </View>
          </View>

          {/* Amount Box */}
          <Text style={styles.fieldLabel}>Investment Amount</Text>
          <View style={styles.amountInputWrap}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInputText}
              keyboardType="numeric"
              value={investAmount ? investAmount.toString() : ''}
              onChangeText={(txt) => {
                const clean = txt.replace(/[^0-9]/g, '');
                setInvestAmount(clean ? parseInt(clean, 10) : 0);
              }}
            />
          </View>

          {/* Quick Pills */}
          <View style={styles.quickPillsRow}>
            {[10000, 25000, 50000].map((add) => (
              <TouchableOpacity
                key={add}
                style={styles.quickPillBtn}
                onPress={() => setInvestAmount((prev) => prev + add)}
              >
                <Text style={styles.quickPillBtnText}>+ ₹{add.toLocaleString('en-IN')}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Method Selector */}
          <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodLeft}>
              <View style={styles.bankIconWrap}>
                <Landmark color="#1b3a6b" size={18} />
              </View>
              <View>
                <Text style={styles.bankNameText}>Linked Bank Account</Text>
                <Text style={styles.bankSubText}>HDFC Bank •••• 1234</Text>
              </View>
            </View>
            <CheckCircle2 color="#16a34a" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPaymentLink}>
            <Text style={styles.addPaymentLinkText}>Add UPI / Bank Account</Text>
            <ChevronRight color="#2563eb" size={16} />
          </TouchableOpacity>

          {/* Allocation calculation note */}
          <View style={styles.unitsEstimateRow}>
            <Text style={styles.unitsEstimateText}>
              You will receive <Text style={{ fontWeight: 'bold' }}>~ {calculatedUnits} Units</Text>
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomFixedBar}>
          <TouchableOpacity
            style={styles.greenActionBtnFull}
            onPress={() => setScreen('ORDER_REVIEW')}
          >
            <Text style={styles.greenActionBtnText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 11: ORDER REVIEW                                  */
  /* ======================================================== */
  const renderScreenOrderReview = () => {
    const IconComp = selectedProduct.icon;

    return (
      <View style={{ flex: 1 }}>
        {renderHeader('Order Review')}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {/* Product Snippet */}
          <View style={styles.snippetCard}>
            <View style={styles.recIconWrap}>
              <IconComp color="#1b3a6b" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.snippetTitle}>{selectedProduct.name}</Text>
              <Text style={styles.snippetSub}>{selectedProduct.type}</Text>
            </View>
          </View>

          {/* Table Details Card */}
          <View style={styles.reviewTableCard}>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Investment Type</Text>
              <Text style={styles.reviewVal}>One-time</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Investment Amount</Text>
              <Text style={styles.reviewVal}>₹{investAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Min. Investment</Text>
              <Text style={styles.reviewVal}>{selectedProduct.minInvest}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Expected Yield</Text>
              <Text style={styles.reviewVal}>{selectedProduct.expectedYield}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Units (Approx.)</Text>
              <Text style={styles.reviewVal}>~ {calculatedUnits}</Text>
            </View>
            <View style={[styles.reviewRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.reviewLabel}>Payment Method</Text>
              <Text style={styles.reviewVal}>HDFC Bank •••• 1234</Text>
            </View>
          </View>

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.termsCheckRow}
            onPress={() => setTermsAgreed(!termsAgreed)}
          >
            <View style={[styles.checkboxOuter, termsAgreed && styles.checkboxOuterChecked]}>
              {termsAgreed && <Check color="#ffffff" size={14} strokeWidth={3} />}
            </View>
            <Text style={styles.termsCheckText}>
              I have read and agree to the <Text style={{ color: '#2563eb' }}>terms & conditions</Text>{' '}
              and product related documents.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomFixedBar}>
          <TouchableOpacity
            style={[styles.greenActionBtnFull, !termsAgreed && { opacity: 0.6 }]}
            disabled={!termsAgreed}
            onPress={() => setScreen('SUCCESS')}
          >
            <Lock color="#ffffff" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.greenActionBtnText}>Confirm & Invest</Text>
          </TouchableOpacity>
          <View style={styles.secureFooterRow}>
            <Lock color="#64748b" size={12} style={{ marginRight: 4 }} />
            <Text style={styles.secureFooterText}>Your payment is secured</Text>
          </View>
        </View>
      </View>
    );
  };

  /* ======================================================== */
  /* SCREEN 12: SUCCESS & NEXT STEPS                          */
  /* ======================================================== */
  const renderScreenSuccess = () => (
    <View style={{ flex: 1 }}>
      {renderHeader('Investment Successful', false)}
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <View style={styles.celebrationHero}>
          <View style={styles.bigCheckCircle}>
            <Check color="#ffffff" size={40} strokeWidth={3.5} />
          </View>
          <Text style={styles.suitabilitySuccessTitle}>Your investment is successful!</Text>
          <Text style={styles.suitabilitySuccessSub}>You will start earning returns.</Text>
        </View>

        {/* Investment Details Card */}
        <View style={styles.successDetailsCard}>
          <View style={styles.recIconWrap}>
            <Building2 color="#1b3a6b" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.snippetTitle}>{selectedProduct.name}</Text>
            <Text style={styles.snippetSub}>{selectedProduct.type}</Text>
          </View>

          <View style={styles.successMetricsGrid}>
            <View style={styles.successMetricItem}>
              <Text style={styles.successMetricLabel}>Amount Invested</Text>
              <Text style={styles.successMetricVal}>
                ₹{investAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.successMetricItem}>
              <Text style={styles.successMetricLabel}>Units Allotted (Approx.)</Text>
              <Text style={styles.successMetricVal}>{calculatedUnits} Units</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.dhanDarpanLink} onPress={() => setScreen('HOME')}>
          <Text style={styles.dhanDarpanLinkText}>View in Dhan Darpan →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Dual Buttons */}
      <View style={styles.dualBottomBar}>
        <TouchableOpacity style={styles.outlineDownloadBtn}>
          <Download color="#0f172a" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.outlineCompareBtnText}>Download Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryNavyBtnFlex}
          onPress={() => setScreen('HOME')}
        >
          <Text style={styles.primaryNavyBtnText}>Go to Portfolio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {screen === 'HOME' && renderScreenHome()}
        {screen === 'ONBOARDING_GOALS' && renderScreenOnboardingGoals()}
        {screen === 'RISK_ASSESSMENT' && renderScreenRiskAssessment()}
        {screen === 'PROFILE_SUMMARY' && renderScreenProfileSummary()}
        {screen === 'RECOMMENDATIONS' && renderScreenRecommendations()}
        {screen === 'PRODUCT_DETAILS' && renderScreenProductDetails()}
        {screen === 'SUITABILITY_CHECK' && renderScreenSuitabilityCheck()}
        {screen === 'SUITABILITY_RESULT' && renderScreenSuitabilityResult()}
        {screen === 'CHOOSE_MODE' && renderScreenChooseMode()}
        {screen === 'ENTER_AMOUNT' && renderScreenEnterAmount()}
        {screen === 'ORDER_REVIEW' && renderScreenOrderReview()}
        {screen === 'SUCCESS' && renderScreenSuccess()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  navHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', flex: 1, textAlign: 'center' },
  navRightSlot: { minWidth: 36, alignItems: 'flex-end' },
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  scrollContentHome: { paddingBottom: 110 },
  homeContentPadding: { padding: 16 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  /* Blue Hero Header Card (Dhan Darpan style) */
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
    marginBottom: 16,
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
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  /* Progress Bar */
  progressContainer: { marginBottom: 18 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressStepText: { color: '#2563eb', fontSize: 12, fontWeight: '600' },
  trackBar: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' },
  filledBar: { height: '100%', backgroundColor: '#2563eb', borderRadius: 3 },

  /* Dhan Marg Home */
  homeHeaderCard: { marginTop: 4, marginBottom: 16 },
  homeBrandTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  homeBrandSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  snapshotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  snapshotHeaderTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  snapshotGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  snapshotItem: { flex: 1 },
  snapshotItemIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  snapshotItemLabel: { fontSize: 11, color: '#64748b', fontWeight: '500', marginLeft: 4 },
  snapshotItemVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  updateProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  updateProfileLinkText: { color: '#2563eb', fontSize: 13, fontWeight: 'bold' },
  sectionHeadingText: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },

  actionMenuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  actionMenuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionMenuTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  actionMenuSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

  /* Radio & Cards */
  onboardQuestionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  radioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  radioCardSelected: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  radioIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  radioCardTitleSelected: { color: '#16a34a', fontWeight: 'bold' },
  radioCardDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  radioCircleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleOuterSelected: { borderColor: '#16a34a' },
  radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a' },

  whyAskBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 8,
  },
  whyAskIconWrap: { marginRight: 10, marginTop: 2 },
  whyAskTitle: { fontSize: 13, fontWeight: 'bold', color: '#b45309' },
  whyAskText: { fontSize: 12, color: '#92400e', marginTop: 2, lineHeight: 16 },

  /* Profile Summary */
  profileSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  summaryBadgeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  summaryBadgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryLabel: { fontSize: 12, color: '#64748b' },
  summaryRiskVal: { fontSize: 20, fontWeight: 'bold', color: '#16a34a' },

  spectrumContainer: { marginBottom: 16 },
  spectrumBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'visible',
    position: 'relative',
  },
  spectrumSegment: { flex: 1, height: '100%', borderRadius: 2 },
  spectrumPointer: {
    position: 'absolute',
    left: '50%',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1b3a6b',
    borderWidth: 3,
    borderColor: '#ffffff',
    marginLeft: -8,
  },
  spectrumLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  spectrumLabelText: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },

  summaryDetailsBox: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  summaryDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  summaryDetailLabel: { fontSize: 13, color: '#64748b' },
  summaryDetailVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },

  reassuranceBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  reassuranceTitle: { fontSize: 14, fontWeight: 'bold', color: '#15803d' },
  reassuranceSub: { fontSize: 12, color: '#166534', marginTop: 2 },

  /* Recommendations */
  filterPillScroll: { marginBottom: 14 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  filterPillActive: { backgroundColor: '#1b3a6b', borderColor: '#1b3a6b' },
  filterPillText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  filterPillTextActive: { color: '#ffffff' },

  aiMatchBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 14,
  },
  aiMatchBannerText: { fontSize: 11.5, color: '#166534', fontWeight: '600', flex: 1 },

  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  recCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recProductName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  recProductType: { fontSize: 12, color: '#64748b', marginTop: 2 },
  recScoreRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
  },
  recScoreValue: { fontSize: 12, fontWeight: 'bold', color: '#16a34a' },
  recScoreTag: { fontSize: 7, color: '#16a34a', fontWeight: 'bold' },

  recMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
  },
  recMetricLabel: { fontSize: 11, color: '#64748b' },
  recMetricVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  viewMoreLink: { alignItems: 'center', paddingVertical: 12 },
  viewMoreLinkText: { color: '#2563eb', fontSize: 14, fontWeight: 'bold' },

  /* Product Details */
  productDetailHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  productDetailName: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  recScoreRingBig: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    borderColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
  },
  recScoreValueBig: { fontSize: 15, fontWeight: 'bold', color: '#16a34a' },
  veryHighMatchCallout: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  veryHighMatchTitle: { fontSize: 13, fontWeight: 'bold', color: '#15803d' },
  veryHighMatchSub: { fontSize: 11.5, color: '#166534', marginTop: 2 },

  statsGridCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  statCell: { width: '50%', paddingVertical: 6, paddingHorizontal: 4 },
  statCellLabel: { fontSize: 11, color: '#64748b' },
  statCellVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginBottom: 14,
  },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#2563eb' },
  tabBtnText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  tabBtnTextActive: { color: '#2563eb', fontWeight: 'bold' },

  tabContentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabContentHeading: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  tabContentBody: { fontSize: 13, color: '#475569', lineHeight: 18 },
  highlightBulletRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563eb', marginRight: 8 },
  highlightBulletText: { fontSize: 12.5, color: '#334155' },

  /* Snippets & Checks */
  snippetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  snippetTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  snippetSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  snippetLabel: { fontSize: 10, color: '#64748b' },
  snippetVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  checkReasonsList: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  checkReasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  checkReasonText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  nextCheckNote: { fontSize: 12, color: '#64748b', fontStyle: 'italic', textAlign: 'center' },

  /* Suitability Result Hero */
  celebrationHero: { alignItems: 'center', marginVertical: 20 },
  bigCheckCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    elevation: 4,
  },
  suitabilitySuccessTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  suitabilitySuccessSub: { fontSize: 13, color: '#64748b', marginTop: 4, textAlign: 'center' },

  allocationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  allocationTitle: { fontSize: 12, color: '#64748b' },
  allocationVal: { fontSize: 18, fontWeight: 'bold', color: '#1b3a6b', marginTop: 2 },
  allocationSubHeading: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  allocationText: { fontSize: 12.5, color: '#475569', lineHeight: 18, marginBottom: 8 },

  /* Enter Amount */
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 12,
  },
  currencySymbol: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginRight: 8 },
  amountInputText: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', flex: 1 },

  quickPillsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickPillBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  quickPillBtnText: { fontSize: 12, fontWeight: 'bold', color: '#2563eb' },

  paymentMethodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    marginBottom: 10,
  },
  paymentMethodLeft: { flexDirection: 'row', alignItems: 'center' },
  bankIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bankNameText: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  bankSubText: { fontSize: 11, color: '#64748b', marginTop: 1 },

  addPaymentLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingVertical: 4 },
  addPaymentLinkText: { fontSize: 12, color: '#2563eb', fontWeight: '600', marginRight: 2 },

  unitsEstimateRow: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  unitsEstimateText: { fontSize: 13, color: '#334155' },

  /* Review Table */
  reviewTableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reviewLabel: { fontSize: 13, color: '#64748b' },
  reviewVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },

  termsCheckRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 4 },
  checkboxOuter: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#64748b',
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOuterChecked: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  termsCheckText: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 16 },

  secureFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  secureFooterText: { fontSize: 11, color: '#64748b' },

  /* Success Screen */
  successDetailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  successMetricsGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    marginTop: 12,
  },
  successMetricItem: { flex: 1 },
  successMetricLabel: { fontSize: 11, color: '#64748b' },
  successMetricVal: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  dhanDarpanLink: { alignItems: 'center', paddingVertical: 10 },
  dhanDarpanLinkText: { fontSize: 14, fontWeight: 'bold', color: '#2563eb' },

  /* Bottom Buttons */
  bottomFixedBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  primaryNavyBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryNavyBtnFlex: {
    flex: 1,
    backgroundColor: '#1b3a6b',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryNavyBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },

  greenActionBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenActionBtnFull: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenActionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },

  dualBottomBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    gap: 12,
  },
  outlineCompareBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  outlineDownloadBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  outlineCompareBtnText: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
});
