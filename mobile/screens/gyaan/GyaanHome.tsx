import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  BookOpen,
  Award,
  Flame,
  Search,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Sliders,
  Bookmark,
  ShieldCheck,
  Building2,
  TrendingUp,
  Landmark,
  PieChart,
  ChevronRight,
  Zap,
} from 'lucide-react-native';
import { CATEGORIES_DATA } from './gyaanData';

interface GyaanHomeProps {
  stats: {
    gyaanPoints: number;
    topicsCompleted: number;
    learningStreak: number;
  };
  onNavigate: (screen: string, params?: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function GyaanHome({
  stats,
  onNavigate,
  searchQuery,
  setSearchQuery,
}: GyaanHomeProps) {
  const getIcon = (iconName: string, color: string) => {
    const props = { size: 22, color };
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'PieChart': return <PieChart {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      default: return <BookOpen {...props} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>Financial Hub</Text>
            </View>
            <Text style={styles.brandSubtitle}>
              Learn • Understand • Verify • Invest
            </Text>
          </View>
          <TouchableOpacity
            style={styles.streakBadge}
            onPress={() => onNavigate('journey')}
          >
            <Flame size={16} color="#ea580c" />
            <Text style={styles.streakText}>{stats.learningStreak} Days</Text>
          </TouchableOpacity>
        </View>

        {/* Gamification Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Award size={18} color="#eab308" />
            <Text style={styles.statVal}>{stats.gyaanPoints}</Text>
            <Text style={styles.statLbl}>Gyaan Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <BookOpen size={18} color="#3b82f6" />
            <Text style={styles.statVal}>{stats.topicsCompleted}</Text>
            <Text style={styles.statLbl}>Topics Mastered</Text>
          </View>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => onNavigate('journey')}
          >
            <Sparkles size={18} color="#10b981" />
            <Text style={styles.statVal}>Stage 2</Text>
            <Text style={styles.statLbl}>Learning Journey</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search REITs, Mutual Funds, Bonds, Tax..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length > 0) onNavigate('categories');
            }}
          />
        </View>
      </View>

      {/* Recommended Next Action — Continue Learning Loop */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
      </View>

      <TouchableOpacity
        style={styles.continueCard}
        onPress={() => onNavigate('lesson', { topicId: 'what_is_reit' })}
        activeOpacity={0.85}
      >
        <View style={styles.continueBadgeRow}>
          <View style={styles.continueTag}>
            <Text style={styles.continueTagText}>RECOMMENDED ACTION</Text>
          </View>
          <Text style={styles.timeTag}>3 min left</Text>
        </View>

        <Text style={styles.continueTopicTitle}>Risk vs Return in REITs</Text>
        <Text style={styles.continueTopicSub}>
          Part 2 of 5 • Learn how rental cash flows buffer market volatility
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: '40%' }]} />
        </View>

        <View style={styles.continueFooter}>
          <View style={styles.pointsPill}>
            <Award size={14} color="#ca8a04" />
            <Text style={styles.pointsText} numberOfLines={1}>+10 Gyaan Points on completion</Text>
          </View>
          <View style={styles.resumeBtn}>
            <PlayCircle size={16} color="#ffffff" />
            <Text style={styles.resumeBtnText}>Resume Lesson</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Quick Access Grid Shortcuts */}
      <View style={styles.shortcutsGrid}>
        <TouchableOpacity
          style={[styles.shortcutCard, { backgroundColor: '#eff6ff' }]}
          onPress={() => onNavigate('tutor')}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: '#2563eb' }]}>
            <Sparkles size={20} color="#ffffff" />
          </View>
          <Text style={styles.shortcutTitle}>AI Tutor</Text>
          <Text style={styles.shortcutSub}>Ask in Hindi/Eng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shortcutCard, { backgroundColor: '#f0fdf4' }]}
          onPress={() => onNavigate('simulators')}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: '#16a34a' }]}>
            <Sliders size={20} color="#ffffff" />
          </View>
          <Text style={styles.shortcutTitle}>Simulators</Text>
          <Text style={styles.shortcutSub}>SIP & Yield Calc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shortcutCard, { backgroundColor: '#faf5ff' }]}
          onPress={() => onNavigate('journey')}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: '#9333ea' }]}>
            <Award size={20} color="#ffffff" />
          </View>
          <Text style={styles.shortcutTitle}>Journey</Text>
          <Text style={styles.shortcutSub}>Stage 1 to 5</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shortcutCard, { backgroundColor: '#fff7ed' }]}
          onPress={() => onNavigate('bookmarks')}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: '#ea580c' }]}>
            <Bookmark size={20} color="#ffffff" />
          </View>
          <Text style={styles.shortcutTitle}>Saved</Text>
          <Text style={styles.shortcutSub}>Lessons & Notes</Text>
        </TouchableOpacity>
      </View>

      {/* Mandatory Before You Invest Readiness Banner */}
      <TouchableOpacity
        style={styles.readinessBanner}
        onPress={() => onNavigate('readiness', { productId: 'reit' })}
        activeOpacity={0.85}
      >
        <View style={styles.readinessLeft}>
          <View style={styles.readinessShield}>
            <ShieldCheck size={22} color="#0284c7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.readinessTitle}>Before You Invest — Gatekeeper</Text>
            <Text style={styles.readinessDesc}>
              Check mandatory SEBI knowledge readiness before allocating to REITs or Bonds.
            </Text>
          </View>
        </View>
        <View style={styles.readinessRight}>
          <Text style={styles.readinessPct}>80%</Text>
          <ChevronRight size={18} color="#0284c7" />
        </View>
      </TouchableOpacity>

      {/* Learn by Category Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Learn by Category</Text>
          <Text style={styles.sectionSub}>12 SEBI-aligned financial education modules</Text>
        </View>
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={() => onNavigate('categories')}
        >
          <Text style={styles.seeAllText}>See all 12</Text>
          <ArrowRight size={14} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Category Horizontal Scroll Preview */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {CATEGORIES_DATA.slice(0, 6).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.catCard}
            onPress={() => onNavigate('topicList', { categoryId: cat.id })}
          >
            <View style={[styles.catIconBox, { backgroundColor: cat.color + '15' }]}>
              {getIcon(cat.iconName, cat.color)}
            </View>
            <Text style={styles.catName} numberOfLines={1}>
              {cat.name}
            </Text>
            <Text style={styles.catCount}>{cat.topicCount} Topics</Text>
            <View style={styles.catProgressRow}>
              <View style={styles.catProgressTrack}>
                <View
                  style={[
                    styles.catProgressBar,
                    {
                      width: `${Math.round((cat.completedCount / cat.topicCount) * 100)}%`,
                      backgroundColor: cat.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.catPct}>
                {Math.round((cat.completedCount / cat.topicCount) * 100)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>



      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerCard: {
    backgroundColor: '#1b3a6b',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff7ed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexShrink: 0,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#c2410c',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  statLbl: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  continueCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  continueBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  continueTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1e40af',
  },
  timeTag: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  continueTopicTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 10,
  },
  continueTopicSub: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  continueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef9c3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#854d0e',
    flex: 1,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    flexShrink: 0,
  },
  resumeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 16,
    gap: 8,
  },
  shortcutCard: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  shortcutSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  readinessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0f2fe',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  readinessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  readinessShield: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readinessTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
  },
  readinessDesc: {
    fontSize: 11,
    color: '#0c4a6e',
    marginTop: 2,
  },
  readinessRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 8,
  },
  readinessPct: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284c7',
  },
  catScroll: {
    paddingLeft: 16,
    marginTop: 4,
  },
  catCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  catCount: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  catProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  catProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  catProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  catPct: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  darpanBridgeCard: {
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
  },
  darpanHeader: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  darpanTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#60a5fa',
  },
  darpanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 10,
  },
  darpanDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  darpanAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
  },
  darpanActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
