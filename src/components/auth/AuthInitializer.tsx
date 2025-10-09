"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { checkAuthThunk } from '@/store/slices/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Esta función se encarga de verificar si existe una sesión activa
    // al cargar la aplicación por primera vez.
    const initAuth = () => {
      // No necesitamos un try/catch aquí, ya que el slice maneja
      // los estados de éxito y error internamente.
      dispatch(checkAuthThunk());
    };

    initAuth();
  }, [dispatch]);

  // Este componente no renderiza nada, solo ejecuta la lógica de inicialización.
  return null;
}