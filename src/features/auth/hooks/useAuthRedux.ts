'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { logoutThunk, setUser } from '../store/authSlice';
import { useRouter } from 'next/navigation';
import { UserI } from '@/types/auth';

export function useAuthRedux() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading, error, initialized } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push('/login');
  };

  const handleUpdateUser = (updates: Partial<UserI>) => {
    if (user) {
      dispatch(setUser({ ...user, ...updates }));
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    initialized,
    logout: handleLogout,
    updateUser: handleUpdateUser,
  };
}
