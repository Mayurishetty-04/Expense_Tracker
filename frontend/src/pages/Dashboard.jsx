// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import dayjs from 'dayjs';
// removed DashboardStats import to avoid duplicate rendering

function StatCard({ title, value, accent }) {
  return (
    <div className="stat-card" style={{ ['--accent']: accent }}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function CategoryRow({ name, amount, percent, color }) {
  return (
    <div className="cat-row">
      <div className="cat-color" style={{ background: color }} />
      <div className="cat-name">{name}</div>
      <div className="cat-amount">₹{amount.toLocaleString()}</div>
      <div className="cat-percent">{Math.round(percent)}%</div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, byCategory: {} });
  const [recent, setRecent] = useState([]);
  const month = dayjs().format('YYYY-MM');

  useEffect(() => {
    async function load() {
      try {
        const s = await api.get('/expenses/summary', { params: { month } });
        setSummary(s.data);
      } catch (e) {
        console.error('summary load', e);
      }
      try {
        const r = await api.get('/expenses', { params: { from: `${month}-01`, to: `${month}-31` }});
        setRecent(r.data.slice(0, 6));
      } catch (e) {
        console.error('recent load', e);
      }
    }
    load();
  }, [month]);

  const total = summary.total || 0;
  const categories = summary.byCategory || {};
  const catEntries = Object.entries(categories);
  const colors = ['#7c3aed','#06b6d4','#ef4444','#f59e0b','#10b981','#6366f1','#ec4899','#f97316'];

  // Build donut segments
  const segments = catEntries.map(([k, v], i) => ({
    name: k,
    amount: v,
    color: colors[i % colors.length],
    percent: total ? (v / total) * 100 : 0,
  }));

  // average per day — keep your previous definition (dividing by days in month)
  const averagePerDay = total ? (total / dayjs().daysInMonth()).toFixed(2) : 0;

  // Derived values for top stat cards
// Derived values for top stat cards
const totalThisMonthDisplay = `₹${Number(total).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const categoriesUsed = Object.keys(summary.byCategory || {}).length;

const daysInMonth = dayjs().daysInMonth();
const averageDisplay = `₹${Number(total / daysInMonth || 0).toFixed(0)}`;

const recentCount = recent.length;

  // accent colors for stat cards (match your theme)
  const accents = ['#7c3aed','#06b6d4','#f59e0b','#10b981'];

  return (
    <div className="dashboard-page">
      <section className="hero">
        <div className="hero-left">
          <h1>Welcome back 👋</h1>
          <p className="hero-sub">Here's your spending summary for <strong>{dayjs().format('MMMM YYYY')}</strong></p>
        </div>
        <div className="hero-right">
          <div className="sparkle">✨</div>
        </div>
      </section>

      {/* Top stat cards — rendered once here to avoid duplication */}
      <section className="stats-grid" style={{ marginTop: 20 }}>
        <StatCard title="Total this month" value={totalThisMonthDisplay} accent={accents[0]} />
        <StatCard title="Categories used" value={categoriesUsed} accent={accents[1]} />
        <StatCard title="Average / day" value={averageDisplay} accent={accents[2]} />
        <StatCard title="Recent expenses" value={recentCount} accent={accents[3]} />
      </section>

      <section className="breakdown">
        <div className="donut-card">
          <div className="donut">
            {/* donut built by conic-gradient */}
            <div
              className="donut-inner"
              style={{
                background: `conic-gradient(${segments.map(s => `${s.color} ${s.percent}%`).join(', ')})`
              }}
            />
            <div className="donut-center">
              <div className="donut-number">₹{total.toLocaleString()}</div>
              <div className="donut-label">total</div>
            </div>
          </div>
        </div>

        <div className="category-list">
          <h3>Category breakdown</h3>
          {segments.length === 0 && <p className="muted">No expenses for this month yet.</p>}
          {segments.map((s, idx) => (
            <CategoryRow
              key={s.name}
              name={s.name}
              amount={s.amount}
              percent={s.percent}
              color={s.color}
            />
          ))}
        </div>
      </section>

      <section className="recent">
        <h3>Recent expenses</h3>
        <div className="recent-table">
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Amount</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan="4" className="muted">No recent expenses</td></tr>
              ) : recent.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td>₹{Number(r.amount).toLocaleString()}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button className="fab" title="Add expense" onClick={() => window.location.href = '/expenses/new'}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
