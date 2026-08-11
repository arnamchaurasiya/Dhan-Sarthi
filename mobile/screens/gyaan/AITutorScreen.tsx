import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Globe,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react-native';
import axios from 'axios';

interface QuizData {
  question: string;
  options: string[];
  correct_index: number;
  reward_coins: number;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  topicId?: string;
  topicTitle?: string;
  riskWarning?: string;
  badgeAwarded?: string;
  aiEngine?: string;
  quiz?: QuizData;
}

interface AITutorScreenProps {
  onBack: () => void;
  onNavigateToTopic?: (topicId: string) => void;
  selectedLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
}

const API_BASE = 'https://dhan-sarthi.onrender.com';

const SUGGESTED_PROMPTS = [
  'What is the difference between a REIT and a mutual fund?',
  'Are REITs safe or high risk?',
  'How does the 90% payout rule work in India?',
  'How are REIT dividends taxed under STCG/LTCG?',
  'What are SEBI rules on corporate bond ratings?',
];

export default function AITutorScreen({
  onBack,
  onNavigateToTopic,
  selectedLanguage = 'English',
  onSelectLanguage,
}: AITutorScreenProps) {
  const [selectedLang, setSelectedLang] = useState(selectedLanguage);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [msgId: string]: number }>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: getUITranslation('tutorWelcome', selectedLanguage),
      aiEngine: '🛡️ SEBI AI Engine',
    },
  ]);

  useEffect(() => {
    setSelectedLang(selectedLanguage);
    setMessages((prev) => {
      if (prev.length > 0 && prev[0].id === 'm1') {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          text: getUITranslation('tutorWelcome', selectedLanguage),
        };
        return updated;
      }
      return prev;
    });
  }, [selectedLanguage]);

  const handleSend = async (promptText?: string) => {
    const textToAsk = promptText || inputQuery;
    if (!textToAsk.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToAsk,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    const endpoints = [
      'http://10.0.2.2:8000/api/v1/ai/ask-gyaan',
      'http://localhost:8000/api/v1/ai/ask-gyaan',
      `${API_BASE}/api/v1/ai/ask-gyaan`,
    ];

    let res = null;
    for (const ep of endpoints) {
      try {
        res = await axios.post(
          ep,
          {
            query: textToAsk,
            language: selectedLang,
          },
          { timeout: 5000 }
        );
        if (res && res.data) break;
      } catch (e) {
        // Try next endpoint
      }
    }

    if (res && res.data) {
      const data = res.data;

      let topicId: string | undefined = undefined;
      let topicTitle: string | undefined = undefined;
      let riskWarning: string | undefined = data.risk_warning || undefined;

      const qLower = textToAsk.toLowerCase();
      if (qLower.includes('reit')) {
        topicId = 'what_is_reit';
        topicTitle = 'Learn Risks of REITs';
        if (!riskWarning) {
          riskWarning = 'REIT unit prices fluctuate with interest rate changes and tenant occupancy levels.';
        }
      } else if (qLower.includes('bond')) {
        topicId = 'bonds_101';
        topicTitle = 'Explore Bond Yields & Risks';
        if (!riskWarning) {
          riskWarning = 'Bond secondary market prices move inversely to RBI interest rate changes.';
        }
      } else if (qLower.includes('mutual fund') || qLower.includes('fund')) {
        topicId = 'mutual_funds';
        topicTitle = 'Explore Mutual Fund Risk Levels';
        if (!riskWarning) {
          riskWarning = 'Mutual fund investments are subject to market risks. Read scheme documents carefully.';
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.explanation || `Securities markets provide transparent rules governed by SEBI to protect your wealth.`,
        topicId: topicId,
        topicTitle: topicTitle,
        riskWarning: riskWarning,
        badgeAwarded: data.badge_awarded || undefined,
        aiEngine: '🛡️ SEBI AI Engine',
        quiz: data.quiz || undefined,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } else {
      // Offline / Local Fallback Logic
      const qLower = textToAsk.toLowerCase();
      let replyText = `👋 Namaste! I am your Dhan Gyaan AI Tutor. Ask me any question about REITs, InvITs, Mutual Funds, Bonds, or SEBI regulations!`;
      let topicKey: string | undefined = undefined;
      let topicTitle: string | undefined = undefined;
      let warningText: string | undefined = undefined;
      let quizData: QuizData | undefined = undefined;
      let badgeName: string | undefined = undefined;

      if (qLower.includes('reit')) {
        replyText = `A REIT is like a mutual fund for real estate. Commercial properties generate rent from IT hubs & shopping malls, and SEBI rules mandate distributing 90% of that net rental income directly to unit holders as quarterly dividends!`;
        topicKey = 'what_is_reit';
        topicTitle = 'Learn Risks of REITs';
        warningText = 'REIT unit prices fluctuate with interest rate changes and tenant occupancy levels.';
        badgeName = 'REIT Explorer';
        quizData = {
          question: 'What percentage of net rental cash flow must REITs distribute under SEBI rules?',
          options: ['At least 90%', 'At least 10%', '50%', 'Zero mandatory payout'],
          correct_index: 0,
          reward_coins: 50,
        };
      } else if (qLower.includes('bond')) {
        replyText = `A Bond is an IOU note where you lend money to a government or corporation. In return, they promise fixed interest payments and capital return at maturity.`;
        topicKey = 'bonds_101';
        topicTitle = 'Explore Bond Yields';
        warningText = 'Bond secondary market prices move inversely to RBI interest rate changes.';
        badgeName = 'Bond Pioneer';
        quizData = {
          question: 'What happens to existing bond prices when secondary interest rates rise?',
          options: ['Secondary bond prices drop', 'Bond prices double', 'No impact', 'Interest doubles'],
          correct_index: 0,
          reward_coins: 50,
        };
      } else if (qLower.includes('fund') || qLower.includes('stock')) {
        replyText = `Mutual Funds pool money from multiple investors under professional fund managers to invest in equities, debt, or gold following SEBI riskometer disclosures.`;
        topicKey = 'mutual_funds';
        topicTitle = 'Explore Mutual Fund Types';
        warningText = 'Mutual fund investments are subject to market risks. Read scheme documents carefully.';
        badgeName = 'Fund Explorer';
        quizData = {
          question: 'Who regulates mutual funds and stock brokers in India?',
          options: ['SEBI', 'Unregulated private entities', 'RBI only', 'Ministry of Agriculture'],
          correct_index: 0,
          reward_coins: 50,
        };
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        topicId: topicKey,
        topicTitle: topicTitle,
        riskWarning: warningText,
        aiEngine: '🛡️ SEBI AI Engine',
        badgeAwarded: badgeName,
        quiz: quizData,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 25}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <View style={styles.botBadge}>
            <Sparkles size={16} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Gyaan Tutor</Text>
            <Text style={styles.headerSub}>Instant SEBI-Aligned Financial Guidance</Text>
          </View>
        </View>
      </View>

      {/* Language Selector Chips */}
      <View style={styles.langBar}>
        <Globe size={14} color="#64748b" />
        <Text style={styles.langLabel}>Language:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 6 }}>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code || selectedLang === lang.label || selectedLang === lang.native;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langChip, isSelected && styles.langChipActive]}
                onPress={() => {
                  setSelectedLang(lang.code);
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

      {/* Chat Thread */}
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgWrapper,
              msg.sender === 'user' ? styles.userMsgWrapper : styles.aiMsgWrapper,
            ]}
          >
            {msg.sender === 'ai' && (
              <View style={styles.botAvatar}>
                <Bot size={16} color="#ffffff" />
              </View>
            )}

            <View
              style={[
                styles.msgBubble,
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {msg.aiEngine && (
                <View style={styles.engineTag}>
                  <Text style={styles.engineTagText}>{msg.aiEngine}</Text>
                </View>
              )}

              <Text style={[styles.msgText, msg.sender === 'user' && styles.userMsgText]}>
                {msg.text}
              </Text>

              {/* Badge Awarded Pill */}
              {msg.badgeAwarded && (
                <View style={styles.badgeBox}>
                  <ShieldCheck size={14} color="#047857" />
                  <Text style={styles.badgeText}>🏆 Badge Unlocked: {msg.badgeAwarded}</Text>
                </View>
              )}

              {/* Interactive Quiz Card */}
              {msg.quiz && (
                <View style={styles.quizCard}>
                  <Text style={styles.quizTitle}>⚡ Instant Knowledge Check (+{msg.quiz.reward_coins} Dhan Coins)</Text>
                  <Text style={styles.quizQuestion}>{msg.quiz.question}</Text>
                  {msg.quiz.options.map((opt, oIdx) => {
                    const selected = selectedQuizAnswers[msg.id] === oIdx;
                    const isCorrect = msg.quiz!.correct_index === oIdx;
                    const hasAnswered = selectedQuizAnswers[msg.id] !== undefined;

                    return (
                      <TouchableOpacity
                        key={oIdx}
                        style={[
                          styles.quizOpt,
                          hasAnswered && selected && isCorrect && styles.quizOptCorrect,
                          hasAnswered && selected && !isCorrect && styles.quizOptWrong,
                        ]}
                        disabled={hasAnswered}
                        onPress={() => setSelectedQuizAnswers((prev) => ({ ...prev, [msg.id]: oIdx }))}
                      >
                        <Text style={[styles.quizOptText, hasAnswered && selected && { color: '#ffffff' }]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Mandated SEBI Risk & Disclaimer Layer */}
              {msg.riskWarning && (
                <View style={styles.disclaimerBox}>
                  <AlertTriangle size={14} color="#b45309" />
                  <Text style={styles.disclaimerText}>{msg.riskWarning}</Text>
                </View>
              )}

              {/* Curriculum Bridge Button */}
              {msg.topicId && (
                <TouchableOpacity
                  style={styles.curriculumLink}
                  onPress={() => onNavigateToTopic(msg.topicId!)}
                >
                  <Text style={styles.curriculumLinkText}>
                    {msg.topicTitle || 'Learn Topic in Curriculum'}
                  </Text>
                  <ArrowRight size={14} color="#2563eb" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.loadingText}>Retrieving SEBI trusted guidance...</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggested Questions Chips */}
      <View style={styles.promptSection}>
        <Text style={styles.promptLabel}>SUGGESTED QUESTIONS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptScroll} keyboardShouldPersistTaps="handled">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handleSend(prompt)}
            >
              <Text style={styles.promptChipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a financial question in any language..."
          placeholderTextColor="#94a3b8"
          value={inputQuery}
          onChangeText={setInputQuery}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputQuery.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
        >
          <Send size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1b3a6b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
  },
  langChipActive: {
    backgroundColor: '#2563eb',
  },
  langChipText: {
    fontSize: 11,
    color: '#475569',
  },
  langChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  userMsgWrapper: {
    justifyContent: 'flex-end',
  },
  aiMsgWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    padding: 14,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  msgText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  userMsgText: {
    color: '#ffffff',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbe3',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#78350f',
  },
  curriculumLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  curriculumLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748b',
  },
  promptSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  promptLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  promptScroll: {
    paddingLeft: 16,
  },
  promptChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  promptChipText: {
    fontSize: 12,
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  engineTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  engineTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  quizCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quizTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quizQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  quizOpt: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  quizOptCorrect: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  quizOptWrong: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  quizOptText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
});
