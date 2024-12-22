import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { Dish } from '@/app/types/dish'
import { useState } from 'react'

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish;
}

export function DishModal({ isOpen, onClose, dish }: DishModalProps) {
  //const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const handleNewReservation = () => {
    // Here we'll add logic to navigate to the new WeeklyPlanningView
    console.log(`Nueva reserva para: ${dish.name}`)
    onClose()
  }

  const hasDietaryRestrictions = dish.dietary.isVegan || dish.dietary.isVegetarian || dish.dietary.isGlutenFree

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">{dish.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Columna izquierda */}
          <div className="flex flex-col">
            <div className="relative h-[300px]">
              <Image
                src={dish.image || '/placeholder.jpg'} // Usa una imagen de placeholder si no hay imagen
                alt={dish.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Momento del día:</h4>
                  <div className="flex gap-2">
                    {dish.mealTime.map((time) => (
                      <Badge key={time} variant="secondary">{time}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="p-6">
            <h2 className="text-2xl font-goldplay-bold text-primary mb-2">{dish.name}</h2>
            <p className="text-gray-600 mb-4">{dish.description}</p>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Ingredientes:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {dish.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Información nutricional:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <p>Calorías: {dish.nutritionalInfo.calories} kcal</p>
                  <p>Proteínas: {dish.nutritionalInfo.protein}g</p>
                  <p>Carbohidratos: {dish.nutritionalInfo.carbs}g</p>
                  <p>Grasas: {dish.nutritionalInfo.fat}g</p>
                </div>
              </div>

              {hasDietaryRestrictions && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Restricciones dietéticas:</h4>
                  <div className="flex gap-2">
                    {dish.dietary.isVegan && (
                      <Badge variant="outline">Vegano</Badge>
                    )}
                    {dish.dietary.isVegetarian && (
                      <Badge variant="outline">Vegetariano</Badge>
                    )}
                    {dish.dietary.isGlutenFree && (
                      <Badge variant="outline">Sin Gluten</Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-2xl font-bold text-primary">${dish.price.toFixed(2)}</span>
                <Button 
                  onClick={handleNewReservation} 
                  className="w-full"
                >
                  Nueva Reserva
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

