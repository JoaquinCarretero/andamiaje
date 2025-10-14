"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, CheckCircle, AlertTriangle, Info, Calendar, FileText, Users, Clock, Trash2 } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import colors from "@/lib/colors"

interface Notification {
  id: number
  type: "success" | "warning" | "info" | "reminder"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired?: boolean
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  userRole: string
}

const getNotificationsByRole = (role: string): Notification[] => {
  const baseNotifications = [
    {
      id: 1,
      type: "warning" as const,
      title: "Informe Pendiente",
      message: "El informe inicial de María López vence mañana",
      timestamp: "Hace 2 horas",
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: "success" as const,
      title: "Documento Aprobado",
      message: "El plan de trabajo de Juan Pérez ha sido aprobado",
      timestamp: "Hace 4 horas",
      read: false
    },
    {
      id: 3,
      type: "info" as const,
      title: "Nueva Actualización",
      message: "Se han agregado nuevas funcionalidades al sistema",
      timestamp: "Hace 1 día",
      read: true
    },
    {
      id: 4,
      type: "reminder" as const,
      title: "Reunión Programada",
      message: "Reunión de equipo mañana a las 14:00",
      timestamp: "Hace 2 días",
      read: true
    }
  ]

  if (role === "coordinador") {
    return [
      {
        id: 5,
        type: "warning" as const,
        title: "Reportes Pendientes",
        message: "3 acompañantes tienen reportes mensuales pendientes",
        timestamp: "Hace 1 hora",
        read: false,
        actionRequired: true
      },
      ...baseNotifications
    ]
  }

  if (role === "acompanante") {
    return [
      {
        id: 6,
        type: "reminder" as const,
        title: "Reporte Mensual",
        message: "Recuerde completar el reporte mensual de enero",
        timestamp: "Hace 30 min",
        read: false,
        actionRequired: true
      },
      ...baseNotifications.slice(1)
    ]
  }

  return baseNotifications
}

export function NotificationsModal({ isOpen, onClose, userRole }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState(getNotificationsByRole(userRole))

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" style={{ color: colors.success[500] }} />
      case "warning":
        return <AlertTriangle className="h-5 w-5" style={{ color: colors.warning[500] }} />
      case "info":
        return <Info className="h-5 w-5" style={{ color: colors.info[500] }} />
      case "reminder":
        return <Clock className="h-5 w-5" style={{ color: colors.accent[500] }} />
      default:
        return <Bell className="h-5 w-5" style={{ color: colors.textMuted }} />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "success":
        return colors.success[50]
      case "warning":
        return colors.warning[50]
      case "info":
        return colors.info[50]
      case "reminder":
        return colors.accent[50]
      default:
        return colors.neutral[50]
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          <Card 
            className="border-0 shadow-2xl max-h-[80vh] overflow-hidden"
            style={{ 
              backgroundColor: colors.surface,
              boxShadow: `0 25px 50px ${colors.shadowLarge}`
            }}
          >
            <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" style={{ color: colors.primary[500] }} />
                  <span style={{ color: colors.text }}>Notificaciones</span>
                  {unreadCount > 0 && (
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: colors.accent[500],
                        color: colors.surface
                      }}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como leídas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      No tienes notificaciones
                    </p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: colors.border }}>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 transition-all duration-200 hover:bg-muted/50 ${
                          !notification.read ? 'border-l-4' : ''
                        }`}
                        style={{
                          backgroundColor: !notification.read ? getNotificationBg(notification.type) : 'transparent',
                          borderLeftColor: !notification.read ? 
                            (notification.type === 'success' ? colors.success[500] :
                             notification.type === 'warning' ? colors.warning[500] :
                             notification.type === 'info' ? colors.info[500] :
                             colors.accent[500]) : 'transparent'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 
                                  className={`text-sm font-medium mb-1 ${!notification.read ? 'font-semibold' : ''}`}
                                  style={{ color: colors.text }}
                                >
                                  {notification.title}
                                  {notification.actionRequired && (
                                    <Badge
                                      className="ml-2 text-xs"
                                      style={{
                                        backgroundColor: colors.error[500],
                                        color: colors.surface
                                      }}
                                    >
                                      Acción requerida
                                    </Badge>
                                  )}
                                </h4>
                                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                                  {notification.message}
                                </p>
                                <p className="text-xs" style={{ color: colors.textMuted }}>
                                  {notification.timestamp}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8"
                                    title="Marcar como leída"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}