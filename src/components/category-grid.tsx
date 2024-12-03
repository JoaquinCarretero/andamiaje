import { Card, CardContent } from '@/components/ui/card'
import { Salad, Wheat, Leaf, Heart } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Vegetariano',
    icon: Leaf,
    href: '/menu?category=Vegetariano',
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    name: 'Sin Gluten',
    icon: Wheat,
    href: '/menu?category=Sin Gluten',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    name: 'Vegano',
    icon: Leaf,
    href: '/menu?category=Vegano',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    name: 'Saludable',
    icon: Heart,
    href: '/menu?category=Saludable',
    color: 'bg-red-100',
    iconColor: 'text-red-600'
  }
]

export function CategoryGrid() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-goldplay-bold text-primary mb-8">
          Busca según tus preferencias
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`rounded-full ${category.color} p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

