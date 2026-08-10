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
  Bell,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { INITIAL_SAFETY_ALERTS, SafetyAlert } from './rakshakData';

interface SafetyAlertCenterProps {
  onBack: () => void;
  onSelectAlert: (alert: SafetyAlert) => void;
}

export default function SafetyAlertCenter({
  onBack,
  onSelectAlert,
}: SafetyAlertCenterProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Portfolio' | 'Entity' | 'Content' | 'Investment'>('All');

  const categories = ['All', 'Portfolio', 'Entity', 'Content', 'Investment'] as const;

  const filteredAlerts = INITIAL_SAFETY_ALERTS.filter(
    (item) => activeFilter === 'All' || item.category === activeFilter
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Safety Alert Center</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        <Text style={styles.pageSubtitle}>
          View all historical safety notifications, risk warnings, and verification updates.
        </Text>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView} contentContainerStyle={{ alignItems: 'center' }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, activeFilter === cat ? styles.filterChipActive : null]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[styles.filterChipText, activeFilter === cat ? styles.filterChipTextActive : null]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Alert List */}
        <View style={styles.alertList}>
          {filteredAlerts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.alertCard,
                item.severity === 'High' ? styles.alertCardHigh : item.severity === 'Medium' ? styles.alertCardMedium : styles.alertCardLow,
              ]}
              activeOpacity={0.85}
              onPress={() => onSelectAlert(item)}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconCategoryRow}>
                  {item.severity === 'High' ? (
                    <ShieldAlert color="#dc2626" size={18} style={{ marginRight: 6 }} />
                  ) : item.severity === 'Medium' ? (
                    <AlertTriangle color="#d97706" size={18} style={{ marginRight: 6 }} />
                  ) : (
                    <CheckCircle2 color="#16a34a" size={18} style={{ marginRight: 6 }} />
                  )}
                  <Text style={styles.categoryTag}>{item.category}</Text>
                </View>

                <View style={styles.statusPill}>
                  <Text
                    style={[
                      styles.statusPillText,
                      item.status === 'Needs Attention' ? { color: '#b91c1c' } : { color: '#15803d' },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.alertTitle}>{item.title}</Text>
              <Text style={styles.alertSummary}>{item.summary}</Text>

              <View style={styles.cardFooterRow}>
                <Text style={styles.alertTime}>{item.timestamp}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.viewDetailsText}>View Action →</Text>
                </View>
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
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 14,
    lineHeight: 18,
  },
  filterScrollView: {
    marginBottom: 16,
    flexGrow: 0,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#1b3a6b',
    borderColor: '#1b3a6b',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  alertList: {
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  alertCardHigh: {
    borderColor: '#fca5a5',
    backgroundColor: '#fffcfc',
  },
  alertCardMedium: {
    borderColor: '#fed7aa',
    backgroundColor: '#fff7ed',
  },
  alertCardLow: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statusPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  alertSummary: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  alertTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});
