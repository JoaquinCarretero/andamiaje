// Sistema de avatares para usuarios
import { 
  FaUser, 
  FaUserMd, 
  FaUserNurse, 
  FaUserTie, 
  FaUserGraduate,
  FaUserFriends,
  FaUserCheck,
  FaUserCog,
  FaUserShield,
  FaUserEdit
} from "react-icons/fa"
import { 
  GiDoctorFace, 
  GiNurseFemale, 
  GiNurseMale,
  GiMedicalPack,
  GiHealthNormal,
  GiHealthIncrease,
  GiMedicines,
  GiStethoscope
} from "react-icons/gi"
import { 
  MdPerson, 
  MdPersonOutline, 
  MdFace, 
  MdFace2, 
  MdFace3, 
  MdFace4, 
  MdFace5, 
  MdFace6,
  MdEmojiPeople,
  MdSentimentSatisfied,
  MdSentimentVeryDissatisfied,
  MdSentimentVerySatisfied
} from "react-icons/md"
import { 
  BsPerson, 
  BsPersonFill, 
  BsPersonHeart, 
  BsPersonCheck, 
  BsPersonPlus,
  BsPersonBadge,
  BsPersonWorkspace,
  BsPersonGear
} from "react-icons/bs"
import { 
  IoPersonOutline, 
  IoPersonSharp, 
  IoPerson, 
  IoHappyOutline,
  IoHappy,
  IoBodyOutline,
  IoBody
} from "react-icons/io5"

export interface AvatarOption {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  category: 'medical' | 'professional' | 'casual'
  color: string
}

export const avatarOptions: AvatarOption[] = [
  // Categoría Médica - Avatares de doctores y enfermeras
  {
    id: 'doctor-1',
    name: 'Doctor',
    icon: FaUserMd,
    category: 'medical',
    color: '#14b8a6'
  },
  {
    id: 'nurse-female',
    name: 'Enfermera',
    icon: FaUserNurse,
    category: 'medical',
    color: '#a855f7'
  },
  {
    id: 'doctor-face',
    name: 'Doctor Especialista',
    icon: GiDoctorFace,
    category: 'medical',
    color: '#3b82f6'
  },
  {
    id: 'nurse-male',
    name: 'Enfermero',
    icon: GiNurseMale,
    category: 'medical',
    color: '#22c55e'
  },
  {
    id: 'nurse-female-2',
    name: 'Enfermera Profesional',
    icon: GiNurseFemale,
    category: 'medical',
    color: '#f59e0b'
  },
  {
    id: 'medical-specialist',
    name: 'Especialista Médico',
    icon: GiMedicalPack,
    category: 'medical',
    color: '#ef4444'
  },
  {
    id: 'health-professional',
    name: 'Profesional de Salud',
    icon: GiHealthNormal,
    category: 'medical',
    color: '#8b5cf6'
  },
  {
    id: 'therapist',
    name: 'Terapeuta',
    icon: GiStethoscope,
    category: 'medical',
    color: '#06b6d4'
  },
  {
    id: 'health-increase',
    name: 'Rehabilitador',
    icon: GiHealthIncrease,
    category: 'medical',
    color: '#10b981'
  },
  {
    id: 'medicines',
    name: 'Farmacéutico',
    icon: GiMedicines,
    category: 'medical',
    color: '#f97316'
  },

  // Categoría Profesional
  {
    id: 'executive',
    name: 'Ejecutivo',
    icon: FaUserTie,
    category: 'professional',
    color: '#1f2937'
  },
  {
    id: 'academic',
    name: 'Académico',
    icon: FaUserGraduate,
    category: 'professional',
    color: '#7c3aed'
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    icon: FaUserCheck,
    category: 'professional',
    color: '#059669'
  },
  {
    id: 'coordinator',
    name: 'Coordinador',
    icon: FaUserCog,
    category: 'professional',
    color: '#dc2626'
  },
  {
    id: 'director',
    name: 'Director',
    icon: FaUserShield,
    category: 'professional',
    color: '#9333ea'
  },
  {
    id: 'certified',
    name: 'Certificado',
    icon: BsPersonBadge,
    category: 'professional',
    color: '#0891b2'
  },
  {
    id: 'specialist',
    name: 'Especialista',
    icon: BsPersonWorkspace,
    category: 'professional',
    color: '#ea580c'
  },
  {
    id: 'editor',
    name: 'Editor',
    icon: FaUserEdit,
    category: 'professional',
    color: '#84cc16'
  },
  {
    id: 'gear-person',
    name: 'Técnico',
    icon: BsPersonGear,
    category: 'professional',
    color: '#6366f1'
  },

  // Categoría Casual - Avatares de personas amigables
  {
    id: 'person-happy',
    name: 'Persona Alegre',
    icon: IoHappy,
    category: 'casual',
    color: '#f59e0b'
  },
  {
    id: 'person-outline',
    name: 'Persona Simple',
    icon: IoPersonOutline,
    category: 'casual',
    color: '#6b7280'
  },
  {
    id: 'face-1',
    name: 'Rostro Amigable',
    icon: MdFace,
    category: 'casual',
    color: '#10b981'
  },
  {
    id: 'face-2',
    name: 'Rostro Sonriente',
    icon: MdFace2,
    category: 'casual',
    color: '#f97316'
  },
  {
    id: 'face-3',
    name: 'Rostro Profesional',
    icon: MdFace3,
    category: 'casual',
    color: '#8b5cf6'
  },
  {
    id: 'face-4',
    name: 'Rostro Confiable',
    icon: MdFace4,
    category: 'casual',
    color: '#06b6d4'
  },
  {
    id: 'face-5',
    name: 'Rostro Cálido',
    icon: MdFace5,
    category: 'casual',
    color: '#84cc16'
  },
  {
    id: 'face-6',
    name: 'Rostro Sereno',
    icon: MdFace6,
    category: 'casual',
    color: '#ec4899'
  },
  {
    id: 'person-heart',
    name: 'Persona Empática',
    icon: BsPersonHeart,
    category: 'casual',
    color: '#f43f5e'
  },
  {
    id: 'person-satisfied',
    name: 'Persona Satisfecha',
    icon: MdSentimentSatisfied,
    category: 'casual',
    color: '#22c55e'
  },
  {
    id: 'person-very-satisfied',
    name: 'Persona Muy Feliz',
    icon: MdSentimentVerySatisfied,
    category: 'casual',
    color: '#eab308'
  },
  {
    id: 'person-social',
    name: 'Persona Sociable',
    icon: MdEmojiPeople,
    category: 'casual',
    color: '#3b82f6'
  },
  {
    id: 'person-fill',
    name: 'Persona Completa',
    icon: BsPersonFill,
    category: 'casual',
    color: '#64748b'
  },
  {
    id: 'person-plus',
    name: 'Persona Positiva',
    icon: BsPersonPlus,
    category: 'casual',
    color: '#16a34a'
  },
  {
    id: 'person-sharp',
    name: 'Persona Decidida',
    icon: IoPersonSharp,
    category: 'casual',
    color: '#dc2626'
  },
  {
    id: 'person-friends',
    name: 'Persona Amigable',
    icon: FaUserFriends,
    category: 'casual',
    color: '#7c3aed'
  }
]

