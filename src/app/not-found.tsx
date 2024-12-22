'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import lottie from 'lottie-web'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  const lottieContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lottieContainer.current) {
      const animation = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/animations/404.json' // Aquí irá tu archivo de animación
      })

      return () => animation.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <div 
          ref={lottieContainer} 
          className="w-full max-w-[400px] h-[400px] mx-auto"
        />
        <h1 className="text-4xl font-bold text-primary mt-8 mb-4">
          ¡Página no encontrada!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-[500px]">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild>
          <Link href="/" className="gap-2">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
}

