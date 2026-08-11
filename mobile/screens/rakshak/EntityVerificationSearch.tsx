import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Building2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react-native';

interface EntityVerificationSearchProps {
  onBack: () => void;
  onSelectEntity: (entityQuery: string) => void;
}

export default function EntityVerificationSearch({
  onBack,
  onSelectEntity,
}: EntityVerificationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleEntities = [
    { name: 'Zerodha Broking Limited', category: 'Stock Broker / DP', status: 'Verified', key: 'zerodha' },
    { name: 'ABC Investment Services', category: 'Investment Advisory', status: 'Verified', key: 'abc_investment' },
    { name: 'Nexus Select Trust', category: 'SEBI Registered REIT', status: 'Verified', key: 'nexus_reit' },
    { name: 'XYZ Investment Advisor', category: 'Registered Advisor (RIA)', status: 'Verified', key: 'xyz_advisor' },
    { name: 'ABC Wealth Group', category: 'Unregistered Entity', status: 'Unverified', key: 'abc_wealth' },
  ];

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSelectEntity(searchQuery.trim());
    }, 600);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <ArrowLeft color="#ffffff" size={20} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Verify an Entity</Text>
          <Text style={styles.headerSub}>SEBI Registration Check</Text>
        </View>
        <View style={styles.headerBadge}>
          <ShieldCheck color="#ffffff" size={12} />
          <Text style={styles.headerBadgeText}>SEBI</Text>
        </View>
      </View>

      <View style={styles.contentPadding}>
        <Text style={styles.pageSubtitle}>
          Verify whether an investment platform, broker, advisor, or intermediary is registered with SEBI.
        </Text>

        {/* Search Input Box */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>Search company, intermediary, or advisor</Text>
          <View style={styles.inputContainer}>
            <Search color="#64748b" size={20} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Zerodha, ABC Services, XYZ Advisor..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            activeOpacity={0.85}
            onPress={handleSearchSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Search color="#ffffff" size={18} style={{ marginRight: 6 }} />
                <Text style={styles.searchBtnText}>Search SEBI Directory</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Sample Examples */}
        <Text style={styles.sectionTitle}>Try verifying sample entities</Text>
        <Text style={styles.sectionSub}>Test both positive & negative verification paths for demonstration</Text>

        <View style={styles.sampleList}>
          {sampleEntities.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.sampleCard,
                item.status === 'Unverified' ? styles.sampleCardUnverified : null,
              ]}
              activeOpacity={0.85}
              onPress={() => onSelectEntity(item.name)}
            >
              <View style={styles.sampleIconBg}>
                <Building2 color={item.status === 'Unverified' ? '#dc2626' : '#2563eb'} size={20} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sampleName}>{item.name}</Text>
                <Text style={styles.sampleCategory}>{item.category}</Text>
              </View>

              {item.status === 'Verified' ? (
                <View style={styles.verifiedTag}>
                  <CheckCircle2 color="#16a34a" size={12} style={{ marginRight: 3 }} />
                  <Text style={styles.verifiedTagText}>Verified</Text>
                </View>
              ) : (
                <View style={styles.unverifiedTag}>
                  <AlertTriangle color="#dc2626" size={12} style={{ marginRight: 3 }} />
                  <Text style={styles.unverifiedTagText}>Unverified</Text>
                </View>
              )}
              <ChevronRight color="#94a3b8" size={18} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* SEBI Compliance Footnote */}
        <View style={styles.footnoteBox}>
          <ShieldCheck color="#2563eb" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.footnoteText}>
            Cross-checks names and registration IDs against SEBI public registrar records for investor protection.
          </Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 16,
    backgroundColor: '#1b3a6b',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 11.5,
    color: '#bfdbfe',
  },
  headerBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  contentPadding: {
    padding: 16,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 18,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  searchButton: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  sampleList: {
    marginBottom: 20,
  },
  sampleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sampleCardUnverified: {
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
  },
  sampleIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sampleCategory: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  unverifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unverifiedTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  footnoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  footnoteText: {
    fontSize: 11,
    color: '#1e40af',
    flex: 1,
    lineHeight: 15,
  },
});
