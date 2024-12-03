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

const dishes: Dish[] = [
  {
    id: '1',
    name: 'Ensalada César',
    description: 'Clásica ensalada con pollo a la parrilla, crutones y aderezo César',
    price: 12.99,
    image: '/imagen_landing.jpg',
    category: 'Ensaladas',
    ingredients: ['Lechuga romana', 'Pollo a la parrilla', 'Crutones', 'Queso parmesano', 'Aderezo César'],
    nutritionalInfo: {
      calories: 350,
      protein: 25,
      carbs: 10,
      fat: 25
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: true
    },
    mealTime: ['Almuerzo', 'Cena']
  },
  {
    id: '2',
    name: 'Pasta Alfredo',
    description: 'Fettuccine en una cremosa salsa Alfredo con pollo y champiñones',
    price: 14.99,
    image: '/landing2.jpg',
    category: 'Pastas',
    ingredients: ['Fettuccine', 'Pollo', 'Champiñones', 'Crema', 'Queso parmesano'],
    nutritionalInfo: {
      calories: 650,
      protein: 30,
      carbs: 70,
      fat: 35
    },
    dietary: {
      isVegan: false,
      isVegetarian: false,
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

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  const filteredDishes = selectedCategory === 'Todos'
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
          {filteredDishes.map(dish => (
            <DishCard
              key={dish.id}
              {...dish}
              onClick={() => setSelectedDish(dish)}
            />
          ))}
        </motion.div>
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

