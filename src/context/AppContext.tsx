'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reminder, FarmActivity, CropPrice, Scheme, ChatMessage } from '../types';
import { mockDb } from '../database/mockDb';
import { aiService } from '../services/aiService';

interface AppContextProps {
  reminders: Reminder[];
  activities: FarmActivity[];
  prices: CropPrice[];
  schemes: Scheme[];
  chatHistory: ChatMessage[];
  activeLang: 'hi-IN' | 'en-IN' | 'pa-IN';
  setActiveLang: (lang: 'hi-IN' | 'en-IN' | 'pa-IN') => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed' | 'date' | 'time'> & { date?: string; time?: string }) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  addActivity: (activity: Omit<FarmActivity, 'id' | 'date'>) => void;
  sendChatMessage: (text: string, isVoice?: boolean) => Promise<void>;
  clearChat: () => void;
  isLoadingAI: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activities, setActivities] = useState<FarmActivity[]>([]);
  const [prices, setPrices] = useState<CropPrice[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeLang, setActiveLang] = useState<'hi-IN' | 'en-IN' | 'pa-IN'>('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Sync initial state from mockDb (which operates on localStorage safely in client)
  useEffect(() => {
    setReminders(mockDb.getReminders());
    setActivities(mockDb.getActivities());
    setPrices(mockDb.getCropPrices());
    setSchemes(mockDb.getSchemes());
    setChatHistory(mockDb.getChatHistory());
  }, []);

  // Text to Speech logic
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text from bracketed English translations (to speak Hindi naturally)
    const textToSpeak = text.replace(/\([^)]*\)/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = activeLang;
    
    // Find a suitable voice if possible
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(activeLang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addReminder = (reminder: Omit<Reminder, 'id' | 'completed' | 'date' | 'time'> & { date?: string; time?: string }) => {
    const defaultDate = new Date().toISOString().split('T')[0];
    const defaultTime = '08:00';
    const newRem = mockDb.addReminder({
      title: reminder.title,
      crop: reminder.crop,
      date: reminder.date || defaultDate,
      time: reminder.time || defaultTime,
      type: reminder.type
    });
    setReminders(mockDb.getReminders());
  };

  const toggleReminder = (id: string) => {
    const updated = mockDb.toggleReminder(id);
    setReminders(updated);
  };

  const deleteReminder = (id: string) => {
    const updated = mockDb.deleteReminder(id);
    setReminders(updated);
  };

  const addActivity = (activity: Omit<FarmActivity, 'id' | 'date'>) => {
    mockDb.addActivity(activity);
    setActivities(mockDb.getActivities());
  };

  const sendChatMessage = async (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = mockDb.addChatMessage('user', text, isVoice);
    setChatHistory(mockDb.getChatHistory());
    setIsLoadingAI(true);

    try {
      // Process with mock AI
      const result = await aiService.processFarmingQuery(text);
      
      // Add assistant response
      const assistantMsg = mockDb.addChatMessage('assistant', result.reply);
      setChatHistory(mockDb.getChatHistory());
      
      // Update states in case action was taken
      if (result.actionTaken === 'reminder') {
        setReminders(mockDb.getReminders());
      } else if (result.actionTaken === 'activity') {
        setActivities(mockDb.getActivities());
      }

      // Automatically speak the response
      speakText(result.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const clearChat = () => {
    mockDb.clearChatHistory();
    setChatHistory(mockDb.getChatHistory());
    stopSpeaking();
  };

  return (
    <AppContext.Provider
      value={{
        reminders,
        activities,
        prices,
        schemes,
        chatHistory,
        activeLang,
        setActiveLang,
        speakText,
        stopSpeaking,
        isSpeaking,
        addReminder,
        toggleReminder,
        deleteReminder,
        addActivity,
        sendChatMessage,
        clearChat,
        isLoadingAI
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
