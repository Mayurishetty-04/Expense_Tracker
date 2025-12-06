import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const fetchExpenses = createAsyncThunk('expenses/fetch', async (params={}) => {
  const res = await api.get('/expenses', { params })
  return res.data
})

export const createExpense = createAsyncThunk('expenses/create', async (payload) => {
  const res = await api.post('/expenses', payload)
  return res.data
})

export const updateExpense = createAsyncThunk('expenses/update', async ({ id, payload }) => {
  const res = await api.put(`/expenses/${id}`, payload)
  return res.data
})

export const deleteExpense = createAsyncThunk('expenses/delete', async (id) => {
  await api.delete(`/expenses/${id}`)
  return id
})

const slice = createSlice({
  name: 'expenses',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (s, a) => { s.items = a.payload; s.status='succeeded' })
      .addCase(createExpense.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(updateExpense.fulfilled, (s, a) => {
        s.items = s.items.map(i => i.id === a.payload.id ? a.payload : i)
      })
      .addCase(deleteExpense.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload)
      })
  }
})

export default slice.reducer
