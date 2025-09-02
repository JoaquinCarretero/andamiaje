"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  CreditCard,
  Lock,
  User,
  Mail,
  UserPlus,
  Sparkles,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignatureModal } from "@/components/ui/signature-modal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";
import colors from "@/lib/colors";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDniChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    handleInputChange("dni", numericValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    }

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (formData.dni.length < 7 || formData.dni.length > 8) {
      newErrors.dni = "El DNI debe tener entre 7 y 8 dígitos";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    }

    if (!formData.role) {
      newErrors.role = "Debe seleccionar un rol";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!signature) {
      newErrors.signature = "La firma digital es obligatoria";
    }

    if (!signatureName.trim()) {
      newErrors.signatureName = "La aclaración de firma es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignatureConfirm = (signatureData: string, name: string) => {
    setSignature(signatureData);
    setSignatureName(name);
    setShowSignatureModal(false);
    // Limpiar errores relacionados con la firma
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.signature;
      delete newErrors.signatureName;
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      // Simular registro con firma
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Guardar firma en localStorage para uso posterior
      if (signature && signatureName) {
        localStorage.setItem(
          "userSignature",
          JSON.stringify({
            signature,
            name: signatureName,
            timestamp: new Date().toISOString(),
          })
        );
      }

      router.push("/login");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl"
      >
        <Card
          className="border-0 shadow-xl"
          style={{
            backgroundColor: colors.surface,
            boxShadow: `0 20px 40px ${colors.shadowLarge}`,
          }}
        >
          {/* Encabezado reorganizado */}
          <div className="flex items-center justify-between p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-72 h-36 relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center scale-125">
                <Image
                  src="/LogotipoFinalWEBJPEG.png"
                  alt="Andamiaje Logo"
                  fill
                  className="object-contain scale-150"
                />
              </div>
            </motion.div>

            <div className="text-right space-y-1">
              <h1
                className="text-3xl font-display font-bold flex items-center justify-end gap-2"
                style={{ color: colors.text }}
              >
                <UserPlus
                  className="h-6 w-6"
                  style={{ color: colors.secondary[500] }}
                />
                Registro
              </h1>
              <p className="text-base" style={{ color: colors.textMuted }}>
                Complete sus datos para unirse a nuestra plataforma
              </p>
            </div>
          </div>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Layout horizontal optimizado - 3 columnas como en la imagen */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Datos Personales */}
                <div
                  className="p-6 rounded-lg border-l-4 space-y-4"
                  style={{
                    backgroundColor: colors.primary[50],
                    borderLeftColor: colors.primary[500],
                  }}
                >
                  <h3
                    className="font-medium text-lg"
                    style={{ color: colors.text }}
                  >
                    Datos Personales
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          style={{ color: colors.text }}
                        >
                          Nombre *
                        </Label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                            style={{ color: colors.textMuted }}
                          />
                          <Input
                            id="firstName"
                            placeholder="Juan"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className={`pl-10 h-12 rounded-lg border-2 transition-all duration-200 ${
                              errors.firstName ? "border-red-500" : ""
                            }`}
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.firstName
                                ? colors.error[500]
                                : colors.border,
                              color: colors.text,
                            }}
                            required
                          />
                        </div>
                        {errors.firstName && (
                          <p
                            className="text-sm"
                            style={{ color: colors.error[500] }}
                          >
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          style={{ color: colors.text }}
                        >
                          Apellido *
                        </Label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                            style={{ color: colors.textMuted }}
                          />
                          <Input
                            id="lastName"
                            placeholder="Pérez"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className={`pl-10 h-12 rounded-lg border-2 transition-all duration-200 ${
                              errors.lastName ? "border-red-500" : ""
                            }`}
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.lastName
                                ? colors.error[500]
                                : colors.border,
                              color: colors.text,
                            }}
                            required
                          />
                        </div>
                        {errors.lastName && (
                          <p
                            className="text-sm"
                            style={{ color: colors.error[500] }}
                          >
                            {errors.lastName}
                          </p>
                        )}
                      </div>

                      {/* <div className="space-y-2">
                        <Label htmlFor="dni" style={{ color: colors.text }}>
                          DNI *
                        </Label>
                        <div className="relative">
                          <CreditCard 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                            style={{ color: colors.textMuted }}
                          />
                          <Input
                            id="dni"
                            placeholder="12345678"
                            value={formData.dni}
                            onChange={(e) => handleDniChange(e.target.value)}
                            maxLength={8}
                            className={`pl-10 h-12 rounded-lg border-2 transition-all duration-200 ${errors.dni ? 'border-red-500' : ''}`}
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.dni ? colors.error[500] : colors.border,
                              color: colors.text
                            }}
                            required
                          />
                        </div>
                        {errors.dni && (
                          <p className="text-sm" style={{ color: colors.error[500] }}>
                            {errors.dni}
                          </p>
                        )}
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="role" style={{ color: colors.text }}>
                          Rol profesional *
                        </Label>
                        <select
                          id="role"
                          value={formData.role}
                          onChange={(e) =>
                            handleInputChange("role", e.target.value)
                          }
                          className={`flex h-12 w-full rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200 ${
                            errors.role ? "border-red-500" : ""
                          }`}
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: errors.role
                              ? colors.error[500]
                              : colors.border,
                            color: colors.text,
                          }}
                          required
                        >
                          <option value="">Seleccionar rol</option>
                          <option value="terapeuta">Terapeuta</option>
                          <option value="acompanante">
                            Acompañante Externo
                          </option>
                          <option value="coordinador">Coordinador</option>
                        </select>
                        {errors.role && (
                          <p
                            className="text-sm"
                            style={{ color: colors.error[500] }}
                          >
                            {errors.role}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" style={{ color: colors.text }}>
                          Correo electrónico *
                        </Label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                            style={{ color: colors.textMuted }}
                          />
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className={`pl-10 h-12 rounded-lg border-2 transition-all duration-200 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: errors.email
                                ? colors.error[500]
                                : colors.border,
                              color: colors.text,
                            }}
                            required
                          />
                        </div>
                        {errors.email && (
                          <p
                            className="text-sm"
                            style={{ color: colors.error[500] }}
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" style={{ color: colors.text }}>
                          Teléfono *
                        </Label>
                        <PhoneInput
                          country={"ar"}
                          value={phone}
                          onChange={(phone) => setPhone(phone)}
                          inputClass="!w-full !h-12 !pl-[48px] !rounded-lg !text-base !border-2"
                          containerClass="!w-full"
                          buttonClass="!border-0 !border-r !rounded-l-lg"
                          inputStyle={{
                            backgroundColor: colors.surface,
                            borderColor: errors.phone
                              ? colors.error[500]
                              : colors.border,
                            color: colors.text,
                          }}
                        />
                        {errors.phone && (
                          <p
                            className="text-sm"
                            style={{ color: colors.error[500] }}
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credenciales de Acceso */}
                <div
                  className="p-6 rounded-lg border-l-4 space-y-4"
                  style={{
                    backgroundColor: colors.secondary[50],
                    borderLeftColor: colors.secondary[500],
                  }}
                >
                  <h3
                    className="font-medium text-lg"
                    style={{ color: colors.text }}
                  >
                    Credenciales de Acceso
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="dni" style={{ color: colors.text }}>
                      DNI *
                    </Label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                        style={{ color: colors.textMuted }}
                      />
                      <Input
                        id="dni"
                        placeholder="12345678"
                        value={formData.dni}
                        onChange={(e) => handleDniChange(e.target.value)}
                        maxLength={8}
                        className={`pl-10 h-12 rounded-lg border-2 transition-all duration-200 ${
                          errors.dni ? "border-red-500" : ""
                        }`}
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: errors.dni
                            ? colors.error[500]
                            : colors.border,
                          color: colors.text,
                        }}
                        required
                      />
                    </div>
                    {errors.dni && (
                      <p
                        className="text-sm"
                        style={{ color: colors.error[500] }}
                      >
                        {errors.dni}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" style={{ color: colors.text }}>
                        Contraseña *
                      </Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: colors.textMuted }}
                        />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="**********"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`pl-10 pr-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: errors.password
                              ? colors.error[500]
                              : colors.border,
                            color: colors.text,
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff
                              className="h-4 w-4"
                              style={{ color: colors.textMuted }}
                            />
                          ) : (
                            <Eye
                              className="h-4 w-4"
                              style={{ color: colors.textMuted }}
                            />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p
                          className="text-sm"
                          style={{ color: colors.error[500] }}
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="confirmPassword" style={{ color: colors.text }}>
                        Confirmar contraseña *
                      </Label>
                      <div className="relative">
                        <Lock 
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" 
                          style={{ color: colors.textMuted }}
                        />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`pl-10 pr-12 h-12 rounded-lg border-2 transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: errors.confirmPassword ? colors.error[500] : colors.border,
                            color: colors.text
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" style={{ color: colors.textMuted }} />
                          ) : (
                            <Eye className="h-4 w-4" style={{ color: colors.textMuted }} />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm" style={{ color: colors.error[500] }}>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div> */}
                  </div>
                </div>

                {/* Firma Digital */}
                <div
                  className="p-6 rounded-lg border-l-4 space-y-4"
                  style={{
                    backgroundColor: colors.accent[50],
                    borderLeftColor: colors.accent[500],
                  }}
                >
                  <h3
                    className="font-medium text-lg"
                    style={{ color: colors.text }}
                  >
                    Firma Digital
                  </h3>

                  <div
                    className="p-4 rounded-lg border-2 border-dashed"
                    style={{
                      backgroundColor: colors.warning[50],
                      borderColor: colors.warning[500],
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: colors.warning[500] }}
                      />
                      <div className="text-sm space-y-1">
                        <p
                          className="font-medium"
                          style={{ color: colors.warning[600] }}
                        >
                          Aviso Legal Importante
                        </p>
                        <p style={{ color: colors.warning[600] }}>
                          Su firma digital será utilizada para validar
                          documentos oficiales y reportes profesionales. Esta
                          firma tiene validez legal y será asociada
                          permanentemente a su cuenta profesional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label style={{ color: colors.text }}>
                        Firma Digital *
                      </Label>
                      <div
                        className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                          signature
                            ? "border-green-300 bg-green-50"
                            : errors.signature
                            ? "border-red-500 bg-red-50"
                            : "border-dashed"
                        }`}
                        style={{
                          borderColor: signature
                            ? colors.success[500]
                            : errors.signature
                            ? colors.error[500]
                            : colors.border,
                          backgroundColor: signature
                            ? colors.success[50]
                            : errors.signature
                            ? colors.error[50]
                            : colors.surface,
                        }}
                      >
                        {signature ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.success[600] }}
                              >
                                ✓ Firma registrada correctamente
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSignatureModal(true)}
                                className="text-xs"
                              >
                                Cambiar firma
                              </Button>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white rounded border">
                              <img
                                src={signature}
                                alt="Firma digital"
                                className="max-h-16 max-w-full object-contain"
                              />
                            </div>
                            <p
                              className="text-sm text-center font-medium"
                              style={{ color: colors.text }}
                            >
                              {signatureName}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-3">
                            <PenTool
                              className="h-8 w-8 mx-auto"
                              style={{ color: colors.textMuted }}
                            />
                            <div>
                              <p
                                className="text-sm font-medium mb-1"
                                style={{ color: colors.text }}
                              >
                                Registre su firma digital
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: colors.textMuted }}
                              >
                                Esta firma será utilizada en todos sus
                                documentos oficiales
                              </p>
                            </div>
                            <Button
                              type="button"
                              onClick={() => setShowSignatureModal(true)}
                              className="w-full"
                              style={{
                                backgroundColor: colors.accent[500],
                                color: colors.surface,
                              }}
                            >
                              <PenTool className="h-4 w-4 mr-2" />
                              Crear Firma Digital
                            </Button>
                          </div>
                        )}
                      </div>
                      {errors.signature && (
                        <p
                          className="text-sm"
                          style={{ color: colors.error[500] }}
                        >
                          {errors.signature}
                        </p>
                      )}
                      {errors.signatureName && (
                        <p
                          className="text-sm"
                          style={{ color: colors.error[500] }}
                        >
                          {errors.signatureName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Términos y Condiciones */}
              {/* <div 
                className="flex items-start space-x-3 p-6 rounded-lg" 
                style={{ backgroundColor: colors.neutral[50] }}
              >
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 rounded border-2 text-primary focus:ring-primary focus:ring-offset-0"
                  style={{ borderColor: colors.border }}
                  required
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    Acepto los{" "}
                    <Link href="/terms" className="font-medium hover:underline transition-colors duration-200" style={{ color: colors.primary[500] }}>
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacy" className="font-medium hover:underline transition-colors duration-200" style={{ color: colors.primary[500] }}>
                      política de privacidad
                    </Link>
                    . Confirmo que mi firma digital será utilizada para validar documentos oficiales.
                  </Label>
                </div>
              </div> */}

              <Button
                type="submit"
                className="w-full h-14 rounded-lg font-medium text-base transition-all duration-200 hover:scale-105 hover:shadow-medium"
                style={{
                  backgroundColor: colors.secondary[500],
                  color: colors.surface,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Crear Cuenta
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-6">
            <p className="text-sm" style={{ color: colors.textMuted }}>
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: colors.primary[500] }}
              >
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Modal de Firma */}
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onConfirm={handleSignatureConfirm}
          initialName={`${formData.firstName} ${formData.lastName}`.trim()}
        />
      </motion.div>
    </div>
  );
}
