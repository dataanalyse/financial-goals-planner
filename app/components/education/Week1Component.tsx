"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Check, Trophy, Star, ArrowRight, ArrowLeft, RotateCcw, X, Award, Calendar, Users } from 'lucide-react';
import Badge from '../shared/Badge';
import ProgressBar from '../shared/ProgressBar';
import QuizEngine, { QuizQuestion } from '../shared/QuizEngine';
import LessonComponent, { LessonSection } from '../shared/LessonComponent';

interface Week1Props {
  onComplete: (weekNumber: number, badge: string) => void;
  onBack: () => void;
}

const Week1Component: React.FC<Week1Props> = ({ onComplete, onBack }) => {
  const [lessonStep, setLessonStep] = useState('overview'); // overview, lesson, timeline, quiz, badge
  const [timelineCompleted, setTimelineCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [moneyTimelineOrder, setMoneyTimelineOrder] = useState<string[]>(['', '', '', '', '', '']);
  const [availableItems, setAvailableItems] = useState<string[]>(['bartering', 'coins', 'paper', 'checks', 'credit', 'digital']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [weekProgress, setWeekProgress] = useState({
    lesson: false,
    timeline: false,
    quiz: false,
    badge: false
  });

  // Timeline items data - Updated to match your working version
  const timelineItems: Record<string, { name: string; emoji: string; year: string; description: string }> = {
    bartering: { name: 'Bartering', emoji: '🤝', year: 'Ancient', description: 'Trading goods directly' },
    coins: { name: 'Coins', emoji: '🪙', year: '600 BC', description: 'First metal coins' },
    paper: { name: 'Paper Money', emoji: '💵', year: '700 AD', description: 'Lightweight paper bills' },
    checks: { name: 'Checks', emoji: '📄', year: '1600s', description: 'Written payment orders' },
    credit: { name: 'Credit Cards', emoji: '💳', year: '1950s', description: 'Plastic payment cards' },
    digital: { name: 'Digital Payments', emoji: '📱', year: '2000s', description: 'Phone-based payments' }
  };

  const correctTimelineOrder = ['bartering', 'coins', 'paper', 'checks', 'credit', 'digital'];

  // Quiz questions for QuizEngine
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is bartering?",
      options: [
        "Using coins to pay for things",
        "Trading one thing for another without money",
        "Saving money in a bank"
      ],
      correct: 1,
      explanation: "Bartering is trading goods or services directly without using money!",
      hint: "Think about how people traded before money was invented.",
      difficulty: 'easy'
    },
    {
      question: "Which of these was NOT used as money in history?",
      options: [
        "Shells",
        "Rocks", 
        "Televisions"
      ],
      correct: 2,
      explanation: "TVs are too modern! Ancient people used shells, rocks, and many other things as money.",
      hint: "Think about what existed thousands of years ago.",
      difficulty: 'easy'
    },
    {
      question: "What do we call money you can't see that moves electronically?",
      options: [
        "Metal coins",
        "Digital money",
        "Paper bills"
      ],
      correct: 1,
      explanation: "Digital money exists only in computers and moves electronically between accounts!",
      hint: "When you pay with your phone, what kind of money is that?",
      difficulty: 'medium'
    },
    {
      question: "Why did people invent money?",
      options: [
        "To make trading easier",
        "Because they liked shiny coins",
        "To play games"
      ],
      correct: 0,
      explanation: "Money solved the problems of bartering and made trading much simpler for everyone!",
      hint: "Think about the problems with bartering we learned about.",
      difficulty: 'easy'
    }
  ];

  // Lesson sections for LessonComponent
  const lessonSections: LessonSection[] = [
    {
      id: 'introduction',
      title: 'Have you ever wondered...',
      type: 'story',
      content: (
        <div>
          <p className="text-lg mb-4">
            Why do we use these pieces of paper and metal to buy things? Let's discover the amazing story of money! 🤔
          </p>
          <p className="text-gray-700">
            Money is something we use every day, but have you ever stopped to think about why it exists? 
            Today we're going on a journey through time to see how money evolved from simple trading to the digital payments we use today!
          </p>
        </div>
      )
    },
    {
      id: 'before-money',
      title: 'Before Money: The Barter System',
      type: 'example',
      content: (
        <div>
          <p className="mb-4">
            Long ago, people didn't have coins or bills. Instead, they used a system called <strong>bartering</strong> - 
            trading one thing directly for another.
          </p>
          <div className="bg-orange-100 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-orange-800 mb-2">Example:</h4>
            <p className="text-orange-700">
              🍎 "I'll give you 5 apples for that loaf of bread!" <br/>
              🍞 "But I don't need apples today... I need firewood!"
            </p>
          </div>
          <p>
            This was the big problem with bartering - both people had to want what the other person had. 
            This made trading very difficult and time-consuming!
          </p>
        </div>
      )
    },
    {
      id: 'early-money',
      title: 'The First "Money"',
      type: 'story',
      content: (
        <div>
          <p className="mb-4">
            To solve the bartering problem, people started using special items that everyone wanted and valued. 
            These became the first forms of money!
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">🐚</div>
              <p className="font-semibold text-blue-800">Cowrie Shells</p>
              <p className="text-sm text-blue-600">Beautiful and rare</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">🪨</div>
              <p className="font-semibold text-green-800">Special Stones</p>
              <p className="text-sm text-green-600">Hard to find</p>
            </div>
          </div>
          <p>
            People even used cattle, beads, and salt as money! The key was that everyone agreed these things had value.
          </p>
        </div>
      )
    },
    {
      id: 'mini-story',
      title: 'Mini-Story: Trading Without Money',
      type: 'story',
      content: (
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <p className="text-green-700 italic mb-4">
            "Imagine you live 2,000 years ago. You have fresh fish, and your friend has a warm blanket you want."
          </p>
          <div className="space-y-2 mb-4">
            <p className="text-green-800 font-medium">You: "I'll give you five fish for your blanket."</p>
            <p className="text-green-800 font-medium">Friend: "I don't need fish today. I need firewood!"</p>
          </div>
          <p className="text-green-700">
            Now you have a problem! You need to find someone who wants fish AND has firewood, 
            so you can eventually get that blanket. You might need to make 3 or 4 different trades! 
            This is exactly why people invented money! 🤯
          </p>
        </div>
      )
    },
    {
      id: 'modern-money',
      title: 'Money Today',
      type: 'tip',
      content: (
        <div>
          <p className="mb-4">
            Today we have coins, bills, and even digital money! You might see your parents tap their phone 
            to pay for coffee. The money moves electronically from one account to another - like magic! ✨
          </p>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h5 className="font-bold text-blue-800 mb-3">Money helps us:</h5>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Buy what we need and want
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Save for future goals
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Trade fairly with others
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Compare the value of different things
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Simple timeline functions - Using your working logic
  const handleTimelineClick = (item: string) => {
    const nextIndex = moneyTimelineOrder.findIndex((slot) => slot === '');
    if (nextIndex === -1) return;

    const newOrder = [...moneyTimelineOrder];
    newOrder[nextIndex] = item;
    setMoneyTimelineOrder(newOrder);
    setAvailableItems(availableItems.filter((i) => i !== item));

    // Check if complete and correct
    const allFilled = newOrder.every((i) => i !== '');
    if (allFilled) {
      const isCorrect = newOrder.every((val, idx) => val === correctTimelineOrder[idx]);
      if (isCorrect) {
        setTimelineCompleted(true);
        setWeekProgress(prev => ({ ...prev, timeline: true }));
      }
    }
  };

  const resetTimeline = () => {
    setMoneyTimelineOrder(['', '', '', '', '', '']);
    setAvailableItems(['bartering', 'coins', 'paper', 'checks', 'credit', 'digital']);
    setTimelineCompleted(false);
  };

  // Quiz completion handler
  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizPassed(passed);
    if (passed) {
      setWeekProgress(prev => ({ ...prev, quiz: true }));
      setTimeout(() => {
        setLessonStep('badge');
      }, 1000);
    }
  };

  // Lesson completion handler
  const handleLessonComplete = () => {
    setWeekProgress(prev => ({ ...prev, lesson: true }));
    setLessonStep('timeline');
  };

  const getProgressSteps = () => {
    const steps = [];
    if (weekProgress.lesson) steps.push('lesson');
    if (weekProgress.timeline) steps.push('timeline');
    if (weekProgress.quiz) steps.push('quiz');
    if (weekProgress.badge) steps.push('badge');
    return steps.length;
  };

  // Render functions
  const renderOverview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Week 1: What is Money? 💰</h2>
              <p className="text-blue-100 mt-2">Discover the amazing history of money and why we use it</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Ages 13-16</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>15-20 minutes</span>
                </div>
              </div>
            </div>
            <Badge 
              badge="💰 Money Explorer"
              earned={weekProgress.badge}
              size="large"
              animation="sparkle"
            />
          </div>
        </div>

        <div className="p-6">
          {/* Progress Overview */}
          <div className="mb-6">
            <ProgressBar 
              current={getProgressSteps()} 
              total={4} 
              color="orange"
              showSteps
              stepLabels={['Learn', 'Activity', 'Quiz', 'Badge']}
              animated
            />
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.lesson ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Learn</span>
              {weekProgress.lesson && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.timeline ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Play className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Activity</span>
              {weekProgress.timeline && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.quiz ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Star className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Quiz</span>
              {weekProgress.quiz && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className={`flex items-center p-3 rounded-lg transition-all ${weekProgress.badge ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              <Award className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Badge</span>
              {weekProgress.badge && <Check className="h-4 w-4 ml-auto" />}
            </div>
          </div>

          {/* Learning Objective */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 What You'll Learn</h3>
            <p className="text-blue-700">Understand what money is, why we use it, and how it has changed over time.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setLessonStep('lesson')}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {weekProgress.lesson ? 'Review Lesson' : 'Start Your Money Journey!'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            
            {weekProgress.lesson && (
              <button
                onClick={() => setLessonStep('timeline')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center"
              >
                {weekProgress.timeline ? 'Review Timeline Game' : 'Play Timeline Game'}
                <Play className="h-5 w-5 ml-2" />
              </button>
            )}
            
            {weekProgress.timeline && (
              <button
                onClick={() => setLessonStep('quiz')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center"
              >
                {weekProgress.quiz ? 'Review Quiz' : 'Take the Quiz'}
                <Star className="h-5 w-5 ml-2" />
              </button>
            )}
            
            <button
              onClick={onBack}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              Back to Course Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimelineGame = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎮 Money Through the Ages</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetTimeline}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setLessonStep('overview')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-green-100 mt-2">Click items below to place them in the correct historical order!</p>
        </div>

        <div className="p-8">
          {timelineCompleted && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Perfect! You're a timeline master!</h3>
              <p className="text-green-700">You just discovered how money evolved over thousands of years!</p>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <ProgressBar 
              current={6 - availableItems.length} 
              total={6} 
              color="green"
              showPercentage
            />
          </div>

          {/* Timeline Slots - Using your working design */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {moneyTimelineOrder.map((item, index) => (
              <div
                key={index}
                className={`border-2 border-dashed rounded-xl p-4 min-h-[100px] flex flex-col items-center justify-center transition ${
                  item ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {item ? (
                  <>
                    <div className="text-3xl mb-2">{timelineItems[item].emoji}</div>
                    <div className="text-sm font-semibold text-gray-800">{timelineItems[item].name}</div>
                    <div className="text-xs text-gray-500">{timelineItems[item].year}</div>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Empty</span>
                )}
              </div>
            ))}
          </div>

          {/* Available Items - Using your working click handler */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Click items to add them to the timeline:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {availableItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleTimelineClick(item)}
                  className="bg-white hover:bg-blue-100 p-4 rounded-xl flex flex-col items-center text-sm transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{timelineItems[item].emoji}</div>
                  <div className="font-semibold text-gray-800">{timelineItems[item].name}</div>
                  <div className="text-xs text-gray-600">{timelineItems[item].year}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setLessonStep('lesson')}
              className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Lesson
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                {6 - availableItems.length} of 6 items placed
              </p>
              {timelineCompleted ? (
                <div className="text-green-600 font-semibold flex items-center justify-center">
                  ✅ Timeline Correct!
                  <Star className="ml-2 w-4 h-4" />
                </div>
              ) : (
                <div className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  Fill all 6 slots to check
                </div>
              )}
            </div>

            {timelineCompleted ? (
              <button
                onClick={() => setLessonStep('quiz')}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                Take Quiz
                <Star className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => setLessonStep('quiz')}
                className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
              >
                Skip to Quiz
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎮 How to Play:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Click any item below</strong> to add it to the next empty slot</li>
              <li>• Items will fill from left to right automatically</li>
              <li>• Get all 6 items in the correct historical order to win!</li>
              <li>• Use the Reset button if you want to start over</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadgeCeremony = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-75 animate-pulse"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-yellow-100 text-lg">You've earned the Money Explorer badge!</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 text-yellow-300 animate-ping">✨</div>
            <div className="absolute top-8 right-8 text-yellow-300 animate-ping" style={{animationDelay: '0.5s'}}>⭐</div>
            <div className="absolute bottom-6 left-8 text-yellow-300 animate-ping" style={{animationDelay: '1s'}}>💫</div>
            <div className="absolute bottom-4 right-4 text-yellow-300 animate-ping" style={{animationDelay: '1.5s'}}>✨</div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-300 rounded-2xl p-6 mb-6">
            <div className="text-8xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Money Explorer</h3>
            <p className="text-orange-700 text-lg mb-4">
              You learned how money was invented and how it has changed over time!
            </p>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">What you learned:</h4>
              <div className="text-left space-y-2 text-orange-700">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>The history of bartering and early money</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>How money evolved from shells to digital payments</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span>Why money makes trading easier for everyone</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-bold text-blue-800 mb-3">🔮 Coming Next Week...</h4>
            <div className="flex items-center justify-center mb-3">
              <div className="text-4xl mr-4">💼</div>
              <div className="text-left">
                <h5 className="font-semibold text-blue-800">Week 2: How People Earn Money</h5>
                <p className="text-blue-700">Discover different ways people make money and how you can start earning too!</p>
              </div>
            </div>
          </div>

          {/* Complete Week Button */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setWeekProgress(prev => ({ ...prev, badge: true }));
                onComplete(1, 'Money Explorer');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Continue to Week 2! 
              <ArrowRight className="h-6 w-6 ml-2" />
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              Back to Course Overview
            </button>
          </div>

          {/* Share Achievement */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-3">Share your achievement!</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                📱 Share
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                💾 Save Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render function
  const renderCurrentStep = () => {
    switch (lessonStep) {
      case 'overview':
        return renderOverview();
      case 'lesson':
        return (
          <LessonComponent
            weekNumber={1}
            title="The Story of Money"
            sections={lessonSections}
            onComplete={handleLessonComplete}
            onBack={() => setLessonStep('overview')}
            color="blue"
          />
        );
      case 'timeline':
        return renderTimelineGame();
      case 'quiz':
        return (
          <QuizEngine
            questions={quizQuestions}
            onComplete={handleQuizComplete}
            minPassingScore={3}
            maxLives={3}
            showHints={true}
            allowRetry={true}
            color="purple"
          />
        );
      case 'badge':
        return renderBadgeCeremony();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {renderCurrentStep()}
    </div>
  );
};

export default Week1Component;