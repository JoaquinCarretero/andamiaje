'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Dish } from '@/app/types/dish';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDishes: Dish[];
  setFilteredDishes: (dishes: Dish[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, filteredDishes, setFilteredDishes }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

