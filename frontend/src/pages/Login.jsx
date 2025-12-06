import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();
  const status = useSelector((s) => s.auth.status);

  const handle = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      nav('/dashboard');
    } catch (err) {
      alert(err?.message || 'Login failed');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handle}>
          <div className="form-row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn">
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
            <Link to="/signup" className="btn ghost" style={{ textDecoration: 'none', padding: '8px 12px' }}>
              Signup
            </Link>
          </div>

          <div className="form-actions">
            <small>Don't have an account? Click Signup.</small>
          </div>
        </form>
      </div>
    </div>
  );
}
