import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
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

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  topicId?: string;
  topicTitle?: string;
  riskWarning?: string;
}

interface AITutorScreenProps {
  onBack: () => void;
  onNavigateToTopic: (topicId: string) => void;
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
}: AITutorScreenProps) {
  const [selectedLang, setSelectedLang] = useState('English');
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: '👋 Namaste! I am your Dhan Gyaan AI Tutor. Ask me any question about REITs, InvITs, Mutual Funds, Bonds, or SEBI regulations in your preferred language.',
    },
  ]);

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

    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/ask-gyaan`, {
        query: textToAsk,
        language: selectedLang,
      });

      const data = res.data;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.explanation || `A REIT (Real Estate Investment Trust) allows individual investors to own fractions of income-producing commercial real estate. Unlike physical property requiring large capital, REITs trade like stocks on BSE/NSE with quarterly dividend payouts.`,
        topicId: 'what_is_reit',
        topicTitle: 'Learn Risks of REITs',
        riskWarning: 'REIT unit prices fluctuate with interest rate changes and tenant occupancy levels.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback AI Tutor Response
      let replyText = `A REIT is like a mutual fund for real estate. Commercial properties generate rent from IT hubs & shopping malls, and SEBI rules mandate distributing 90% of that net rental income directly to unit holders as quarterly dividends!`;
      let topicKey = 'what_is_reit';

      if (textToAsk.toLowerCase().includes('risk') || textToAsk.toLowerCase().includes('safe')) {
        replyText = `REITs provide regular rental payouts, but they are NOT risk-free. Their unit prices fluctuate on stock exchanges, and returns depend on corporate tenant renewals and RBI interest rate trends.`;
        topicKey = 'risks_of_reits';
      } else if (textToAsk.toLowerCase().includes('tax')) {
        replyText = `REIT distributions have 3 components: Interest, Dividend, and Capital Repayment. Interest portion is taxable at your slab rate, while qualified Dividend portion may be tax-exempt under SEBI/IT Act rules.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        topicId: topicKey,
        topicTitle: 'Explore Topic in Curriculum',
        riskWarning: 'Always evaluate REIT dividend yield %, vacancy rates, and credit ratings before investing.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.langChip, selectedLang === lang && styles.langChipActive]}
              onPress={() => setSelectedLang(lang)}
            >
              <Text style={[styles.langChipText, selectedLang === lang && styles.langChipTextActive]}>
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Thread */}
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
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
              <Text style={[styles.msgText, msg.sender === 'user' && styles.userMsgText]}>
                {msg.text}
              </Text>

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
            <Text style={styles.loadingText}>Retrieving SEBI trusted knowledge...</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggested Questions Chips */}
      <View style={styles.promptSection}>
        <Text style={styles.promptLabel}>SUGGESTED QUESTIONS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptScroll}>
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
    </View>
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
});
