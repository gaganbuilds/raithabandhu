import { CropPrice, Scheme, Reminder, FarmActivity, ChatMessage } from '../types';
import { mockCropPrices, mockSchemes, mockReminders, mockFarmActivities } from '../data/mockData';

const IS_SERVER = typeof window === 'undefined';

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (IS_SERVER) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key', key, error);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key', key, error);
  }
};

export const mockDb = {
  getReminders: (): Reminder[] => {
    return getLocalStorageItem<Reminder[]>('farmer_os_reminders', mockReminders);
  },
  
  saveReminders: (reminders: Reminder[]): void => {
    setLocalStorageItem('farmer_os_reminders', reminders);
  },

  addReminder: (reminder: Omit<Reminder, 'id' | 'completed'>): Reminder => {
    const reminders = mockDb.getReminders();
    const newReminder: Reminder = {
      ...reminder,
      id: Math.random().toString(36).substring(2, 9),
      completed: false
    };
    mockDb.saveReminders([newReminder, ...reminders]);
    return newReminder;
  },

  toggleReminder: (id: string): Reminder[] => {
    const reminders = mockDb.getReminders();
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    mockDb.saveReminders(updated);
    return updated;
  },

  deleteReminder: (id: string): Reminder[] => {
    const reminders = mockDb.getReminders();
    const updated = reminders.filter(r => r.id !== id);
    mockDb.saveReminders(updated);
    return updated;
  },

  getActivities: (): FarmActivity[] => {
    return getLocalStorageItem<FarmActivity[]>('farmer_os_activities', mockFarmActivities);
  },

  saveActivities: (activities: FarmActivity[]): void => {
    setLocalStorageItem('farmer_os_activities', activities);
  },

  addActivity: (activity: Omit<FarmActivity, 'id' | 'date'>): FarmActivity => {
    const activities = mockDb.getActivities();
    const newActivity: FarmActivity = {
      ...activity,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    mockDb.saveActivities([newActivity, ...activities]);
    return newActivity;
  },

  getCropPrices: (): CropPrice[] => {
    return getLocalStorageItem<CropPrice[]>('farmer_os_crop_prices', mockCropPrices);
  },

  getSchemes: (): Scheme[] => {
    return mockSchemes; // Schemes are static for this mock
  },

  getChatHistory: (): ChatMessage[] => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: 'नमस्ते! मैं आपका कृषि साथी हूँ। आज आपके खेत में क्या काम चल रहा है? (Hello! I am your farming assistant. What work is happening in your farm today?)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    return getLocalStorageItem<ChatMessage[]>('farmer_os_chat_history', welcomeMessages);
  },

  saveChatHistory: (chatHistory: ChatMessage[]): void => {
    setLocalStorageItem('farmer_os_chat_history', chatHistory);
  },

  addChatMessage: (sender: 'user' | 'assistant', text: string, isVoice: boolean = false): ChatMessage => {
    const history = mockDb.getChatHistory();
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      text,
      isVoiceInput: isVoice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    mockDb.saveChatHistory([...history, newMessage]);
    return newMessage;
  },

  clearChatHistory: (): void => {
    if (IS_SERVER) return;
    localStorage.removeItem('farmer_os_chat_history');
  }
};
