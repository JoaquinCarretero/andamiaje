'use client'

import { useSearchParams } from 'next/navigation'
import { WeeklyPlanningView } from '@/components/weekly-planning-view'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Dish } from '@/app/types/dish'

export default function WeeklyPlanningPage() {
  const searchParams = useSearchParams()
  const dishParam = searchParams.get('dish')
  const initialDish: Dish = dishParam ? JSON.parse(decodeURIComponent(dishParam)) : null

  if (!initialDish) {
    // Handle the case where no dish was provided
    return <div>Error: No se proporcionó un plato inicial</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <WeeklyPlanningView initialDish={initialDish} />
      <Footer />
    </div>
  )
}

