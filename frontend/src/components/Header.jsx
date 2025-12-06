// frontend/src/components/Header.jsx
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export default function Header(){
  const token = useSelector(s => s.auth.token)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    nav('/login')
  }

  // auth pages: show small logo only
  if (pathname === '/login' || pathname === '/signup') {
    return (
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link to="/" style={{ fontWeight: 700, color:'#7c3aed', textDecoration:'none' }}>
            ExpenseTracker
          </Link>
        </nav>
      </header>
    )
  }

  // normal header for other pages
  return (
    <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
      <nav style={{ display:'flex', gap:12 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/expenses">Expenses</Link>
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  )
}
