// Utilidades para manejar el almacenamiento de firmas digitales

export interface StoredSignature {
  signature: string // Base64 de la imagen de la firma
  signatureKey?: string // Key para descargar del servidor
  name: string // Nombre y apellido para aclaración
  timestamp: string // Fecha y hora de creación
}

export const signatureStorage = {
  // Guardar firma en localStorage
  save: (signature: string, name: string): void => {
    const signatureData: StoredSignature = {
      signature,
      name,
      timestamp: new Date().toISOString()
    }
    
    try {
      localStorage.setItem('userSignature', JSON.stringify(signatureData))
    } catch (error) {
      console.error('Error guardando firma:', error)
      throw new Error('No se pudo guardar la firma')
    }
  },

  // Obtener firma del localStorage
  get: (): StoredSignature | null => {
    try {
      const stored = localStorage.getItem('userSignature')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error obteniendo firma:', error)
      return null
    }
  },

  // Verificar si existe una firma
  exists: (): boolean => {
    return signatureStorage.get() !== null
  },

  // Eliminar firma
  remove: (): void => {
    try {
      localStorage.removeItem('userSignature')
    } catch (error) {
      console.error('Error eliminando firma:', error)
    }
  },

  // Validar firma
  validate: (signature: StoredSignature): boolean => {
    return !!(
      signature.signature && 
      signature.name && 
      signature.timestamp &&
      signature.signature.startsWith('data:image/')
    )
  }
}

// Hook personalizado para usar la firma
export const useSignature = () => {
  const getSignature = () => signatureStorage.get()
  const saveSignature = (signature: string, name: string) => signatureStorage.save(signature, name)
  const hasSignature = () => signatureStorage.exists()
  const removeSignature = () => signatureStorage.remove()

  return {
    getSignature,
    saveSignature,
    hasSignature,
    removeSignature
  }
}