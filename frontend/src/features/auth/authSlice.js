import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const signup = createAsyncThunk('auth/signup', async (payload, thunkAPI) => {
  const { data } = await api.post('/auth/signup', payload)
  return data
})

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  const { data } = await api.post('/auth/login', payload)
  // data = { token }
  localStorage.setItem('token', data.token)
  return data
})

const slice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token') || null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      state.token = null
      localStorage.removeItem('token')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s)=>{ s.status='loading'; s.error=null })
      .addCase(login.fulfilled, (s, a) => { s.status='succeeded'; s.token = a.payload.token })
      .addCase(login.rejected, (s, a) => { s.status='failed'; s.error = a.error.message })
  }
})

export const { logout } = slice.actions
export default slice.reducer
