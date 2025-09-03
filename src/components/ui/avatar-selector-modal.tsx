// Modal para seleccionar avatar de perfil
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentAvatarId || "")

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
                {/* Grid de avatares por categorías */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Categoría Médica */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                      👩‍⚕️ Profesionales Médicos
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                      {avatarOptions.filter(avatar => avatar.category === 'medical').map((avatar) => {
                        const Icon = avatar.icon
                        const isSelected = selectedAvatarId === avatar.id
                        
                        return (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAvatarId(avatar.id)}
                            className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
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
                              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                              style={{ backgroundColor: `${avatar.color}15` }}
                            >
                              <Icon 
                                className="h-5 w-5" 
                                style={{ color: avatar.color }}
                              />
                            </div>
                            
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: colors.success[500] }}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Categoría Profesional */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                      👔 Profesionales
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                      {avatarOptions.filter(avatar => avatar.category === 'professional').map((avatar) => {
                        const Icon = avatar.icon
                        const isSelected = selectedAvatarId === avatar.id
                        
                        return (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAvatarId(avatar.id)}
                            className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
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
                              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                              style={{ backgroundColor: `${avatar.color}15` }}
                            >
                              <Icon 
                                className="h-5 w-5" 
                                style={{ color: avatar.color }}
                              />
                            </div>
                            
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: colors.success[500] }}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Categoría Casual */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                      😊 Personas Amigables
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                      {avatarOptions.filter(avatar => avatar.category === 'casual').map((avatar) => {
                        const Icon = avatar.icon
                        const isSelected = selectedAvatarId === avatar.id
                        
                        return (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAvatarId(avatar.id)}
                            className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
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
                              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                              style={{ backgroundColor: `${avatar.color}15` }}
                            >
                              <Icon 
                                className="h-5 w-5" 
                                style={{ color: avatar.color }}
                              />
                            </div>
                            
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: colors.success[500] }}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>

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