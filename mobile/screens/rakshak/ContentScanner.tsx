import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  ScanSearch,
  Upload,
  FileText,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';
import { PRESET_SCAM_EXAMPLES } from './rakshakData';

interface ContentScannerProps {
  onBack: () => void;
  onScanComplete: (inputText: string) => void;
}

export default function ContentScanner({
  onBack,
  onScanComplete,
}: ContentScannerProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'screenshot'>('text');

  const handleScan = (textToScan?: string) => {
    const text = textToScan || inputText;
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onScanComplete(text.trim());
    }, 700);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Check Investment Content</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        <Text style={styles.pageSubtitle}>
          Have you received an investment message or offer you're unsure about? Scan text or screenshots for risk signals.
        </Text>

        {/* Input Method Segmented Control */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'text' ? styles.segmentBtnActive : null]}
            onPress={() => setActiveTab('text')}
          >
            <FileText color={activeTab === 'text' ? '#1b3a6b' : '#64748b'} size={18} style={{ marginRight: 6 }} />
            <Text style={[styles.segmentText, activeTab === 'text' ? styles.segmentTextActive : null]}>
              Paste Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'screenshot' ? styles.segmentBtnActive : null]}
            onPress={() => setActiveTab('screenshot')}
          >
            <Upload color={activeTab === 'screenshot' ? '#1b3a6b' : '#64748b'} size={18} style={{ marginRight: 6 }} />
            <Text style={[styles.segmentText, activeTab === 'screenshot' ? styles.segmentTextActive : null]}>
              Upload Screenshot
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'text' ? (
          /* Paste Text Mode */
          <View style={styles.scannerCard}>
            <Text style={styles.inputLabel}>Paste investment message, advertisement, or post</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Paste WhatsApp message, Telegram tip, or email here..."
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              value={inputText}
              onChangeText={setInputText}
            />

            <TouchableOpacity
              style={styles.scanButton}
              activeOpacity={0.85}
              onPress={() => handleScan()}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <ScanSearch color="#ffffff" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.scanBtnText}>Analyze Investment Content</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Upload Screenshot Mode */
          <View style={styles.scannerCard}>
            <Text style={styles.inputLabel}>Upload promotional image or chat screenshot</Text>
            <TouchableOpacity
              style={styles.uploadDropZone}
              activeOpacity={0.8}
              onPress={() => handleScan(PRESET_SCAM_EXAMPLES[0].text)}
            >
              <View style={styles.uploadIconCircle}>
                <Upload color="#2563eb" size={24} />
              </View>
              <Text style={styles.uploadTitle}>Tap to select screenshot from gallery</Text>
              <Text style={styles.uploadSub}>Supports PNG, JPG (Max 5MB)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Preset Test Examples */}
        <Text style={styles.sectionTitle}>Or test with suspicious sample messages</Text>
        <Text style={styles.sectionSub}>Quick test cases to evaluate AI scam detection algorithms</Text>

        <View style={styles.presetList}>
          {PRESET_SCAM_EXAMPLES.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.presetCard}
              activeOpacity={0.85}
              onPress={() => {
                setInputText(item.text);
                handleScan(item.text);
              }}
            >
              <View style={styles.presetHeaderRow}>
                <AlertTriangle color="#dc2626" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.presetTitle}>{item.title}</Text>
              </View>
              <Text style={styles.presetText} numberOfLines={2}>
                "{item.text}"
              </Text>
              <View style={styles.testNowRow}>
                <Text style={styles.testNowText}>Analyze Message →</Text>
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
    marginBottom: 16,
    lineHeight: 18,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentTextActive: {
    color: '#1b3a6b',
    fontWeight: 'bold',
  },
  scannerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 13,
    color: '#0f172a',
    minHeight: 120,
    marginBottom: 14,
  },
  scanButton: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  uploadDropZone: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  uploadSub: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 4,
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
  presetList: {
    marginBottom: 20,
  },
  presetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  presetTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  presetText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  testNowRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  testNowText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
  },
});
