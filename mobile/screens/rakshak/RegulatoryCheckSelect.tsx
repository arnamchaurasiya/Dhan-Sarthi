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
  FileCheck,
  Building2,
  UserCheck,
  Compass,
  MonitorCheck,
  BadgeCheck,
  ChevronRight,
  Shield,
} from 'lucide-react-native';

interface RegulatoryCheckSelectProps {
  onBack: () => void;
  onProceed: (type: string, details: string) => void;
}

export default function RegulatoryCheckSelect({
  onBack,
  onProceed,
}: RegulatoryCheckSelectProps) {
  const [selectedType, setSelectedType] = useState('entity');
  const [entityQuery, setEntityQuery] = useState('ABC Investment Services');

  const options = [
    { id: 'entity', title: 'Investment Entity', desc: 'Verify stock broker, depository participant, or AMC', icon: Building2 },
    { id: 'advisor', title: 'Investment Advisor', desc: 'Verify SEBI Registered Investment Adviser (RIA)', icon: UserCheck },
    { id: 'product', title: 'Investment Product', desc: 'Verify REIT, InvIT, Mutual Fund, or Bond registration', icon: Compass },
    { id: 'platform', title: 'Platform / App', desc: 'Verify digital trading or wealth management application', icon: MonitorCheck },
    { id: 'reg_details', title: 'Registration Details', desc: 'Direct lookup by SEBI Registration Number (e.g. INZ...)', icon: BadgeCheck },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Regulatory Check</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        <Text style={styles.pageSubtitle}>
          Select what you would like to verify against official regulatory registration databases.
        </Text>

        <Text style={styles.sectionTitle}>What would you like to verify?</Text>

        {/* Radio Option List */}
        <View style={styles.optionList}>
          {options.map((opt) => {
            const IconComp = opt.icon;
            const isSelected = selectedType === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionCard, isSelected ? styles.optionCardSelected : null]}
                activeOpacity={0.85}
                onPress={() => setSelectedType(opt.id)}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={[styles.iconBg, isSelected ? { backgroundColor: '#dbeafe' } : null]}>
                  <IconComp color={isSelected ? '#2563eb' : '#64748b'} size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.optionTitle, isSelected ? { color: '#1e40af' } : null]}>
                    {opt.title}
                  </Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Details Input Box */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Enter Name or SEBI Registration Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. ABC Investment Services or INA000012345"
            placeholderTextColor="#94a3b8"
            value={entityQuery}
            onChangeText={setEntityQuery}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() => onProceed(selectedType, entityQuery)}
        >
          <Text style={styles.continueBtnText}>Continue Regulatory Check</Text>
          <ChevronRight color="#ffffff" size={18} />
        </TouchableOpacity>
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
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  optionList: {
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  optionDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 13,
    color: '#0f172a',
  },
  continueBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
});
