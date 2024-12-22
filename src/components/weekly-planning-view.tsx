import { useState } from 'react'
import { format, startOfWeek, addDays, isBefore, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dish } from '@/app/types/dish'
import Image from 'next/image'

interface WeeklyPlanningViewProps {
  initialDish: Dish
}

const mealTimes = ['Desayuno', 'Almuerzo', 'Cena']

export function WeeklyPlanningView({ initialDish }: WeeklyPlanningViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedMeals, setSelectedMeals] = useState<{ [key: string]: Dish }>({
    [`${format(currentWeekStart, 'yyyy-MM-dd')}-Almuerzo`]: initialDish,
  })

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prevWeek => addDays(prevWeek, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart(prevWeek => addDays(prevWeek, 7))
  }

  const handleMealSelection = (date: Date, mealTime: string) => {
    // Here you would typically open a modal or navigate to a dish selection view
    console.log(`Seleccionar plato para ${format(date, 'EEEE d', { locale: es })} - ${mealTime}`)
  }

  const renderWeek = () => {
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeekStart, i)
      week.push(
        <Card key={i} className={`${isBefore(date, new Date()) && !isToday(date) ? 'opacity-50' : ''}`}>
          <CardContent className="p-4">
            <h3 className="font-goldplay-bold text-lg mb-2 text-primary">
              {format(date, 'EEEE d', { locale: es })}
            </h3>
            {mealTimes.map(mealTime => {
              const mealKey = `${format(date, 'yyyy-MM-dd')}-${mealTime}`
              const selectedDish = selectedMeals[mealKey]
              return (
                <div key={mealTime} className="mb-2">
                  <h4 className="text-sm font-medium text-gray-500">{mealTime}</h4>
                  {selectedDish ? (
                    <div className="relative h-20 w-full rounded-md overflow-hidden">
                      <Image
                        src={selectedDish.image || '/placeholder.jpg'}
                        alt={selectedDish.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{selectedDish.name}</span>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleMealSelection(date, mealTime)}
                      disabled={isBefore(date, new Date()) && !isToday(date)}
                    >
                      Seleccionar plato
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )
    }
    return week
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-goldplay-bold text-primary">Planificación Semanal</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">
            {format(currentWeekStart, 'MMMM yyyy', { locale: es })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4"
      >
        {renderWeek()}
      </motion.div>
    </div>
  )
}

