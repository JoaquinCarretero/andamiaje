import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dish } from '@/app/types/dish'
import { useRouter } from 'next/navigation'

interface DishCardProps extends Dish {
  onClick: () => void;
}

export function DishCard({ name, description, price, image, dietary, onClick }: DishCardProps) {
  const router = useRouter()
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={image || '/placeholder.jpg'} // Usa una imagen de placeholder si no hay imagen
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-goldplay-bold text-xl mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          <Button onClick={() => router.push(`/weekly-planning?dish=${encodeURIComponent(JSON.stringify({ name, description, price, image, dietary }))}`)} variant="outline">Ver detalles</Button>
        </div>
        <div className="mt-2 flex gap-2">
          {dietary.isVegan && (
            <span className="px-2 py-1 rounded-full bg-green-100 text-xs text-green-800">
              Vegano
            </span>
          )}
          {dietary.isVegetarian && (
            <span className="px-2 py-1 rounded-full bg-green-100 text-xs text-green-800">
              Vegetariano
            </span>
          )}
          {dietary.isGlutenFree && (
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-xs text-yellow-800">
              Sin Gluten
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

