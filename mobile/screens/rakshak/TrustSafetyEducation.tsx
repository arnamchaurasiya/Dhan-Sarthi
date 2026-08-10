import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  PieChart,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react-native';
import { SAFETY_EDUCATION_ARTICLES } from './rakshakData';

interface TrustSafetyEducationProps {
  onBack: () => void;
  onNavigateGyaanTopic: (topicId: string) => void;
}

export default function TrustSafetyEducation({
  onBack,
  onNavigateGyaanTopic,
}: TrustSafetyEducationProps) {
  const categoriesList = [
    '• Common investment scams',
    '• Fake investment platforms',
    '• Guaranteed return claims',
    '• Impersonation scams',
    '• Fake advisors',
    '• Unverified investment offers',
    '• How to verify an intermediary',
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Trust & Safety Education</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Banner Bridge */}
        <View style={styles.heroBanner}>
          <View style={styles.heroRow}>
            <View style={styles.bookIconBg}>
              <BookOpen color="#ffffff" size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.heroSubTag}>CONNECTED TO DHAN GYAAN</Text>
              <Text style={styles.heroTitle}>Stay Safe While Investing</Text>
            </View>
          </View>

          <Text style={styles.heroDesc}>
            Dhan Rakshak partners with Dhan Gyaan to provide actionable guides on spotting fraudulent offers, verifying registration, and exercising your investor rights under SEBI mandates.
          </Text>
        </View>

        {/* Categories List Box */}
        <View style={styles.categoriesBox}>
          <Text style={styles.catHeader}>Key Safety Topics Covered</Text>
          <View style={styles.catGrid}>
            {categoriesList.map((item, idx) => (
              <View key={idx} style={styles.catItem}>
                <Text style={styles.catText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Educational Articles List */}
        <Text style={styles.sectionTitle}>Featured Safety Guides</Text>

        <View style={styles.articleList}>
          {SAFETY_EDUCATION_ARTICLES.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              activeOpacity={0.85}
              onPress={() => onNavigateGyaanTopic(article.gyaanTopicId)}
            >
              <View style={styles.articleTopRow}>
                <View style={styles.articleIconCircle}>
                  <BookOpen color="#2563eb" size={18} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.readTime}>{article.readTime}</Text>
                </View>
                <ChevronRight color="#94a3b8" size={18} />
              </View>

              <Text style={styles.articleSubtitle}>{article.subtitle}</Text>

              <View style={styles.bulletBox}>
                {article.bullets.map((b, i) => (
                  <Text key={i} style={styles.bulletText}>
                    • {b}
                  </Text>
                ))}
              </View>

              <View style={styles.gyaanBridgeFooter}>
                <Text style={styles.bridgeLinkText}>Read Full Guide in Dhan Gyaan →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  subHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
  },
  subHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1b3a6b',
  },
  contentPadding: {
    padding: 16,
  },
  heroBanner: {
    backgroundColor: '#1b3a6b',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSubTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#93c5fd',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  heroDesc: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 17,
  },
  categoriesBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  catHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  catGrid: {
    flexDirection: 'column',
  },
  catItem: {
    paddingVertical: 4,
  },
  catText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  articleList: {
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  articleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  readTime: {
    fontSize: 11,
    color: '#64748b',
  },
  articleSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 16,
  },
  bulletBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 11,
    color: '#334155',
    marginBottom: 4,
    lineHeight: 15,
  },
  gyaanBridgeFooter: {
    alignItems: 'flex-end',
  },
  bridgeLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});
