import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { LoginDto, UserI } from '@/types/auth'

interface AuthState {
  isAuthenticated: boolean
  user: UserI | null
  loading: boolean
  error: string | null
  initialized: boolean // Para saber si ya se intentó cargar el usuario inicial
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  initialized: false,
}

// Thunks asíncronos
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (loginDto: LoginDto, { rejectWithValue }) => {
    try {
      const user = await apiClient.login(loginDto)
      AuthService.setUser(user)
      return { user }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error de autenticación')
    }
  },
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await apiClient.logout()
  localStorage.removeItem('authUser')
})

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.getCurrentUser()
      if (user) {
        return { user }
      }
      return rejectWithValue('No authenticated user found')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error checking auth status')
    }
  },
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.loading = false
      })
      // Check Auth
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading = true
        state.initialized = false
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.loading = false
        state.initialized = true
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.isAuthenticated = false
        state.user = null
        state.loading = false
        state.initialized = true
        // NO establecemos el error aquí para evitar mostrarlo en la UI
        // durante la carga inicial. Un fallo aquí es esperado si el
        // usuario no está logueado.
        state.error = null;
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer