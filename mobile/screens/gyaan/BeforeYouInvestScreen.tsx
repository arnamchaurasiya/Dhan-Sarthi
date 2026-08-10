import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  AlertTriangle,
  Building2,
  Landmark,
  PieChart,
  TrendingUp,
} from 'lucide-react-native';
import { READINESS_CHECKLISTS, ReadinessChecklist } from './gyaanData';

interface BeforeYouInvestScreenProps {
  onBack: () => void;
  onNavigateToTopic: (topicId: string) => void;
  onProceedToMarg: (productName: string) => void;
  initialProduct?: string;
}

export default function BeforeYouInvestScreen({
  onBack,
  onNavigateToTopic,
  onProceedToMarg,
  initialProduct = 'reit',
}: BeforeYouInvestScreenProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProduct);

  const checklistObj: ReadinessChecklist =
    READINESS_CHECKLISTS[selectedProduct] || READINESS_CHECKLISTS['reit'];

  const completedCount = checklistObj.requiredItems.filter((i) => i.completed).length;
  const totalCount = checklistObj.requiredItems.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const isFullyReady = progressPct === 100;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Before You Invest — Gatekeeper</Text>
          <Text style={styles.headerSub}>SEBI Investor Readiness Verification</Text>
        </View>
        <ShieldCheck size={22} color="#0284c7" />
      </View>

      {/* Product Selector Chips */}
      <View style={styles.productSelector}>
        <Text style={styles.selectorLabel}>SELECT PRODUCT TO EVALUATE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { id: 'reit', name: 'REITs & InvITs' },
            { id: 'bonds', name: 'Corporate Bonds' },
            { id: 'mutual_funds', name: 'Mutual Funds' },
          ].map((prod) => (
            <TouchableOpacity
              key={prod.id}
              style={[
                styles.productChip,
                selectedProduct === prod.id && styles.productChipActive,
              ]}
              onPress={() => setSelectedProduct(prod.id)}
            >
              <Text
                style={[
                  styles.productChipText,
                  selectedProduct === prod.id && styles.productChipTextActive,
                ]}
              >
                {prod.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Readiness Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.pctRing}>
              <Text style={styles.pctText}>{progressPct}%</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.statusTitle}>
                {isFullyReady ? 'You\'re Investor Ready!' : 'Readiness In Progress'}
              </Text>
              <Text style={styles.statusSub}>
                {completedCount} of {totalCount} mandatory lessons completed for {checklistObj.productName}.
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPct}%`,
                  backgroundColor: isFullyReady ? '#16a34a' : '#0284c7',
                },
              ]}
            />
          </View>
        </View>

        {/* SEBI Gatekeeper Explanation Box */}
        <View style={styles.gatekeeperNotice}>
          <ShieldCheck size={20} color="#0284c7" />
          <View style={{ flex: 1 }}>
            <Text style={styles.gatekeeperTitle}>Why this verification matters</Text>
            <Text style={styles.gatekeeperDesc}>
              Dhan Gyaan ensures you never invest blindly. Verifying knowledge before Dhan Marg protects your capital against suitability mismatch.
            </Text>
          </View>
        </View>

        {/* Mandatory Checklist Items */}
        <Text style={styles.checklistHeading}>MANDATORY KNOWLEDGE CHECKLIST</Text>

        {checklistObj.requiredItems.map((item, idx) => (
          <View key={item.id} style={styles.checkItemCard}>
            <View style={styles.checkIconCol}>
              {item.completed ? (
                <CheckCircle2 size={22} color="#16a34a" />
              ) : (
                <View style={styles.incompleteDot} />
              )}
            </View>

            <View style={styles.checkTextCol}>
              <Text style={styles.checkItemTitle}>{item.title}</Text>
              <Text style={styles.checkItemStatus}>
                {item.completed ? '✓ Verified Knowledge' : '⚠️ Pending Required Lesson'}
              </Text>
            </View>

            {!item.completed && item.topicId && (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => onNavigateToTopic(item.topicId!)}
              >
                <PlayCircle size={14} color="#ffffff" />
                <Text style={styles.completeBtnText}>Learn</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Action Button: Bridge to Dhan Marg */}
        {isFullyReady ? (
          <View style={styles.readyBox}>
            <View style={styles.readyHeader}>
              <CheckCircle2 size={24} color="#16a34a" />
              <View style={{ flex: 1 }}>
                <Text style={styles.readyTitle}>Verification Complete!</Text>
                <Text style={styles.readySub}>
                  You understand the mechanism, risks, and NDCF rules of {checklistObj.productName}.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.proceedMargBtn}
              onPress={() => onProceedToMarg(checklistObj.productName)}
              activeOpacity={0.85}
            >
              <Text style={styles.proceedMargText}>Continue to Dhan Marg →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingTitle}>Complete Remaining Lessons First</Text>
            <Text style={styles.pendingSub}>
              Finish the remaining {totalCount - completedCount} pending lesson(s) above to unlock investment matching in Dhan Marg.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  productSelector: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectorLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  productChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  productChipActive: {
    backgroundColor: '#0284c7',
  },
  productChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  productChipTextActive: {
    color: '#ffffff',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pctRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0f2fe',
    borderWidth: 3,
    borderColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pctText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0369a1',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  statusSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  gatekeeperNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f0f9ff',
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  gatekeeperTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369a1',
  },
  gatekeeperDesc: {
    fontSize: 11,
    color: '#0c4a6e',
    marginTop: 2,
    lineHeight: 15,
  },
  checklistHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  checkItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkIconCol: {
    marginRight: 12,
  },
  incompleteDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d97706',
    backgroundColor: '#fffbe3',
  },
  checkTextCol: {
    flex: 1,
  },
  checkItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  checkItemStatus: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  completeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  readyBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  readyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  readyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#14532d',
  },
  readySub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  proceedMargBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedMargText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  pendingBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c2410c',
  },
  pendingSub: {
    fontSize: 12,
    color: '#9a3412',
    marginTop: 4,
    lineHeight: 16,
  },
});
