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
  Award,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { LEARNING_JOURNEY_STAGES, JourneyStage } from './gyaanData';

interface LearningJourneyScreenProps {
  onBack: () => void;
  onNavigateToTopic: (topicId: string) => void;
}

export default function LearningJourneyScreen({
  onBack,
  onNavigateToTopic,
}: LearningJourneyScreenProps) {
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Learning Journey Roadmap</Text>
          <Text style={styles.headerSub}>Structured Pathway to Investor Mastery</Text>
        </View>
        <Award size={22} color="#fef08a" />
      </View>

      {/* Hero Badge Banner */}
      <View style={styles.badgeBanner}>
        <Sparkles size={22} color="#2563eb" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.badgeTitle}>Current Level: Stage 2 — Investment Options</Text>
          <Text style={styles.badgeSub}>
            Complete REITs & Bonds lessons to unlock Stage 3 Risk & Allocation!
          </Text>
        </View>
      </View>

      {/* Stage Progression Roadmap */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {LEARNING_JOURNEY_STAGES.map((stage: JourneyStage, idx: number) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          const isLocked = stage.status === 'locked';

          return (
            <View key={stage.id} style={styles.stageWrapper}>
              {/* Timeline Connector Line */}
              {idx < LEARNING_JOURNEY_STAGES.length - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    isCompleted && styles.connectorLineDone,
                  ]}
                />
              )}

              {/* Node Icon */}
              <View
                style={[
                  styles.nodeCircle,
                  isCompleted && styles.nodeDone,
                  isCurrent && styles.nodeCurrent,
                  isLocked && styles.nodeLocked,
                ]}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} color="#ffffff" />
                ) : isCurrent ? (
                  <View style={styles.currentInnerDot} />
                ) : (
                  <Lock size={16} color="#94a3b8" />
                )}
              </View>

              {/* Stage Card */}
              <View
                style={[
                  styles.stageCard,
                  isCurrent && styles.stageCardCurrent,
                  isLocked && styles.stageCardLocked,
                ]}
              >
                <View style={styles.stageCardHeader}>
                  <Text style={styles.stageNum}>STAGE 0{stage.id}</Text>
                  {isCompleted && (
                    <View style={styles.doneBadge}>
                      <Text style={styles.doneBadgeText}>MASTERED</Text>
                    </View>
                  )}
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>IN PROGRESS</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.stageTitle}>{stage.title}</Text>
                <Text style={styles.stageSub}>{stage.subtitle}</Text>

                {/* Topic Checklist */}
                <View style={styles.topicsList}>
                  {stage.topics.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={styles.topicRow}
                      disabled={isLocked}
                      onPress={() => onNavigateToTopic(t.id)}
                    >
                      {t.completed ? (
                        <CheckCircle2 size={16} color="#16a34a" />
                      ) : (
                        <PlayCircle size={16} color={isLocked ? '#cbd5e1' : '#2563eb'} />
                      )}
                      <Text
                        style={[
                          styles.topicRowText,
                          t.completed && styles.topicRowTextDone,
                          isLocked && styles.topicRowTextLocked,
                        ]}
                      >
                        {t.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
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
    flex: 1,
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
  badgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
  },
  badgeSub: {
    fontSize: 11,
    color: '#1e3a8a',
    marginTop: 2,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 18,
    top: 36,
    bottom: -24,
    width: 3,
    backgroundColor: '#cbd5e1',
    zIndex: 0,
  },
  connectorLineDone: {
    backgroundColor: '#16a34a',
  },
  nodeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    zIndex: 1,
  },
  nodeDone: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  nodeCurrent: {
    backgroundColor: '#2563eb',
    borderColor: '#93c5fd',
  },
  nodeLocked: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  currentInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  stageCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stageCardCurrent: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f6ff',
  },
  stageCardLocked: {
    backgroundColor: '#f8fafc',
    opacity: 0.75,
  },
  stageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
  },
  doneBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  doneBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
  },
  currentBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1e40af',
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  stageSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  topicsList: {
    gap: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topicRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  topicRowTextDone: {
    color: '#15803d',
    textDecorationLine: 'line-through',
  },
  topicRowTextLocked: {
    color: '#94a3b8',
  },
});