const avatarStorage = {
  // Guardar avatar seleccionado
  save: (avatarId: string): void => {
    try {
      localStorage.setItem('userAvatar', JSON.stringify({
        id: avatarId,
        timestamp: new Date().toISOString(),
        isCustomSelected: true
      }))
    } catch (error) {
      console.error('Error guardando avatar:', error)
    }
  },

  // Obtener avatar actual
  get: (): { id: string; isCustomSelected: boolean } | null => {
    try {
      const stored = localStorage.getItem('userAvatar')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error obteniendo avatar:', error)
      return null
    }
  },

  // Generar avatar aleatorio
  generateRandom: (): string => {
    const randomIndex = Math.floor(Math.random() * avatarOptions.length)
    return avatarOptions[randomIndex].id
  },

  // Obtener avatar actual o generar uno aleatorio
  getCurrentOrRandom: (): string => {
    const stored = avatarStorage.get()
    
    // Si tiene un avatar personalizado seleccionado, usarlo
    if (stored?.isCustomSelected) {
      return stored.id
    }
    
    // Si no, generar uno aleatorio cada vez
    return avatarStorage.generateRandom()
  },

  // Verificar si el usuario ha seleccionado un avatar personalizado
  hasCustomAvatar: (): boolean => {
    const stored = avatarStorage.get()
    return stored?.isCustomSelected || false
  }
}

export const useAvatar = () => {
  const getCurrentAvatar = () => avatarStorage.getCurrentOrRandom()
  const saveAvatar = (avatarId: string) => avatarStorage.save(avatarId)
  const hasCustomAvatar = () => avatarStorage.hasCustomAvatar()
  const getAvatarOption = (id: string) => avatarOptions.find(option => option.id === id)

  return {
    getCurrentAvatar,
    saveAvatar,
    hasCustomAvatar,
    getAvatarOption,
    avatarOptions
  }
}