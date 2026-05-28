import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rental } from '../types';

interface RentalStore {
  items: Rental[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setItems: (items: Rental[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  filteredItems: () => Rental[];
}

export const useRentalStore = create<RentalStore>()(
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
          (r) =>
            r.hardware?.model.toLowerCase().includes(q) ||
            r.user?.name.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q)
        );
      },
    }),
    {
      name: 'commoda-rentals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
