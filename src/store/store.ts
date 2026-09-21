import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  language: 'he' | 'en' | 'ar';
}

interface Event {
  id: string;
  title: string;
  type: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description: string;
  templateId: string;
  status: 'draft' | 'preview' | 'scheduled' | 'sent';
}

interface AppStore {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;

  // Events
  events: Event[];
  setEvents: (events: Event[]) => void;
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // UI
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Language
  language: 'he' | 'en' | 'ar';
  setLanguage: (lang: 'he' | 'en' | 'ar') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  // Events state
  events: [],
  setEvents: (events) => set({ events }),
  currentEvent: null,
  setCurrentEvent: (event) => set({ currentEvent: event }),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
      currentEvent: state.currentEvent?.id === id
        ? { ...state.currentEvent, ...updatedEvent }
        : state.currentEvent,
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
    })),

  // UI state
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
  error: null,
  setError: (error) => set({ error }),

  // Language state
  language: 'he',
  setLanguage: (lang) => set({ language: lang }),
}));
