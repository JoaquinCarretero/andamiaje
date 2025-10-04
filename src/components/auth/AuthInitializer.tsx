"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { getProfileThunk, setInitialized } from '@/store/slices/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(getProfileThunk()).unwrap();
      } catch {
        console.log('No hay sesión activa');
      } finally {
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch]);

  return null;
}
