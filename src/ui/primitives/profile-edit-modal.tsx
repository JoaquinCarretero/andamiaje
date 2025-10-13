"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, User, Phone, Briefcase, Award } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import colors from "@/lib/colors";

interface ProfileEditData {
  phone: string;
  bio: string;
  specialty: string;
  license: string;
  experience: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileEditData) => void;
  initialData: ProfileEditData;
}

export function ProfileEditModal({ isOpen, onClose, onSave, initialData }: ProfileEditModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Renderizar en portal para evitar problemas de z-index y posicionamiento
  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay con animación */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content con scroll interno */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto max-h-[90vh]">
              <Card
                className="border-0 shadow-2xl"
                style={{
                  backgroundColor: colors.surface,
                  boxShadow: `0 25px 50px ${colors.shadowLarge}`,
                }}
              >
                <CardHeader className="pb-4 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" style={{ color: colors.primary[500] }} />
                      <span style={{ color: colors.text }}>Editar Perfil</span>
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Información de Contacto */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="h-4 w-4" style={{ color: colors.primary[500] }} />
                      <h3 className="font-medium" style={{ color: colors.text }}>
                        Información de Contacto
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-phone" style={{ color: colors.text }}>
                        Teléfono
                      </Label>
                      <Input
                        id="edit-phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Ingrese su número de teléfono"
                        className="h-11"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>

                  {/* Información Profesional */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4" style={{ color: colors.secondary[500] }} />
                      <h3 className="font-medium" style={{ color: colors.text }}>
                        Información Profesional
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-specialty" style={{ color: colors.text }}>
                          Especialidad
                        </Label>
                        <Input
                          id="edit-specialty"
                          value={formData.specialty}
                          onChange={(e) => handleInputChange("specialty", e.target.value)}
                          placeholder="Ej: Terapia Ocupacional"
                          className="h-11"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text,
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-license" style={{ color: colors.text }}>
                          Matrícula Profesional
                        </Label>
                        <Input
                          id="edit-license"
                          value={formData.license}
                          onChange={(e) => handleInputChange("license", e.target.value)}
                          placeholder="Ej: MP 12345"
                          className="h-11"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-experience" style={{ color: colors.text }}>
                        Años de Experiencia
                      </Label>
                      <Input
                        id="edit-experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="Ej: 8 años"
                        className="h-11"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>

                  {/* Biografía Profesional */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4" style={{ color: colors.accent[500] }} />
                      <h3 className="font-medium" style={{ color: colors.text }}>
                        Biografía Profesional
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-bio" style={{ color: colors.text }}>
                        Descripción Profesional
                      </Label>
                      <Textarea
                        id="edit-bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Describa su experiencia, especialidades y enfoque profesional..."
                        className="min-h-[120px] resize-none"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      />
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        Esta información aparecerá en su perfil profesional
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div
                    className="flex justify-between pt-4 border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      style={{
                        borderColor: colors.border,
                        color: colors.textSecondary,
                      }}
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{
                        backgroundColor: colors.primary[500],
                        color: colors.surface,
                      }}
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Guardando...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Renderizar en portal directamente en el body
  return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null;
}
