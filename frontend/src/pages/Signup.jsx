import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup({ email, password })).unwrap();
      alert('Signup successful — please login.');
      nav('/login');
    } catch (err) {
      alert(err?.message || 'Signup failed');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Create account</h2>
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
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn">Signup</button>
            <Link to="/login" className="btn ghost" style={{ textDecoration: 'none', padding: '8px 12px' }}>
              Login
            </Link>
          </div>

          <div className="form-actions">
            <small>By signing up you agree to the terms.</small>
          </div>
        </form>
      </div>
    </div>
  );
}
