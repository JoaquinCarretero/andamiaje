'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { UserCircle, ShoppingCart, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Dish } from '@/app/types/dish'

// Simulated data - replace with actual data fetching in a real application
const dishes: Dish[] = [
  {
    id: '1', name: 'Ensalada César', category: 'Ensaladas',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false
    },
    mealTime: []
  },
  {
    id: '2', name: 'Pasta Alfredo', category: 'Pastas',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false
    },
    mealTime: []
  },
  {
    id: '3', name: 'Pollo a la Parrilla', category: 'Carnes',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false
    },
    mealTime: []
  },
  {
    id: '4', name: 'Ensalada Caprese', category: 'Ensaladas',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false
    },
    mealTime: []
  },
  {
    id: '5', name: 'Lasaña Vegetariana', category: 'Vegetariano',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false
    },
    mealTime: []
  },
]

const categories = ['Ensaladas', 'Pastas', 'Carnes', 'Vegetariano', 'Vegano', 'Sin Gluten']

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<Dish | string>>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSearch = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase()
    const filteredDishes = dishes.filter(dish => 
      dish.name.toLowerCase().includes(lowercaseQuery) || 
      dish.category.toLowerCase().includes(lowercaseQuery)
    )
    const filteredCategories = categories.filter(category => 
      category.toLowerCase().includes(lowercaseQuery)
    )
    setSearchResults([...filteredDishes, ...filteredCategories])
  }, [])

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery)
    } else {
      setSearchResults([])
    }
    setSelectedIndex(-1)
  }, [searchQuery, handleSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleResultClick = (result: Dish | string) => {
    if (typeof result === 'string') {
      // It's a category
      router.push(`/menu?category=${result}`)
    } else {
      // It's a dish
      router.push(`/dish/${result.id}`)
    }
    setSearchQuery('')
    setIsSearchFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleResultClick(searchResults[selectedIndex])
    }
  }

  return (
    <nav className="bg-background border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/cervesia_logo-removebg-preview.png" alt="Logo" width={70} height={70} />
            <span className="text-4xl font-bold text-primary font-cervesia text-shadow">
              Cervêsïa
            </span>
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="w-full pl-10"
                placeholder="Buscar platos, categorías..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
              />
              <AnimatePresence>
                {isSearchFocused && (searchResults.length > 0 || searchQuery) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md mt-1 max-h-60 overflow-y-auto"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                          onClick={() => handleResultClick(result)}
                        >
                          {typeof result === 'string' ? (
                            <span className="text-sm text-gray-600">Categoría: {result}</span>
                          ) : (
                            <span className="text-sm">{result.name} - <span className="text-gray-600">{result.category}</span></span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        No hay coincidencias con tu búsqueda
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/login">Iniciar Sesión</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/registro">Registrarse</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

