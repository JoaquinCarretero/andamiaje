'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const images = [
  '/imagen_landing.jpg',
  '/landing2.jpg',
  '/imagen_landing.jpg',
  '/landing2.jpg',
]

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative bg-[url('/fondo-landing.jpg')] bg-cover bg-center overflow-hidden">
      {/* Superposición oscura */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Contenido principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-goldplay-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Comida de Calidad para tu Día Laboral
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Descubre nuestra selección de platos preparados con ingredientes frescos y adaptados a tus preferencias alimentarias.
            </p>
            <Link href="/menu">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white border-2 border-white transition-all duration-300 transform hover:scale-105"
              >
                Explorar Menú
              </Button>
            </Link>
          </motion.div>
          <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentImage]}
                  alt="Platos preparados"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

