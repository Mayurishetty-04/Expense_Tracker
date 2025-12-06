import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ExpensesList from './pages/ExpensesList'
import ExpenseForm from './pages/ExpenseForm'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard/></ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute><ExpensesList/></ProtectedRoute>
          } />
          <Route path="/expenses/new" element={
            <ProtectedRoute><ExpenseForm/></ProtectedRoute>
          } />
          <Route path="/expenses/:id/edit" element={
            <ProtectedRoute><ExpenseForm edit /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  )
}
