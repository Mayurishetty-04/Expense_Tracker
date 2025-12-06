import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import expensesReducer from '../features/expenses/expensesSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
  }
})

export default store
