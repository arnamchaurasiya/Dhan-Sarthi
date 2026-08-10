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
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Sliders,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react-native';
import { QUIZZES_DATA, Quiz, QuizQuestion } from './gyaanData';

interface QuizScreenProps {
  quizId: string;
  onBack: () => void;
  onQuizComplete: (score: number, pointsEarned: number) => void;
  onNavigateToSimulator: () => void;
  onNavigateToReadiness: () => void;
}

export default function QuizScreen({
  quizId,
  onBack,
  onQuizComplete,
  onNavigateToSimulator,
  onNavigateToReadiness,
}: QuizScreenProps) {
  const quiz: Quiz = QUIZZES_DATA[quizId] || QUIZZES_DATA['quiz_reit_1'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: QuizQuestion = quiz.questions[currentIndex];

  const handleOptionSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      quiz.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer || (idx === currentIndex && selectedOption === q.correctAnswer)) {
          correctCount += 1;
        }
      });
      setIsFinished(true);
      onQuizComplete(correctCount, quiz.pointsReward);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  // If Quiz is finished, show Results screen
  if (isFinished) {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score += 1;
    });
    const pct = Math.round((score / quiz.questions.length) * 100);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Results</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.resultsContent}>
          <View style={styles.resultCard}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{score}/{quiz.questions.length}</Text>
              <Text style={styles.scorePct}>{pct}%</Text>
            </View>

            <Text style={styles.resultTitle}>
              {pct >= 80 ? '🎉 Excellent Understanding!' : 'Good Effort! Keep Learning'}
            </Text>
            <Text style={styles.resultSub}>
              You have verified your knowledge of SEBI REIT regulations and income mechanisms.
            </Text>

            <View style={styles.pointsEarnedBadge}>
              <Award size={20} color="#ca8a04" />
              <Text style={styles.pointsEarnedText}>+{quiz.pointsReward} Gyaan Points Earned!</Text>
            </View>
          </View>

          {/* Concepts Mastered Checklist */}
          <View style={styles.masteredCard}>
            <Text style={styles.masteredTitle}>CONCEPTS VERIFIED</Text>
            <View style={styles.masteredRow}>
              <CheckCircle2 size={16} color="#16a34a" />
              <Text style={styles.masteredItemText}>90% NDCF Distribution Rule</Text>
            </View>
            <View style={styles.masteredRow}>
              <CheckCircle2 size={16} color="#16a34a" />
              <Text style={styles.masteredItemText}>REIT Liquidity vs Physical Real Estate</Text>
            </View>
            <View style={styles.masteredRow}>
              <CheckCircle2 size={16} color="#16a34a" />
              <Text style={styles.masteredItemText}>Market & Tenant Occupancy Risks</Text>
            </View>
          </View>

          {/* Recommended Next Actions */}
          <Text style={styles.nextActionsLabel}>RECOMMENDED NEXT STEPS</Text>

          <TouchableOpacity
            style={styles.actionCardPrimary}
            onPress={onNavigateToSimulator}
          >
            <Sliders size={20} color="#ffffff" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.actionCardTitle}>Try REIT Income Simulator</Text>
              <Text style={styles.actionCardSub}>Project your quarterly payouts for ₹1 Lakh investment</Text>
            </View>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCardSecondary}
            onPress={onNavigateToReadiness}
          >
            <ShieldCheck size={20} color="#0284c7" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.actionCardSecTitle}>Check Investment Readiness</Text>
              <Text style={styles.actionCardSecSub}>Complete pre-investment verification before Dhan Marg</Text>
            </View>
            <ArrowRight size={18} color="#0284c7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
            <RotateCcw size={16} color="#64748b" />
            <Text style={styles.restartBtnText}>Retake Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{quiz.title}</Text>
          <Text style={styles.questionTracker}>
            Question {currentIndex + 1} of {quiz.questions.length}
          </Text>
        </View>
        <View style={styles.pointsTag}>
          <Award size={14} color="#ca8a04" />
          <Text style={styles.pointsTagText}>+{quiz.pointsReward}</Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.quizContent}>
        {/* Question Text */}
        <Text style={styles.questionText}>{currentQ.question}</Text>

        {/* Options List */}
        {currentQ.options.map((opt, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isCorrect = optIdx === currentQ.correctAnswer;

          let optionStyle: any = styles.optionBtn;
          let textStyle: any = styles.optionText;

          if (isSubmitted) {
            if (isCorrect) {
              optionStyle = [styles.optionBtn, styles.optionCorrect];
              textStyle = [styles.optionText, styles.optionTextCorrect];
            } else if (isSelected) {
              optionStyle = [styles.optionBtn, styles.optionIncorrect];
              textStyle = [styles.optionText, styles.optionTextIncorrect];
            }
          } else if (isSelected) {
            optionStyle = [styles.optionBtn, styles.optionSelected];
            textStyle = [styles.optionText, styles.optionTextSelected];
          }

          return (
            <TouchableOpacity
              key={optIdx}
              style={optionStyle}
              onPress={() => handleOptionSelect(optIdx)}
              disabled={isSubmitted}
              activeOpacity={0.8}
            >
              <View style={styles.optionLetterBox}>
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + optIdx)}
                </Text>
              </View>
              <Text style={textStyle}>{opt}</Text>

              {isSubmitted && isCorrect && (
                <CheckCircle2 size={20} color="#16a34a" />
              )}
              {isSubmitted && isSelected && !isCorrect && (
                <XCircle size={20} color="#dc2626" />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Answer Explanation Box */}
        {isSubmitted && (
          <View style={styles.explanationBox}>
            <View style={styles.explanationHeader}>
              <HelpCircle size={16} color="#0284c7" />
              <Text style={styles.explanationTitle}>SEBI RULE & EXPLANATION</Text>
            </View>
            <Text style={styles.explanationText}>{currentQ.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        {!isSubmitted ? (
          <TouchableOpacity
            style={[styles.submitBtn, selectedOption === null && styles.btnDisabled]}
            disabled={selectedOption === null}
            onPress={handleSubmitAnswer}
          >
            <Text style={styles.submitBtnText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}
            </Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  questionTracker: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  pointsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef9c3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#854d0e',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#f1f5f9',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  quizContent: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 26,
    marginBottom: 24,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionCorrect: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  optionIncorrect: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  optionLetterBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#1e40af',
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: '#14532d',
    fontWeight: '700',
  },
  optionTextIncorrect: {
    color: '#7f1d1d',
    fontWeight: '700',
  },
  explanationBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  explanationTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369a1',
    letterSpacing: 0.5,
  },
  explanationText: {
    fontSize: 13,
    color: '#0c4a6e',
    lineHeight: 18,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  resultsContent: {
    padding: 20,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#2563eb',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e40af',
  },
  scorePct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  resultSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  pointsEarnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef9c3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  pointsEarnedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#854d0e',
  },
  masteredCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  masteredTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
  },
  masteredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  masteredItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  nextActionsLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  actionCardPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionCardSub: {
    fontSize: 11,
    color: '#dbeafe',
    marginTop: 2,
  },
  actionCardSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  actionCardSecTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0369a1',
  },
  actionCardSecSub: {
    fontSize: 11,
    color: '#0c4a6e',
    marginTop: 2,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  restartBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
});
