"use client"

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
        await next({ transform: 'translateY(-15px) scale(1.02)' })
        await next({ transform: 'translateY(0px) scale(1)' })
      }
    },
    config: { duration: 4000, tension: 120, friction: 40 }
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
      transform: 'translateX(0px) translateY(0px) rotate(0deg) scale(1)',
      opacity: 0.7
    },
    to: async (next) => {
      await next({ opacity: 1 })
      while (true) {
        await next({ 
          transform: 'translateX(10px) translateY(-20px) rotate(8deg) scale(1.1)',
          opacity: 0.8
        })
        await next({ 
          transform: 'translateX(-5px) translateY(-10px) rotate(-3deg) scale(1.05)',
          opacity: 0.9
        })
        await next({ 
          transform: 'translateX(0px) translateY(0px) rotate(0deg) scale(1)',
          opacity: 1
        })
      }
    },
    delay,
    config: { duration: duration * 0.8, tension: 100, friction: 30 }
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
            className="w-24 h-24 rounded-full opacity-25"
            style={{ backgroundColor: colors.primary[200] }}
          />
        }
        className="top-16 left-16"
        delay={0}
        duration={6000}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-20 h-20 rounded-full opacity-20"
            style={{ backgroundColor: colors.secondary[200] }}
          />
        }
        className="top-32 right-24"
        delay={1500}
        duration={5500}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-16 h-16 rounded-full opacity-30"
            style={{ backgroundColor: colors.accent[200] }}
          />
        }
        className="bottom-40 left-32"
        delay={2500}
        duration={4500}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-28 h-28 rounded-full opacity-15"
            style={{ backgroundColor: colors.primary[300] }}
          />
        }
        className="bottom-24 right-16"
        delay={3000}
        duration={7000}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-14 h-14 rounded-full opacity-25"
            style={{ backgroundColor: colors.accent[300] }}
          />
        }
        className="top-1/2 left-8"
        delay={4000}
        duration={5000}
      />
      <FloatingIcon
        icon={
          <div 
            className="w-18 h-18 rounded-full opacity-20"
            style={{ backgroundColor: colors.secondary[300] }}
          />
        }
        className="top-3/4 right-1/3"
        delay={2000}
        duration={6500}
      />
    </div>
  )
}