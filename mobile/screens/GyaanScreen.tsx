import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
  INITIAL_USER_STATS,
  INITIAL_BOOKMARKS,
  BookmarkItem,
} from './gyaan/gyaanData';

import GyaanHome from './gyaan/GyaanHome';
import LearnByCategory from './gyaan/LearnByCategory';
import TopicListScreen from './gyaan/TopicListScreen';
import LessonContentScreen from './gyaan/LessonContentScreen';
import QuizScreen from './gyaan/QuizScreen';
import AITutorScreen from './gyaan/AITutorScreen';
import FinancialSimulatorsScreen from './gyaan/FinancialSimulatorsScreen';
import LearningJourneyScreen from './gyaan/LearningJourneyScreen';
import BookmarksScreen from './gyaan/BookmarksScreen';
import BeforeYouInvestScreen from './gyaan/BeforeYouInvestScreen';

export type GyaanViewMode =
  | 'home'
  | 'categories'
  | 'topicList'
  | 'lesson'
  | 'quiz'
  | 'tutor'
  | 'simulators'
  | 'journey'
  | 'bookmarks'
  | 'readiness';

export default function GyaanScreen() {
  const navigation = useNavigation<any>();

  // Navigation / Screen View Mode State
  const [viewMode, setViewMode] = useState<GyaanViewMode>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('reits_invits');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('what_is_reit');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('quiz_reit_1');
  const [selectedProduct, setSelectedProduct] = useState<string>('reit');
  const [simulatorInitialTab, setSimulatorInitialTab] = useState<'sip' | 'lumpsum' | 'reit' | 'bond' | 'inflation'>('sip');
  const [searchQuery, setSearchQuery] = useState('');

  // User Stats & Points
  const [userStats, setUserStats] = useState(INITIAL_USER_STATS);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);

  // Navigation Handler
  const handleNavigate = (screen: string, params?: any) => {
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.topicId) setSelectedTopicId(params.topicId);
    if (params?.quizId) setSelectedQuizId(params.quizId);
    if (params?.productId) setSelectedProduct(params.productId);
    if (params?.simTab) setSimulatorInitialTab(params.simTab);

    switch (screen) {
      case 'home':
        setViewMode('home');
        break;
      case 'categories':
        setViewMode('categories');
        break;
      case 'topicList':
        setViewMode('topicList');
        break;
      case 'lesson':
        setViewMode('lesson');
        break;
      case 'quiz':
        setViewMode('quiz');
        break;
      case 'tutor':
        setViewMode('tutor');
        break;
      case 'simulators':
        setViewMode('simulators');
        break;
      case 'journey':
        setViewMode('journey');
        break;
      case 'bookmarks':
        setViewMode('bookmarks');
        break;
      case 'readiness':
        setViewMode('readiness');
        break;
      default:
        setViewMode('home');
    }
  };

  // Toggle Bookmark
  const handleBookmarkToggle = (topicId: string) => {
    const existing = bookmarks.find((b) => b.topicId === topicId);
    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.topicId !== topicId));
    } else {
      const newItem: BookmarkItem = {
        id: Date.now().toString(),
        topicId,
        title: topicId === 'what_is_reit' ? 'What is REIT?' : 'Financial Topic',
        category: 'REITs & InvITs',
        savedDate: 'Just now',
        type: 'Lesson',
        note: 'Review before investing.',
      };
      setBookmarks((prev) => [newItem, ...prev]);
    }
  };

  const handleUpdateNote = (id: string, note: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, note } : b))
    );
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Quiz Completion Callback
  const handleQuizComplete = (score: number, pointsEarned: number) => {
    setUserStats((prev) => ({
      ...prev,
      gyaanPoints: prev.gyaanPoints + pointsEarned,
      topicsCompleted: prev.topicsCompleted + 1,
    }));
  };

  // Bridge to Dhan Marg
  const handleProceedToMarg = (productName: string) => {
    navigation.navigate('Marg', { selectedProduct: productName });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1b3a6b" />
      <View style={styles.container}>
        {viewMode === 'home' && (
          <GyaanHome
            stats={userStats}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {viewMode === 'categories' && (
          <LearnByCategory
            onBack={() => setViewMode('home')}
            onSelectCategory={(catId) => {
              setSelectedCategoryId(catId);
              setViewMode('topicList');
            }}
            initialSearchQuery={searchQuery}
          />
        )}

        {viewMode === 'topicList' && (
          <TopicListScreen
            categoryId={selectedCategoryId}
            onBack={() => setViewMode('categories')}
            onSelectTopic={(tId) => {
              setSelectedTopicId(tId);
              setViewMode('lesson');
            }}
          />
        )}

        {viewMode === 'lesson' && (
          <LessonContentScreen
            topicId={selectedTopicId}
            onBack={() => setViewMode('topicList')}
            onStartQuiz={(qId) => {
              setSelectedQuizId(qId);
              setViewMode('quiz');
            }}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={!!bookmarks.find((b) => b.topicId === selectedTopicId)}
          />
        )}

        {viewMode === 'quiz' && (
          <QuizScreen
            quizId={selectedQuizId}
            onBack={() => setViewMode('lesson')}
            onQuizComplete={handleQuizComplete}
            onNavigateToSimulator={() => {
              setSimulatorInitialTab('reit');
              setViewMode('simulators');
            }}
            onNavigateToReadiness={() => {
              setSelectedProduct('reit');
              setViewMode('readiness');
            }}
          />
        )}

        {viewMode === 'tutor' && (
          <AITutorScreen
            onBack={() => setViewMode('home')}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              setViewMode('lesson');
            }}
          />
        )}

        {viewMode === 'simulators' && (
          <FinancialSimulatorsScreen
            onBack={() => setViewMode('home')}
            initialTab={simulatorInitialTab}
            onNavigateToReadiness={() => {
              setSelectedProduct('reit');
              setViewMode('readiness');
            }}
          />
        )}

        {viewMode === 'journey' && (
          <LearningJourneyScreen
            onBack={() => setViewMode('home')}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              setViewMode('lesson');
            }}
          />
        )}

        {viewMode === 'bookmarks' && (
          <BookmarksScreen
            bookmarks={bookmarks}
            onBack={() => setViewMode('home')}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              setViewMode('lesson');
            }}
            onUpdateNote={handleUpdateNote}
            onRemoveBookmark={handleRemoveBookmark}
          />
        )}

        {viewMode === 'readiness' && (
          <BeforeYouInvestScreen
            initialProduct={selectedProduct}
            onBack={() => setViewMode('home')}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              setViewMode('lesson');
            }}
            onProceedToMarg={handleProceedToMarg}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1b3a6b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
