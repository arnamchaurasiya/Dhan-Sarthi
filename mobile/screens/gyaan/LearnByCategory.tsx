import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  BookOpen,
  TrendingUp,
  PieChart,
  Landmark,
  Building2,
  Zap,
  Coins,
  ShieldCheck,
  BarChart3,
  ShieldAlert,
  Sliders,
  Award,
  ChevronRight,
} from 'lucide-react-native';
import { CATEGORIES_DATA, Category } from './gyaanData';

interface LearnByCategoryProps {
  onBack: () => void;
  onSelectCategory: (categoryId: string) => void;
  initialSearchQuery?: string;
}

export default function LearnByCategory({
  onBack,
  onSelectCategory,
  initialSearchQuery = '',
}: LearnByCategoryProps) {
  const [search, setSearch] = useState(initialSearchQuery);
  const [filter, setFilter] = useState<'All' | 'Popular' | 'In Progress'>('All');

  const getIcon = (iconName: string, color: string) => {
    const props = { size: 24, color };
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'PieChart': return <PieChart {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Sliders': return <Sliders {...props} />;
      case 'Award': return <Award {...props} />;
      default: return <BookOpen {...props} />;
    }
  };

  const filteredCategories = CATEGORIES_DATA.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'Popular') return cat.popular;
    if (filter === 'In Progress') return cat.completedCount > 0 && cat.completedCount < cat.topicCount;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learn by Category</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Filter by subject (e.g. REITs, Tax, Debt)..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.chipRow}>
          {(['All', 'Popular', 'In Progress'] as const).map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                filter === chip && styles.chipActive,
              ]}
              onPress={() => setFilter(chip)}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === chip && styles.chipTextActive,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category List */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countLabel}>
          Showing {filteredCategories.length} Educational Subjects
        </Text>

        {filteredCategories.map((cat: Category) => {
          const pct = Math.round((cat.completedCount / cat.topicCount) * 100);
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: cat.color + '15' }]}>
                  {getIcon(cat.iconName, cat.color)}
                </View>

                <View style={styles.cardTitleBox}>
                  <View style={styles.nameRow}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    {cat.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.catDesc} numberOfLines={2}>
                    {cat.description}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.progressSection}>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.topicCountText}>
                      {cat.completedCount} of {cat.topicCount} topics completed
                    </Text>
                    <Text style={[styles.pctText, { color: cat.color }]}>
                      {pct}%
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${pct}%`, backgroundColor: cat.color },
                      ]}
                    />
                  </View>
                </View>

                <ChevronRight size={18} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          );
        })}

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
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  chipActive: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleBox: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  popularBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#d97706',
  },
  catDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  progressSection: {
    flex: 1,
    marginRight: 12,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topicCountText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  pctText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
