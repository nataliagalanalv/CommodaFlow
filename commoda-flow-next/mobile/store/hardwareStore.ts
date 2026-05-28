import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Hardware } from '../types';

interface HardwareStore {
  items: Hardware[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setItems: (items: Hardware[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  filteredItems: () => Hardware[];
}

export const useHardwareStore = create<HardwareStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      setItems: (items) => set({ items }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      filteredItems: () => {
        const { items, searchQuery } = get();
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(
          (h) =>
            h.model.toLowerCase().includes(q) ||
            h.category.toLowerCase().includes(q) ||
            h.specs.toLowerCase().includes(q)
        );
      },
    }),
    {
      name: 'commoda-hardware-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
