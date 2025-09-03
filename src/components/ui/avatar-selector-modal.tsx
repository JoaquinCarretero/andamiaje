// Modal para seleccionar avatar de perfil
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { avatarOptions, type AvatarOption } from "@/lib/avatar-system"
import { FaUser } from "react-icons/fa"
import colors from "@/lib/colors"

interface AvatarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatarId: string) => void
  currentAvatarId?: string
}

export function AvatarSelectorModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentAvatarId 
}: AvatarSelectorModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentAvatarId || "")

  const categories = [
    { id: "all", name: "Todos", count: avatarOptions.length },
    { id: "medical", name: "Médicos", count: avatarOptions.filter(a => a.category === "medical").length },
    { id: "professional", name: "Profesionales", count: avatarOptions.filter(a => a.category === "professional").length },
    { id: "casual", name: "Casuales", count: avatarOptions.filter(a => a.category === "casual").length }
  ]

  const filteredAvatars = avatarOptions.filter(avatar => {
    const matchesCategory = selectedCategory === "all" || avatar.category === selectedCategory
    const matchesSearch = avatar.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleConfirm = () => {
    if (selectedAvatarId) {
      onSelect(selectedAvatarId)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card 
            className="border-0 shadow-2xl"
            style={{ 
              backgroundColor: colors.surface,
              boxShadow: `0 25px 50px ${colors.shadowLarge}`
            }}
          >
            <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.primary[50] }}
                  >
                    <FaUser className="h-4 w-4" style={{ color: colors.primary[500] }} />
                  </div>
                  <span style={{ color: colors.text }}>Seleccionar Avatar</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Búsqueda y filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.textMuted }} />
                      <Input
                        placeholder="Buscar avatar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-2"
                        style={{
                          backgroundColor: selectedCategory === category.id ? colors.primary[500] : "transparent",
                          color: selectedCategory === category.id ? colors.surface : colors.textSecondary,
                          borderColor: colors.border
                        }}
                      >
                        {category.name}
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{
                            backgroundColor: selectedCategory === category.id ? colors.surface : colors.neutral[100],
                            color: selectedCategory === category.id ? colors.primary[500] : colors.textMuted
                          }}
                        >
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Grid de avatares */}
                <div className="max-h-[50vh] overflow-y-auto">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {filteredAvatars.map((avatar) => {
                      const Icon = avatar.icon
                      const isSelected = selectedAvatarId === avatar.id
                      
                      return (
                        <motion.button
                          key={avatar.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedAvatarId(avatar.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected ? 'ring-2 ring-offset-2' : ''
                          }`}
                          style={{
                            backgroundColor: isSelected ? `${avatar.color}10` : colors.surface,
                            borderColor: isSelected ? avatar.color : colors.border,
                            ringColor: isSelected ? avatar.color : 'transparent'
                          }}
                          title={avatar.name}
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                            style={{ backgroundColor: `${avatar.color}15` }}
                          >
                            <Icon 
                              className="h-6 w-6" 
                              style={{ color: avatar.color }}
                            />
                          </div>
                          
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.success[500] }}
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                          
                          <p className="text-xs text-center font-medium truncate" style={{ color: colors.text }}>
                            {avatar.name}
                          </p>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {filteredAvatars.length === 0 && (
                  <div className="text-center py-8">
                    <FaUser className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      No se encontraron avatares con los filtros aplicados
                    </p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedAvatarId}
                    style={{
                      backgroundColor: colors.primary[500],
                      color: colors.surface
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Selección
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}