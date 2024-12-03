import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface FoodCardProps {
  title: string
  description: string
  price: number
  imageUrl: string
  dietary: {
    isVegan?: boolean
    isVegetarian?: boolean
    isGlutenFree?: boolean
  }
}

export function FoodCard({ title, description, price, imageUrl, dietary }: FoodCardProps) {
  return (
    <Card className="overflow-hidden bg-black border-primary/20">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-secondary">${price}</span>
          <div className="flex gap-2">
            {dietary.isVegan && (
              <span className="px-2 py-1 rounded-full bg-primary text-xs text-white">
                Vegano
              </span>
            )}
            {dietary.isVegetarian && (
              <span className="px-2 py-1 rounded-full bg-primary text-xs text-white">
                Vegetariano
              </span>
            )}
            {dietary.isGlutenFree && (
              <span className="px-2 py-1 rounded-full bg-primary text-xs text-white">
                Sin Gluten
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

