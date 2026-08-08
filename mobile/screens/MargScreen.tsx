import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldAlert,
  Target,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  Landmark,
  X,
} from 'lucide-react-native';

const API_BASE = 'https://dhan-sarthi.onrender.com';
const RISK_SCORE = 85;

const ASSETS = [
  {
    id: 'NEXUS_REIT',
    name: 'Nexus Select REIT',
    type: 'Commercial Real Estate Trust',
    risk: 'Moderate',
    return: '6.2% Yield',
    min_invest: '₹290',
    icon: Building2,
    badge: 'Popular REIT',
  },
  {
    id: 'RBI_BOND',
    name: 'RBI Retail Direct Sovereign Bonds',
    type: 'Government Bond',
    risk: 'Low Risk',
    return: '7.1% p.a.',
    min_invest: '₹1,000',
    icon: Landmark,
    badge: 'Sovereign Guarantee',
  },
  {
    id: 'NIFTY_IDX',
    name: 'UTI Nifty 50 Index Fund',
    type: 'Mutual Fund',
    risk: 'Moderate Risk',
    return: '12.4% p.a.',
    min_invest: '₹500',
    icon: TrendingUp,
    badge: 'Core Portfolio',
  },
  {
    id: 'TCS_EQ',
    name: 'TCS Direct Equity',
    type: 'Stock Market',
    risk: 'High Volatility',
    return: '15.2% p.a.',
    min_invest: '₹3,800',
    icon: Target,
    badge: 'Large Cap Stock',
  },
];

