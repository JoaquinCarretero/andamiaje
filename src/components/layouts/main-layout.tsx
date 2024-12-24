'use client'

import { Sidebar } from '@/components/sidebar'
import { motion } from 'framer-motion'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[80px] relative">
        {children}
      </div>
    </div>
  )
}

