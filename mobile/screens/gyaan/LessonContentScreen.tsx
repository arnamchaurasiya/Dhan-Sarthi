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
  Bookmark,
  Globe,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Coins,
  Users,
  BarChart3,
  HelpCircle,
  PlayCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import Svg, { Rect, Circle, Path, Text as SvgText } from 'react-native-svg';
import { LESSONS_DATA, LessonDetail } from './gyaanData';
import {
  SUPPORTED_LANGUAGES,
  getUITranslation,
  getLessonTranslation,
} from './gyaanTranslations';

interface LessonContentScreenProps {
  topicId: string;
  onBack: () => void;
  onStartQuiz: (quizId: string) => void;
  onBookmarkToggle: (topicId: string) => void;
  isBookmarked: boolean;
  selectedLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
}

export default function LessonContentScreen({
  topicId,
  onBack,
  onStartQuiz,
  onBookmarkToggle,
  isBookmarked,
  selectedLanguage = 'English',
  onSelectLanguage,
}: LessonContentScreenProps) {
  const rawLesson: LessonDetail = LESSONS_DATA[topicId] || LESSONS_DATA['what_is_reit'];
  
  // Find current language option
  const activeLangObj =
    SUPPORTED_LANGUAGES.find(
      (l) => l.code === selectedLanguage || l.label === selectedLanguage || l.native === selectedLanguage
    ) || SUPPORTED_LANGUAGES[0];

  const lesson = getLessonTranslation(topicId, activeLangObj.label, rawLesson);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTag}>LESSON CONTENT</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={[styles.actionIconBtn, isBookmarked && styles.actionIconBtnActive]}
            onPress={() => onBookmarkToggle(topicId)}
          >
            <Bookmark
              size={18}
              color={isBookmarked ? '#2563eb' : '#64748b'}
              fill={isBookmarked ? '#2563eb' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Switcher Sub-bar */}
      <View style={styles.langBar}>
        <Globe size={14} color="#64748b" />
        <Text style={styles.langLabel}>
          {getUITranslation('readIn', activeLangObj.label)}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = activeLangObj.code === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langChip, isSelected && styles.langChipActive]}
                onPress={() => {
                  if (onSelectLanguage) onSelectLanguage(lang.code);
                }}
              >
                <Text style={[styles.langChipText, isSelected && styles.langChipTextActive]}>
                  {lang.native}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scrollable Lesson Body */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Meta Bar */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#64748b" />
            <Text style={styles.metaText}>{lesson.readTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Award size={14} color="#ca8a04" />
            <Text style={styles.metaText}>+{lesson.points} Gyaan Points</Text>
          </View>
        </View>

        {/* Lesson Subtitle */}
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>

        {/* Visual Mechanism Diagram (SVG) */}
        <View style={styles.diagramCard}>
          <Text style={styles.diagramTitle}>HOW REIT CASH FLOW WORKS</Text>

          <Svg height="140" width="100%" viewBox="0 0 320 120">
            {/* Box 1: Commercial Property */}
            <Rect x="10" y="20" width="80" height="50" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
            <SvgText x="50" y="42" fontSize="10" fontWeight="bold" fill="#1e40af" textAnchor="middle">
              Commercial
            </SvgText>
            <SvgText x="50" y="56" fontSize="9" fill="#1e40af" textAnchor="middle">
              Offices & Malls
            </SvgText>

            {/* Arrow 1 */}
            <Path d="M 95 45 L 125 45" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Box 2: SPV Rental Collections */}
            <Rect x="130" y="20" width="70" height="50" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <SvgText x="165" y="42" fontSize="10" fontWeight="bold" fill="#b45309" textAnchor="middle">
              Monthly
            </SvgText>
            <SvgText x="165" y="56" fontSize="9" fill="#b45309" textAnchor="middle">
              Rent Income
            </SvgText>

            {/* Arrow 2 */}
            <Path d="M 205 45 L 235 45" stroke="#059669" strokeWidth="2" />

            {/* Box 3: 90% NDCF to Investors */}
            <Rect x="240" y="20" width="70" height="50" rx="8" fill="#dcfce7" stroke="#059669" strokeWidth="1.5" />
            <SvgText x="275" y="40" fontSize="10" fontWeight="bold" fill="#15803d" textAnchor="middle">
              90% NDCF
            </SvgText>
            <SvgText x="275" y="54" fontSize="9" fill="#15803d" textAnchor="middle">
              Payout
            </SvgText>

            {/* Bottom Label */}
            <Rect x="40" y="85" width="240" height="24" rx="12" fill="#1e293b" />
            <SvgText x="160" y="101" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              SEBI Mandate: Quarterly Dividend Distribution
            </SvgText>
          </Svg>
        </View>

        {/* In Simple Words Callout Box */}
        <View style={styles.simpleBox}>
          <View style={styles.simpleHeader}>
            <HelpCircle size={18} color="#b45309" />
            <Text style={styles.simpleTitle}>
              {getUITranslation('inSimpleWords', activeLangObj.label)}
            </Text>
          </View>
          <Text style={styles.simpleText}>{lesson.inSimpleWords}</Text>
        </View>

        {/* Simple Explanation */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>
            {getUITranslation('detailedExplanation', activeLangObj.label)}
          </Text>
          <Text style={styles.bodyParagraph}>{lesson.explanation}</Text>
        </View>

        {/* Key Takeaways */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>
            {getUITranslation('keyTakeaways', activeLangObj.label)}
          </Text>
          {lesson.keyPoints.map((pt, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: 2 }} />
              <Text style={styles.bulletText}>{pt}</Text>
            </View>
          ))}
        </View>

        {/* SEBI Risk Warning Box */}
        <View style={styles.riskBox}>
          <View style={styles.riskHeader}>
            <AlertTriangle size={18} color="#dc2626" />
            <Text style={styles.riskTitle}>
              {getUITranslation('investorRiskWarning', activeLangObj.label)}
            </Text>
          </View>
          {lesson.risks.map((risk, idx) => (
            <View key={idx} style={styles.riskBulletRow}>
              <Text style={styles.riskBulletDot}>•</Text>
              <Text style={styles.riskBulletText}>{risk}</Text>
            </View>
          ))}
        </View>

        {/* Investor Considerations */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>
            {getUITranslation('whatToCheck', activeLangObj.label)}
          </Text>
          {lesson.investorConsiderations.map((item, idx) => (
            <View key={idx} style={styles.checkRow}>
              <ShieldCheck size={16} color="#0284c7" style={{ marginTop: 2 }} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Practical Example */}
        <View style={styles.exampleCard}>
          <Text style={styles.exampleTag}>
            {getUITranslation('practicalExample', activeLangObj.label)}
          </Text>
          <Text style={styles.exampleTitle}>{lesson.example.name}</Text>
          <Text style={styles.exampleDesc}>{lesson.example.description}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.quizBtn}
          onPress={() => onStartQuiz(lesson.quizId)}
          activeOpacity={0.85}
        >
          <Award size={18} color="#ffffff" />
          <Text style={styles.quizBtnText}>
            {getUITranslation('takeQuizBtn', activeLangObj.label)}
          </Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    flex: 1,
    marginLeft: 12,
  },
  headerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconBtnActive: {
    backgroundColor: '#dbeafe',
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  langLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  langChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  langChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  langChipText: {
    fontSize: 11,
    color: '#475569',
  },
  langChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 22,
    marginBottom: 16,
  },
  diagramCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    alignItems: 'center',
  },
  diagramTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 10,
  },
  simpleBox: {
    backgroundColor: '#fffbe3',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde047',
    marginBottom: 16,
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  simpleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
    letterSpacing: 0.5,
  },
  simpleText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 20,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  bodyParagraph: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  riskBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 0.5,
  },
  riskBulletRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  riskBulletDot: {
    fontSize: 14,
    color: '#991b1b',
  },
  riskBulletText: {
    flex: 1,
    fontSize: 12,
    color: '#991b1b',
    lineHeight: 16,
  },
  checkRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  checkText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
  },
  exampleCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#86efac',
    marginBottom: 20,
  },
  exampleTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  exampleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#14532d',
    marginTop: 4,
  },
  exampleDesc: {
    fontSize: 12,
    color: '#166534',
    marginTop: 4,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
  },
  quizBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
