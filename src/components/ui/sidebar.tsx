"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ---------------------------
// Sidebar principal
// ---------------------------
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: "icon" | "none"
}

export function Sidebar({ className, collapsible = "none", ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card text-card-foreground h-full",
        collapsible === "icon" && "w-16 hover:w-64 transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-2", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 py-2", className)} {...props} />
}

export function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  tooltip?: string
}

export function SidebarMenuButton({
  className,
  isActive,
  tooltip,
  children,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full text-left transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  )
}

// ---------------------------
// Nuevos componentes necesarios
// ---------------------------

// Contexto para manejar el estado abierto/cerrado del sidebar
const SidebarContext = React.createContext<{
  open: boolean
  toggle: () => void
}>({
  open: true,
  toggle: () => {},
})

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const toggle = () => setOpen((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      <div className="flex w-full h-screen">{children}</div>
    </SidebarContext.Provider>
  )
}

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col flex-1", className)} {...props} />
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = React.useContext(SidebarContext)
  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md border p-2 hover:bg-accent",
        className
      )}
      {...props}
    >
      ☰
    </button>
  )
}
