'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DishCard } from '@/components/dish-card'
import { DishModal } from '@/components/dish-modal'
import { Button } from '@/components/ui/button'
import { Dish } from '@/app/types/dish'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/context/SearchContext'

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
// Agrega más platos aquí...
]

const mainCategories = ['Todos', 'Ensaladas', 'Pastas', 'Carnes', 'Vegetariano', 'Vegano', 'Sin Gluten']
const additionalCategories = ['Celiaco', 'Hipertensión', 'Diabético', 'Bajo en sodio', 'Alto en proteínas', 'Bajo en calorías']

export default function MenuPage() {
const [selectedCategory, setSelectedCategory] = useState('Todos')
const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false)
const searchParams = useSearchParams()
const { searchQuery, filteredDishes } = useSearch()

useEffect(() => {
  const categoryParam = searchParams.get('category')
  if (categoryParam) {
    setSelectedCategory(categoryParam)
  }
}, [searchParams])

const displayedDishes = searchQuery
  ? filteredDishes
  : selectedCategory === 'Todos'
    ? dishes
    : dishes.filter(dish => dish.category.toLowerCase() === selectedCategory.toLowerCase())

return (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <Navbar />
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="font-goldplay-bold text-4xl mb-8 text-center text-primary">Nuestro Menú</h1>
      
      <div className="flex justify-center space-x-4 mb-8 overflow-x-auto pb-4">
        {mainCategories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setIsMoreCategoriesOpen(true)}
          className="whitespace-nowrap"
        >
          Más...
        </Button>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {displayedDishes.map(dish => (
          <DishCard
            key={dish.id}
            {...dish}
            onClick={() => setSelectedDish(dish)}
          />
        ))}
      </motion.div>

      {displayedDishes.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No se encontraron platos que coincidan con tu búsqueda.</p>
      )}
    </motion.div>

    {selectedDish && (
      <DishModal
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        dish={selectedDish}
      />
    )}

    <Dialog open={isMoreCategoriesOpen} onOpenChange={setIsMoreCategoriesOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Más Categorías</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {additionalCategories.map(category => (
            <Button
              key={category}
              variant="outline"
              onClick={() => {
                setSelectedCategory(category)
                setIsMoreCategoriesOpen(false)
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>

    <Footer />
  </div>
)
}

