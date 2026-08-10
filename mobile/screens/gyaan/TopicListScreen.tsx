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
  CheckCircle2,
  Clock,
  Lock,
  Award,
  ChevronRight,
  PlayCircle,
  BookOpen,
} from 'lucide-react-native';
import { CATEGORIES_DATA, TOPICS_BY_CATEGORY, Topic } from './gyaanData';

interface TopicListScreenProps {
  categoryId: string;
  onBack: () => void;
  onSelectTopic: (topicId: string) => void;
}

export default function TopicListScreen({
  categoryId,
  onBack,
  onSelectTopic,
}: TopicListScreenProps) {
  const category = CATEGORIES_DATA.find((c) => c.id === categoryId) || CATEGORIES_DATA[4]; // fallback REITs
  const topics: Topic[] = TOPICS_BY_CATEGORY[categoryId] || TOPICS_BY_CATEGORY['reits_invits'];

  const completedCount = topics.filter((t) => t.status === 'completed').length;
  const progressPct = Math.round((completedCount / topics.length) * 100);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerCategoryName}>{category.name}</Text>
          <Text style={styles.headerCategorySub}>
            Curriculum • {topics.length} Lessons
          </Text>
        </View>

        <View style={styles.pointsBadge}>
          <Award size={14} color="#fef08a" />
          <Text style={styles.pointsBadgeText}>+{topics.length * 10} Pts</Text>
        </View>
      </View>

      {/* Progress Banner */}
      <View style={styles.progressCard}>
        <View style={styles.progressTopRow}>
          <Text style={styles.progressLabel}>Category Completion</Text>
          <Text style={styles.progressPctText}>{progressPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPct}%`, backgroundColor: category.color },
            ]}
          />
        </View>
        <Text style={styles.progressSubText}>
          {completedCount} of {topics.length} topics finished. Complete lessons to unlock quizzes!
        </Text>
      </View>

      {/* Topics List */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>CURRICULUM TOPICS</Text>

        {topics.map((topic, index) => {
          const isLocked = topic.status === 'locked';
          const isCompleted = topic.status === 'completed';
          const isInProgress = topic.status === 'in_progress';

          return (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicCard,
                isLocked && styles.topicCardLocked,
                isInProgress && styles.topicCardActive,
              ]}
              disabled={isLocked}
              onPress={() => onSelectTopic(topic.id)}
              activeOpacity={0.8}
            >
              {/* Status Indicator Icon */}
              <View style={styles.statusCol}>
                {isCompleted ? (
                  <View style={styles.statusCheck}>
                    <CheckCircle2 size={20} color="#16a34a" />
                  </View>
                ) : isInProgress ? (
                  <View style={styles.statusProgressDot}>
                    <View style={styles.innerDot} />
                  </View>
                ) : isLocked ? (
                  <View style={styles.statusLock}>
                    <Lock size={18} color="#94a3b8" />
                  </View>
                ) : (
                  <View style={styles.statusUnlockedDot} />
                )}
              </View>

              {/* Content */}
              <View style={styles.topicContentCol}>
                <View style={styles.topicMetaRow}>
                  <Text style={styles.lessonNum}>LESSON 0{index + 1}</Text>
                  <View style={styles.readTimeRow}>
                    <Clock size={12} color="#64748b" />
                    <Text style={styles.readTimeText}>{topic.readTime}</Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.topicTitle,
                    isLocked && styles.topicTitleLocked,
                  ]}
                >
                  {topic.title}
                </Text>

                <Text style={styles.topicSummary} numberOfLines={2}>
                  {topic.summary}
                </Text>

                {isLocked && topic.unlockRequirement && (
                  <View style={styles.unlockNotice}>
                    <Lock size={12} color="#94a3b8" />
                    <Text style={styles.unlockNoticeText}>
                      {topic.unlockRequirement}
                    </Text>
                  </View>
                )}
              </View>

              {/* Action */}
              <View style={styles.actionCol}>
                {isCompleted ? (
                  <View style={styles.completedTag}>
                    <Text style={styles.completedTagText}>✓ Quiz Done</Text>
                  </View>
                ) : isLocked ? (
                  <Lock size={16} color="#cbd5e1" />
                ) : (
                  <View style={styles.startBtn}>
                    <PlayCircle size={16} color="#ffffff" />
                    <Text style={styles.startBtnText}>Start</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Post-Topic Completion Loop Callout */}
        <View style={styles.loopNoticeCard}>
          <BookOpen size={20} color="#2563eb" />
          <View style={{ flex: 1 }}>
            <Text style={styles.loopTitle}>The Dhan Gyaan Learning Loop</Text>
            <Text style={styles.loopDesc}>
              Read Lesson (+10 Pts) ➔ Take Quick Quiz (+50 Pts) ➔ Simulate Cash Flow ➔ Check Readiness!
            </Text>
          </View>
        </View>

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flex: 1,
    marginLeft: 12,
  },
  headerCategoryName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerCategorySub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fef08a',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  progressPctText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
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
  progressSubText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topicCardActive: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f6ff',
  },
  topicCardLocked: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    opacity: 0.7,
  },
  statusCol: {
    marginRight: 12,
    paddingTop: 2,
  },
  statusCheck: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusProgressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
  statusUnlockedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94a3b8',
  },
  statusLock: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicContentCol: {
    flex: 1,
  },
  topicMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lessonNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563eb',
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 11,
    color: '#64748b',
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  topicTitleLocked: {
    color: '#64748b',
  },
  topicSummary: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  unlockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  unlockNoticeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  actionCol: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  completedTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  loopNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  loopTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
  },
  loopDesc: {
    fontSize: 11,
    color: '#1e3a8a',
    marginTop: 2,
    lineHeight: 15,
  },
});
