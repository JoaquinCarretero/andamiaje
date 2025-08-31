"use client"

import { useEffect, useRef } from "react"
import { useSpring, animated } from "@react-spring/web"
import { useInView } from "react-intersection-observer"
import colors from "@/lib/colors"

interface FloatingCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FloatingCard({ children, delay = 0, className = "" }: FloatingCardProps) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(30px)',
    delay: delay,
    config: { tension: 280, friction: 60 }
  })

  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' })
        await next({ transform: 'translateY(0px)' })
      }
    },
    config: { duration: 3000 }
  })

  return (
    <animated.div
      ref={ref}
      style={animation}
      className={className}
    >
      <animated.div style={floatAnimation}>
        {children}
      </animated.div>
    </animated.div>
  )
}

interface FloatingIconProps {
  icon: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FloatingIcon({ icon, delay = 0, duration = 4000, className = "" }: FloatingIconProps) {
  const animation = useSpring({
    from: { 
      transform: 'translateY(0px) rotate(0deg)',
      opacity: 0.7
    },
    to: async (next) => {
      await next({ opacity: 1 })
      while (true) {
        await next({ 
          transform: 'translateY(-15px) rotate(5deg)',
          opacity: 0.9
        })
        await next({ 
          transform: 'translateY(0px) rotate(0deg)',
          opacity: 1
        })
      }
    },
    delay,
    config: { duration }
  })

  return (
    <animated.div
      style={animation}
      className={`absolute ${className}`}
    >
      {icon}
    </animated.div>
  )
}

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingIcon
        icon={
          <div 
            className="w-20 h-20 rounded-full opacity-20"
            style={{ backgroundColor: colors.primary[200] }}
          />
        }
        className="top-20 left-20"
        delay={0}
        duration={5000}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-16 h-16 rounded-full opacity-15"
            style={{ backgroundColor: colors.secondary[200] }}
          />
        }
        className="top-40 right-32"
        delay={1000}
        duration={4000}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-12 h-12 rounded-full opacity-25"
            style={{ backgroundColor: colors.accent[200] }}
          />
        }
        className="bottom-32 left-40"
        delay={2000}
        duration={6000}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-24 h-24 rounded-full opacity-10"
            style={{ backgroundColor: colors.primary[300] }}
          />
        }
        className="bottom-20 right-20"
        delay={1500}
        duration={4500}
      />
    </div>
  )
}