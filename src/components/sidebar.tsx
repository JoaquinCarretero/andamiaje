'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Calendar, ChevronLeft, Clock, Home, Settings, User, UtensilsCrossed, History, Bell, LogOut, CreditCard, ShoppingCart } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: any
}

interface NavSection {
  title: string
  items: NavItem[]
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()

  const navSections: NavSection[] = [
    {
      title: "Principal",
      items: [
        {
          title: 'Inicio',
          href: '/',
          icon: Home,
        },
        {
          title: 'Explorar Menú',
          href: '/menu',
          icon: UtensilsCrossed,
        },
      ]
    },
    {
      title: "Pedidos",
      items: [
        {
          title: 'Menú Semanal',
          href: '/weekly-planning',
          icon: Calendar,
        },
        {
          title: 'Reservas Activas',
          href: '/reservations',
          icon: Clock,
        },
        {
          title: 'Historial',
          href: '/history',
          icon: History,
        },
        {
          title: 'Carrito',
          href: '/cart',
          icon: ShoppingCart,
        },
      ]
    },
    {
      title: "Usuario",
      items: [
        {
          title: 'Mi Perfil',
          href: '/profile',
          icon: User,
        },
        {
          title: 'Notificaciones',
          href: '/notifications',
          icon: Bell,
        },
        {
          title: 'Configuración',
          href: '/settings',
          icon: Settings,
        },
      ]
    }
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        layout
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 240,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className={cn(
          "flex flex-col h-screen border-r bg-background fixed left-0 top-0 z-[100]",
          className
        )}
        onClick={() => !isCollapsed ? null : setIsCollapsed(false)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className="flex flex-col h-16 px-4 border-b justify-center relative">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/cervesia_logo-removebg-preview.png"
                    alt="Cervesia Logo"
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-primary font-cervesia text-shadow">
                      Cervêsïa
                    </span>
                    <span className="text-sm text-muted-foreground -mt-1">
                      Empresa
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
              isCollapsed 
                ? "right-1/2 translate-x-1/2" 
                : "right-2" 
            )}
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed(!isCollapsed)
            }}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed ? "rotate-180" : ""
            )} />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <nav className="grid gap-2 px-2 py-4">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="grid gap-1">
                {!isCollapsed && (
                  <h3 className="px-3 text-xs font-medium text-muted-foreground mb-1">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item, itemIndex) => (
                  <Tooltip key={itemIndex} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                          isCollapsed && "justify-center"
                        )}
                        onMouseEnter={() => setHoveredItem(item.title)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && hoveredItem === item.title && (
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
                {sectionIndex < navSections.length - 1 && (
                  <div className="h-px bg-border my-2" />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t p-4 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">Usuario</span>
                    <span className="text-muted-foreground">usuario@email.com</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isCollapsed ? "center" : "end"} 
              className="w-56"
              side={isCollapsed ? "right" : "top"}
              sideOffset={isCollapsed ? 8 : 0}
            >
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
              </Link>
              <Link href="/billing">
                <DropdownMenuItem>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Facturación
                </DropdownMenuItem>
              </Link>
              <Link href="/notifications">
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notificaciones
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