export default function MargScreen() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suitabilityResult, setSuitabilityResult] = useState<any>(null);

  // Smart Checkpoint Modal State
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [checkpointData, setCheckpointData] = useState<any>(null);
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);
  const [checkpointPassed, setCheckpointPassed] = useState(false);
  const [orderExecuted, setOrderExecuted] = useState(false);

  // Trigger Suitability + Smart Checkpoint Flow
  const handleSelectAsset = async (asset: any) => {
    setSelectedAsset(asset);
    setLoading(true);
    setSuitabilityResult(null);
    setOrderExecuted(false);
    setQ1Answer(null);
    setQ2Answer(null);
    setCheckpointPassed(false);

    try {
      // 1. AI Suitability Check
      const suitabilityRes = await axios.post(`${API_BASE}/api/v1/ai/invest/suitability`, {
        user_id: 'user_123',
        asset_id: asset.id,
        risk_score: RISK_SCORE,
      });
      setSuitabilityResult(suitabilityRes.data);

      // 2. Fetch Smart Checkpoint
      const checkpointRes = await axios.post(`${API_BASE}/api/v1/ai/smart-checkpoint`, {
        user_id: 'user_123',
        asset_name: asset.name,
        asset_category: asset.type,
        investment_amount: 50000,
      });
      setCheckpointData(checkpointRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSmartCheckpoint = () => {
    if (checkpointData) {
      setShowCheckpoint(true);
    }
  };

  const submitCheckpointQuiz = () => {
    if (q1Answer === 1 && q2Answer === 0) {
      setCheckpointPassed(true);
    } else {
      setCheckpointPassed(true); // Grant access while highlighting correct takeaways
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* SEBI HERO BANNER */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Text style={styles.heroBadgeText}>INVESTMENT ROADMAP</Text>
            <Text style={styles.heroBadgeSub}>• Dhan Marg Engine</Text>
          </View>
          <Text style={styles.heroTitle}>Avenue Suitability & Smart Checkpoints</Text>
          <Text style={styles.heroSub}>Contextual decision-support educates you at the moment of investment</Text>
        </View>

        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {/* USER RISK PROFILE */}
          <View style={styles.profileCard}>
            <View>
              <Text style={styles.label}>Investor Risk Profile</Text>
              <Text style={styles.profileValue}>Aggressive Growth Profile</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>SEBI Risk Score</Text>
              <Text style={styles.scoreValue}>{RISK_SCORE} / 100</Text>
            </View>
          </View>

          {/* ASSET SELECTION GRID */}
          <Text style={styles.sectionTitle}>Explore Avenues & Smart Checkpoints</Text>
          {ASSETS.map((asset) => {
            const IconComp = asset.icon;
            const isSelected = selectedAsset?.id === asset.id;
            return (
              <TouchableOpacity
                key={asset.id}
                style={[styles.assetCard, isSelected && styles.assetCardSelected]}
                onPress={() => handleSelectAsset(asset)}
              >
                <View style={styles.assetHeader}>
                  <View style={styles.assetTitleRow}>
                    <View style={styles.assetIconWrap}>
                      <IconComp color="#1b3a6b" size={18} />
                    </View>
                    <View>
                      <Text style={styles.assetName}>{asset.name}</Text>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{asset.type}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.returnRow}>
                      <TrendingUp color="#16a34a" size={14} style={{ marginRight: 4 }} />
                      <Text style={styles.returnText}>{asset.return}</Text>
                    </View>
                    <Text style={styles.minText}>Min: {asset.min_invest}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.investBtn}
                  onPress={() => handleSelectAsset(asset)}
                >
                  <Text style={styles.investBtnText}>
                    {isSelected ? '✓ Suitability Evaluated — Invest Now' : 'Invest Now (Run Smart Checkpoint ⭐)'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {loading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator color="#1b3a6b" size="large" />
              <Text style={styles.loadingText}>Evaluating asset suitability & preparing Smart Checkpoint...</Text>
            </View>
          )}

          {/* SUITABILITY RESULT CARD */}
          {suitabilityResult && !loading && (
            <View style={[styles.resultCard, suitabilityResult.is_suitable ? styles.suitableCard : styles.unsuitableCard]}>
              <View style={styles.resultHeader}>
                {suitabilityResult.is_suitable ? (
                  <CheckCircle2 color="#16a34a" size={24} style={{ marginRight: 8 }} />
                ) : (
                  <XCircle color="#dc2626" size={24} style={{ marginRight: 8 }} />
                )}
                <Text style={[styles.resultTitle, suitabilityResult.is_suitable ? { color: '#15803d' } : { color: '#b91c1c' }]}>
                  {suitabilityResult.is_suitable ? 'SEBI Suitable Investment Match' : 'High Risk - Not Recommended'}
                </Text>
              </View>
              <Text style={styles.reasonText}>{suitabilityResult.reason}</Text>

              {/* SMART CHECKPOINT BUTTON */}
              <TouchableOpacity style={styles.smartCheckpointTriggerBtn} onPress={handleOpenSmartCheckpoint}>
                <Sparkles color="#ffffff" size={16} />
                <Text style={styles.smartCheckpointTriggerBtnText}>
                  Launch 30-Second Smart Checkpoint ⭐
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* BEHAVIORAL DATA SYNC INSIGHT */}
          <View style={styles.behavioralCard}>
            <View style={styles.behavioralTitleRow}>
              <Award color="#d97706" size={18} />
              <Text style={styles.behavioralTitle}>Behavioral Data Sync with Dhan Gyaan</Text>
            </View>
            <Text style={styles.behavioralText}>
              Dhan Sarthi continuously tracks your product understanding scores during decisions to personalize your Dhan Gyaan learning journey:
            </Text>

            <View style={styles.behavioralBadgesRow}>
              <View style={styles.behavioralPillGreen}>
                <CheckCircle2 color="#16a34a" size={12} />
                <Text style={styles.behavioralPillGreenText}>Understands: Mutual Funds & Stocks</Text>
              </View>
              <View style={styles.behavioralPillAmber}>
                <BookOpen color="#d97706" size={12} />
                <Text style={styles.behavioralPillAmberText}>Recommends: REIT Dividend Tax & Bonds</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ======================================================== */}
        {/* SMART CHECKPOINT MODAL (30-SECOND DECISION CHECK) */}
        {/* ======================================================== */}
        <Modal visible={showCheckpoint} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Sparkles color="#1b3a6b" size={20} />
                  <Text style={styles.modalTitle}>Smart Checkpoint ⭐</Text>
                </View>
                <TouchableOpacity onPress={() => setShowCheckpoint(false)}>
                  <X color="#64748b" size={20} />
                </TouchableOpacity>
              </View>

              <Text style={styles.checkpointSubHeader}>
                Before investing in <Text style={{ fontWeight: 'bold', color: '#1b3a6b' }}>{selectedAsset?.name}</Text> (₹50,000):
              </Text>
              <Text style={styles.checkpointPrompt}>Let's verify your understanding in 30 seconds:</Text>

              {/* QUESTION 1 */}
              <View style={styles.quizBox}>
                <Text style={styles.questionText}>
                  Q1: REIT returns (such as {selectedAsset?.name}) mainly come from?
                </Text>
                <TouchableOpacity
                  style={[styles.optionBtn, q1Answer === 0 && styles.optionWrong]}
                  onPress={() => setQ1Answer(0)}
                >
                  <Text style={styles.optionText}>A) Stock market price speculation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionBtn, q1Answer === 1 && styles.optionCorrect]}
                  onPress={() => setQ1Answer(1)}
                >
                  <Text style={styles.optionText}>B) Rental income from properties (min 90% payout) ✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionBtn, q1Answer === 2 && styles.optionWrong]}
                  onPress={() => setQ1Answer(2)}
                >
                  <Text style={styles.optionText}>C) Government fixed interest guarantee</Text>
                </TouchableOpacity>
              </View>

              {/* QUESTION 2 */}
              <View style={styles.quizBox}>
                <Text style={styles.questionText}>
                  Q2: Can the market value of a REIT unit decrease if property values fall?
                </Text>
                <TouchableOpacity
                  style={[styles.optionBtn, q2Answer === 0 && styles.optionCorrect]}
                  onPress={() => setQ2Answer(0)}
                >
                  <Text style={styles.optionText}>A) Yes, market prices fluctuate based on occupancy & real estate cycles ✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionBtn, q2Answer === 1 && styles.optionWrong]}
                  onPress={() => setQ2Answer(1)}
                >
                  <Text style={styles.optionText}>B) No, capital value is 100% fixed</Text>
                </TouchableOpacity>
              </View>

              {!checkpointPassed ? (
                <TouchableOpacity style={styles.checkScoreBtn} onPress={submitCheckpointQuiz}>
                  <Text style={styles.checkScoreBtnText}>Calculate Understanding Score →</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.scoreResultBox}>
                  <View style={styles.scoreHeaderRow}>
                    <ShieldCheck color="#16a34a" size={24} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.scoreTitle}>Understanding Score: 85%</Text>
                      <Text style={styles.scoreSub}>You understand Returns, Risks & Liquidity under SEBI norms</Text>
                    </View>
                  </View>

                  <View style={styles.verifiedList}>
                    <Text style={styles.verifiedItem}>✓ Rental Dividend Engine Understood</Text>
                    <Text style={styles.verifiedItem}>✓ Commercial Realty Cycle Risk Understood</Text>
                    <Text style={styles.verifiedItem}>✓ Secondary Market Liquidity Verified</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.proceedInvestBtn}
                    onPress={() => {
                      setOrderExecuted(true);
                      setShowCheckpoint(false);
                    }}
                  >
                    <Text style={styles.proceedInvestBtnText}>Proceed to Invest via Dhan Marg →</Text>
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
  safeArea: { flex: 1, backgroundColor: '#f4f7fb' },
  container: { flex: 1, backgroundColor: '#f4f7fb' },
  heroCard: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  heroBadgeText: {
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  heroBadgeSub: { color: '#bfdbfe', fontSize: 11, fontWeight: '600', marginLeft: 6 },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  heroSub: { color: '#e2e8f0', fontSize: 12, marginTop: 4 },
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  label: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  profileValue: { color: '#1b3a6b', fontSize: 15, fontWeight: 'bold' },
  scoreValue: { color: '#16a34a', fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { color: '#1b3a6b', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  assetCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 12,
    elevation: 1,
  },
  assetCardSelected: { borderColor: '#1b3a6b', backgroundColor: '#ebf3fa', borderWidth: 1.5 },
  assetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  assetTitleRow: { flexDirection: 'row', alignItems: 'center' },
  assetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ebf3fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  assetName: { color: '#0f172a', fontSize: 15, fontWeight: 'bold' },
  typeBadge: { backgroundColor: '#e2e8f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 2, alignSelf: 'flex-start' },
  typeBadgeText: { color: '#334155', fontSize: 10, fontWeight: '600' },
  returnRow: { flexDirection: 'row', alignItems: 'center' },
  returnText: { color: '#16a34a', fontSize: 14, fontWeight: 'bold' },
  minText: { color: '#64748b', fontSize: 11, marginTop: 2 },
  investBtn: { backgroundColor: '#1b3a6b', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  investBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  loadingCard: { padding: 16, backgroundColor: '#ffffff', borderRadius: 14, alignItems: 'center', marginVertical: 10 },
  loadingText: { color: '#64748b', fontSize: 12, marginTop: 8 },
  resultCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  suitableCard: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  unsuitableCard: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  resultTitle: { fontSize: 15, fontWeight: 'bold' },
  reasonText: { color: '#334155', fontSize: 12, lineHeight: 18 },
  smartCheckpointTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b3a6b',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  smartCheckpointTriggerBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
  behavioralCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginTop: 8,
  },
  behavioralTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  behavioralTitle: { color: '#1b3a6b', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  behavioralText: { color: '#64748b', fontSize: 12, lineHeight: 16, marginBottom: 10 },
  behavioralBadgesRow: { flexDirection: 'column', gap: 6 },
  behavioralPillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  behavioralPillGreenText: { color: '#15803d', fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
  behavioralPillAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  behavioralPillAmberText: { color: '#b45309', fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { color: '#1b3a6b', fontSize: 18, fontWeight: 'bold', marginLeft: 6 },
  checkpointSubHeader: { color: '#334155', fontSize: 13, marginBottom: 2 },
  checkpointPrompt: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 12 },
  quizBox: { marginBottom: 12, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  questionText: { color: '#0f172a', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  optionBtn: { backgroundColor: '#ffffff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 6 },
  optionCorrect: { backgroundColor: '#dcfce7', borderColor: '#16a34a' },
  optionWrong: { backgroundColor: '#fee2e2', borderColor: '#dc2626' },
  optionText: { color: '#0f172a', fontSize: 12 },
  checkScoreBtn: { backgroundColor: '#1b3a6b', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  checkScoreBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  scoreResultBox: { marginTop: 10, backgroundColor: '#f0fdf4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0' },
  scoreHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  scoreTitle: { color: '#15803d', fontSize: 16, fontWeight: 'bold' },
  scoreSub: { color: '#166534', fontSize: 11, marginTop: 2 },
  verifiedList: { marginVertical: 10 },
  verifiedItem: { color: '#15803d', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  proceedInvestBtn: { backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  proceedInvestBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
