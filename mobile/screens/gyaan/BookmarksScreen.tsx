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
  Bookmark,
  BookOpen,
  FileText,
  PlayCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
} from 'lucide-react-native';
import { BookmarkItem } from './gyaanData';

interface BookmarksScreenProps {
  bookmarks: BookmarkItem[];
  onBack: () => void;
  onNavigateToTopic: (topicId: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onRemoveBookmark: (id: string) => void;
}

export default function BookmarksScreen({
  bookmarks,
  onBack,
  onNavigateToTopic,
  onUpdateNote,
  onRemoveBookmark,
}: BookmarksScreenProps) {
  const [filter, setFilter] = useState<'All' | 'Lesson' | 'Article' | 'Notes'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  const filtered = bookmarks.filter((b) => {
    if (filter === 'Lesson') return b.type === 'Lesson';
    if (filter === 'Article') return b.type === 'Article';
    if (filter === 'Notes') return !!b.note;
    return true;
  });

  const handleStartEditing = (item: BookmarkItem) => {
    setEditingId(item.id);
    setEditingNoteText(item.note || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, editingNoteText);
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Bookmarks & Saved Notes</Text>
          <Text style={styles.headerSub}>Your Personal Financial Knowledge Library</Text>
        </View>
        <Bookmark size={22} color="#ea580c" fill="#ea580c" />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterBar}>
        {(['All', 'Lesson', 'Article', 'Notes'] as const).map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, filter === chip && styles.chipActive]}
            onPress={() => setFilter(chip)}
          >
            <Text style={[styles.chipText, filter === chip && styles.chipTextActive]}>
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookmarks List */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Bookmark size={40} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No Bookmarked Content Yet</Text>
            <Text style={styles.emptySub}>
              Tap the bookmark icon while reading any lesson to save it to your personal library!
            </Text>
          </View>
        ) : (
          filtered.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.dateText}>{item.savedDate}</Text>
              </View>

              <TouchableOpacity onPress={() => onNavigateToTopic(item.topicId)}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>

              {/* Personal Note Area */}
              {editingId === item.id ? (
                <View style={styles.editNoteBox}>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="Add personal note (e.g. review before investing)..."
                    value={editingNoteText}
                    onChangeText={setEditingNoteText}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.saveNoteBtn}
                    onPress={() => handleSaveNote(item.id)}
                  >
                    <Check size={14} color="#ffffff" />
                    <Text style={styles.saveNoteText}>Save Note</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noteDisplayBox}>
                  {item.note ? (
                    <Text style={styles.noteText}>📝 "{item.note}"</Text>
                  ) : (
                    <Text style={styles.noNoteText}>No personal note added yet.</Text>
                  )}
                  <TouchableOpacity
                    style={styles.editIconBtn}
                    onPress={() => handleStartEditing(item)}
                  >
                    <Edit3 size={14} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Card Actions */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.openLessonBtn}
                  onPress={() => onNavigateToTopic(item.topicId)}
                >
                  <BookOpen size={14} color="#ffffff" />
                  <Text style={styles.openLessonText}>Open Lesson</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemoveBookmark(item.id)}
                >
                  <Trash2 size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

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
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  chipActive: {
    backgroundColor: '#ea580c',
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
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#c2410c',
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  noteDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  noteText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    flex: 1,
  },
  noNoteText: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  editIconBtn: {
    padding: 4,
  },
  editNoteBox: {
    marginTop: 10,
  },
  noteInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#2563eb',
    minHeight: 50,
  },
  saveNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  saveNoteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  openLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  openLessonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  removeBtn: {
    padding: 8,
  },
});
