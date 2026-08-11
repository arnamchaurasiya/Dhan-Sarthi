import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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

  // Stack-based view history for proper back navigation
  const [viewHistory, setViewHistory] = useState<GyaanViewMode[]>(['home']);
  const currentViewMode = viewHistory[viewHistory.length - 1] || 'home';

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('reits_invits');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('what_is_reit');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('quiz_reit_1');
  const [selectedProduct, setSelectedProduct] = useState<string>('reit');
  const [simulatorInitialTab, setSimulatorInitialTab] = useState<'sip' | 'lumpsum' | 'reit' | 'bond' | 'inflation'>('sip');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

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

    const targetMode = (screen === 'default' ? 'home' : screen) as GyaanViewMode;
    if (targetMode === 'home') {
      setViewHistory(['home']);
    } else {
      setViewHistory((prev) => [...prev, targetMode]);
    }
  };

  const handleGoBack = React.useCallback(() => {
    if (viewHistory.length > 1) {
      setViewHistory((prev) => prev.slice(0, prev.length - 1));
      return true;
    }
    return false;
  }, [viewHistory]);

  // Hardware Back Button Handler for Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (viewHistory.length > 1) {
          handleGoBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [viewHistory, handleGoBack])
  );

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
        {currentViewMode === 'home' && (
          <GyaanHome
            stats={userStats}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        )}

        {currentViewMode === 'categories' && (
          <LearnByCategory
            onBack={handleGoBack}
            onSelectCategory={(catId) => {
              setSelectedCategoryId(catId);
              handleNavigate('topicList');
            }}
            initialSearchQuery={searchQuery}
          />
        )}

        {currentViewMode === 'topicList' && (
          <TopicListScreen
            categoryId={selectedCategoryId}
            onBack={handleGoBack}
            onSelectTopic={(tId) => {
              setSelectedTopicId(tId);
              handleNavigate('lesson');
            }}
          />
        )}

        {currentViewMode === 'lesson' && (
          <LessonContentScreen
            topicId={selectedTopicId}
            onBack={handleGoBack}
            onStartQuiz={(qId) => {
              setSelectedQuizId(qId);
              handleNavigate('quiz');
            }}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={!!bookmarks.find((b) => b.topicId === selectedTopicId)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        )}

        {currentViewMode === 'quiz' && (
          <QuizScreen
            quizId={selectedQuizId}
            onBack={handleGoBack}
            onQuizComplete={handleQuizComplete}
            onNavigateToSimulator={() => {
              setSimulatorInitialTab('reit');
              handleNavigate('simulators');
            }}
            onNavigateToReadiness={() => {
              setSelectedProduct('reit');
              handleNavigate('readiness');
            }}
          />
        )}

        {currentViewMode === 'tutor' && (
          <AITutorScreen
            onBack={handleGoBack}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              handleNavigate('lesson');
            }}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        )}

        {currentViewMode === 'simulators' && (
          <FinancialSimulatorsScreen
            onBack={handleGoBack}
            initialTab={simulatorInitialTab}
            onNavigateToReadiness={() => {
              setSelectedProduct('reit');
              handleNavigate('readiness');
            }}
          />
        )}

        {currentViewMode === 'journey' && (
          <LearningJourneyScreen
            onBack={handleGoBack}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              handleNavigate('lesson');
            }}
          />
        )}

        {currentViewMode === 'bookmarks' && (
          <BookmarksScreen
            bookmarks={bookmarks}
            onBack={handleGoBack}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              handleNavigate('lesson');
            }}
            onUpdateNote={handleUpdateNote}
            onRemoveBookmark={handleRemoveBookmark}
          />
        )}

        {currentViewMode === 'readiness' && (
          <BeforeYouInvestScreen
            initialProduct={selectedProduct}
            onBack={handleGoBack}
            onNavigateToTopic={(tId) => {
              setSelectedTopicId(tId);
              handleNavigate('lesson');
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