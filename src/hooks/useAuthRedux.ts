import { useAppDispatch, useAppSelector } from '@/store';
import { logout, updateUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { UserI } from '@/types/auth';

export function useAuthRedux() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading, error, initialized } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const handleUpdateUser = (updates: Partial<UserI>) => {
    dispatch(updateUser(updates));
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
