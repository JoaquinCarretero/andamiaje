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
import { useSearch } from '@/context/SearchContext'
import { Dish } from '@/app/types/dish'

// Simulated data - replace with actual data fetching in a real application
const dishes: Dish[] = [
  {
    id: '1', name: 'Ensalada César', category: 'Ensaladas',
    description: 'Ensalada clásica con lechuga romana, crutones y aderezo César',
    price: 10.99,
    image: '/ensaladacesar.jpg',
    ingredients: ['Lechuga romana', 'Crutones', 'Queso parmesano', 'Aderezo César'],
    nutritionalInfo: {
      calories: 350,
      protein: 10,
      carbs: 15,
      fat: 30
    },
    dietary: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: false
    },
    mealTime: ['Almuerzo', 'Cena']
  },
  {
    id: '2', name: 'Pasta Alfredo', category: 'Pastas',
    description: 'Pasta cremosa con salsa Alfredo y queso parmesano',
    price: 12.99,
    image: '/pastaalfredo.jpg',
    ingredients: ['Fettuccine', 'Crema', 'Mantequilla', 'Queso parmesano'],
    nutritionalInfo: {
      calories: 600,
      protein: 20,
      carbs: 70,
      fat: 35
    },
    dietary: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: false
    },
    mealTime: ['Almuerzo', 'Cena']
  },
  {
    id: '3', name: 'Pollo a la Parrilla', category: 'Carnes',
    description: 'Pechuga de pollo a la parrilla con hierbas',
    price: 14.99,
    image: '/polloparrilla.jpg',
    ingredients: ['Pechuga de pollo', 'Hierbas', 'Limón', 'Aceite de oliva'],
    nutritionalInfo: {
      calories: 300,
      protein: 35,
      carbs: 0,
      fat: 15
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: true
    },
    mealTime: ['Almuerzo', 'Cena']
  },
  {
    id: '4', name: 'Ensalada Caprese', category: 'Ensaladas',
    description: 'Ensalada fresca con tomate, mozzarella y albahaca',
    price: 9.99,
    image: '/caprese.jpg',
    ingredients: ['Tomate', 'Mozzarella fresca', 'Albahaca', 'Aceite de oliva'],
    nutritionalInfo: {
      calories: 250,
      protein: 12,
      carbs: 10,
      fat: 20
    },
    dietary: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: true
    },
    mealTime: ['Almuerzo', 'Cena']
  },
  {
    id: '5', name: 'Lasaña Vegetariana', category: 'Vegetariano',
    description: 'Lasaña con vegetales asados y queso ricotta',
    price: 13.99,
    image: '/lasaña.jpg',
    ingredients: ['Pasta de lasaña', 'Vegetales asados', 'Queso ricotta', 'Salsa de tomate'],
    nutritionalInfo: {
      calories: 450,
      protein: 18,
      carbs: 55,
      fat: 22
    },
    dietary: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: false
    },
    mealTime: ['Almuerzo', 'Cena']
  },
]

const categories = ['Ensaladas', 'Pastas', 'Carnes', 'Vegetariano', 'Vegano', 'Sin Gluten']

const normalizeString = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function Navbar() {
const { searchQuery, setSearchQuery, setFilteredDishes } = useSearch()
const [searchResults, setSearchResults] = useState<Array<Dish | string>>([])
const [isSearchFocused, setIsSearchFocused] = useState(false)
const [selectedIndex, setSelectedIndex] = useState(-1)
const searchRef = useRef<HTMLDivElement>(null)

const handleSearch = useCallback((query: string) => {
  const normalizedQuery = normalizeString(query)
  const filteredDishes = dishes.filter(dish => 
    normalizeString(dish.name).includes(normalizedQuery) || 
    normalizeString(dish.category).includes(normalizedQuery)
  )
  const filteredCategories = categories.filter(category => 
    normalizeString(category).includes(normalizedQuery)
  )
  setSearchResults([...filteredDishes, ...filteredCategories])
  setFilteredDishes(filteredDishes)
}, [setFilteredDishes])

useEffect(() => {
  handleSearch(searchQuery)
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

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev))
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
  } else if (e.key === 'Enter' && selectedIndex >= 0) {
    e.preventDefault()
    const result = searchResults[selectedIndex]
    if (typeof result === 'string') {
      setSearchQuery(result)
    } else {
      setSearchQuery(result.name)
    }
    setIsSearchFocused(false)
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
                        onClick={() => {
                          if (typeof result === 'string') {
                            setSearchQuery(result)
                          } else {
                            setSearchQuery(result.name)
                          }
                          setIsSearchFocused(false)
                        }}
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
                <Link href="/register">Registrarse</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </nav>
)
}

