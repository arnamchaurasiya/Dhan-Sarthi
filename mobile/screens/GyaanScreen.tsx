import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Search, BookOpen, Star, Award, ShieldCheck } from 'lucide-react-native';

const API_BASE = 'http://10.169.95.9:8000';

export default function GyaanScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const askGyaan = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/ask-gyaan`, {
        query: query,
        language: "English"
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* SEBI Saarthi Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadgeText}>SEBI INVESTOR EDUCATION</Text>
          <Text style={styles.heroBadgeSub}>• Dhan Gyaan</Text>
        </View>
        <Text style={styles.heroTitle}>Financial Awareness Hub</Text>
        <Text style={styles.heroSub}>Learn about Securities Markets, Investor Rights & Grievance Redressal</Text>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>What do you want to learn today?</Text>
          <View style={styles.searchRow}>
            <View style={styles.inputContainer}>
              <Search color="#94a3b8" size={18} style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. How Mutual Funds work?"
                placeholderTextColor="#94a3b8"
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={askGyaan} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Ask AI</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTopic}>{result.topic}</Text>
              <View style={styles.badge}>
                <Star color="#d97706" size={12} fill="#d97706" />
                <Text style={styles.badgeText}> {result.badge_awarded}</Text>
              </View>
            </View>
            <Text style={styles.explanation}>{result.explanation}</Text>
            <TouchableOpacity style={styles.quizButton}>
              <BookOpen color="#1b3a6b" size={16} />
              <Text style={styles.quizText}> Take quiz to earn 50 Gyaan Coins</Text>
            </TouchableOpacity>
          </View>
        )}

        {!result && !loading && (
          <View style={styles.modulesSection}>
            <Text style={styles.sectionTitle}>Featured SEBI Learning Modules</Text>
            
            <View style={styles.moduleCard}>
              <View style={styles.moduleIconWrap}>
                <BookOpen color="#1b3a6b" size={22} />
              </View>
              <View style={styles.moduleTextWrap}>
                <Text style={styles.moduleTitle}>Securities Markets</Text>
                <Text style={styles.moduleDesc}>Stock exchanges, clearing corporations, and depositories.</Text>
              </View>
            </View>

            <View style={styles.moduleCard}>
              <View style={styles.moduleIconWrapGreen}>
                <ShieldCheck color="#16a34a" size={22} />
              </View>
              <View style={styles.moduleTextWrap}>
                <Text style={styles.moduleTitle}>KYC Procedure & Rights</Text>
                <Text style={styles.moduleDesc}>DigiLocker e-KYC and SCORES 2.0 grievance rights.</Text>
              </View>
            </View>

            <View style={styles.moduleCard}>
              <View style={styles.moduleIconWrapAmber}>
                <Award color="#d97706" size={22} />
              </View>
              <View style={styles.moduleTextWrap}>
                <Text style={styles.moduleTitle}>Mutual Funds & Debt Avenues</Text>
                <Text style={styles.moduleDesc}>Understanding asset classes, NAV, and compounding.</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  heroCard: {
    backgroundColor: '#1b3a6b',
    padding: 24,
    borderBottomRightRadius: 36,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#e2e8f0',
    fontSize: 13,
    marginTop: 4,
  },
  contentPadding: {
    padding: 16,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchLabel: {
    color: '#1b3a6b',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    height: 44,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1b3a6b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderColor: '#bfdbfe',
    borderWidth: 1.5,
    padding: 18,
    borderRadius: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resultTopic: {
    color: '#1b3a6b',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#b45309',
    fontSize: 11,
    fontWeight: 'bold',
  },
  explanation: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#f1f5f9',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  quizText: {
    color: '#1b3a6b',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modulesSection: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  moduleCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moduleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ebf3fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleIconWrapGreen: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleIconWrapAmber: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleTextWrap: {
    flex: 1,
  },
  moduleTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 'bold',
  },
  moduleDesc: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  }
});

