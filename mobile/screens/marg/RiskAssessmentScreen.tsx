import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { RISK_QUESTIONNAIRE, InvestorProfile } from './margData';

interface Props {
  onCompleteRiskAssessment: (calculatedRisk: InvestorProfile['riskProfile']) => void;
}

export default function RiskAssessmentScreen({ onCompleteRiskAssessment }: Props) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({
    0: 'stay',
    1: 'balanced',
    2: 'intermediate',
    3: 'long_term',
  });

  const question = RISK_QUESTIONNAIRE[currentQuestionIdx];
  const totalQuestions = RISK_QUESTIONNAIRE.length;
  const currentAnswer = selectedAnswers[currentQuestionIdx];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Calculate Risk Profile Score
      let totalPoints = 0;
      RISK_QUESTIONNAIRE.forEach((q, idx) => {
        const chosenId = selectedAnswers[idx];
        const opt = q.options.find((o) => o.id === chosenId);
        if (opt) totalPoints += opt.points;
      });

      let finalRisk: InvestorProfile['riskProfile'] = 'Moderate';
      if (totalPoints <= 6) finalRisk = 'Conservative';
      else if (totalPoints >= 10) finalRisk = 'Aggressive';
      else finalRisk = 'Moderate';

      onCompleteRiskAssessment(finalRisk);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressStepText}>
              Question {currentQuestionIdx + 1} of {totalQuestions}
            </Text>
            <Text style={styles.progressPctText}>
              {Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100)}%
            </Text>
          </View>
          <View style={styles.trackBar}>
            <View
              style={[
                styles.filledBar,
                { width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.questionTitle}>{question.question}</Text>

        {question.options.map((opt) => {
          const isSelected = currentAnswer === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.radioCard, isSelected && styles.radioCardSelected]}
              onPress={() => handleSelectOption(opt.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.circleOuter, isSelected && styles.circleOuterSelected]}>
                {isSelected && <View style={styles.circleInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {opt.text}
                </Text>
                <Text style={styles.cardDesc}>{opt.subtext}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Why We Ask Box */}
        <View style={styles.whyAskBox}>
          <View style={styles.whyAskIconWrap}>
            <HelpCircle color="#d97706" size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.whyAskTitle}>Why we ask this?</Text>
            <Text style={styles.whyAskText}>{question.explanation}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomBtnRow}>
          {currentQuestionIdx > 0 && (
            <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
              <Text style={styles.prevBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={handleNext}>
            <Text style={styles.primaryBtnText}>
              {currentQuestionIdx === totalQuestions - 1 ? 'Calculate Risk Result →' : 'Next Question →'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },

  progressContainer: { marginBottom: 18 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressStepText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
  progressPctText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  trackBar: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' },
  filledBar: { height: '100%', backgroundColor: '#2563eb', borderRadius: 3 },

  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },

  radioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  radioCardSelected: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  cardTitleSelected: { color: '#16a34a', fontWeight: 'bold' },
  cardDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },

  circleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleOuterSelected: { borderColor: '#16a34a' },
  circleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a' },

  whyAskBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 10,
  },
  whyAskIconWrap: { marginRight: 10, marginTop: 2 },
  whyAskTitle: { fontSize: 13, fontWeight: 'bold', color: '#b45309' },
  whyAskText: { fontSize: 12, color: '#92400e', marginTop: 2, lineHeight: 16 },

  bottomBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  prevBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevBtnText: { color: '#475569', fontSize: 14, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
});
