import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const mealtimes = ['Desayuno', 'Almuerzo', 'Cena', 'Merienda']

interface OrderTimeSelectorProps {
  onSelect: (day: string, mealtime: string) => void
}

export function OrderTimeSelector({ onSelect }: OrderTimeSelectorProps) {
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [selectedMealtime, setSelectedMealtime] = useState<string>('')

  const handleSelect = () => {
    if (selectedDay && selectedMealtime) {
      onSelect(selectedDay, selectedMealtime)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="day-select">Día de la semana</Label>
        <Select onValueChange={setSelectedDay}>
          <SelectTrigger id="day-select">
            <SelectValue placeholder="Selecciona un día" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map(day => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mealtime-select">Momento del día</Label>
        <Select onValueChange={setSelectedMealtime}>
          <SelectTrigger id="mealtime-select">
            <SelectValue placeholder="Selecciona un momento" />
          </SelectTrigger>
          <SelectContent>
            {mealtimes.map(mealtime => (
              <SelectItem key={mealtime} value={mealtime}>{mealtime}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSelect} disabled={!selectedDay || !selectedMealtime}>
        Confirmar selección
      </Button>
    </div>
  )
}

