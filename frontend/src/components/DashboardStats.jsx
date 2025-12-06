// src/components/DashboardStats.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectMonthStats, selectTotalAllTime } from '../features/expenses/selectors';

export default function DashboardStats() {
  const {
    totalThisMonth = 0,
    categoriesUsed = 0,
    averagePerDay = 0,
    daysElapsed = 0,
    recentCount = 0
  } = useSelector(selectMonthStats) || {};

  const totalAll = useSelector(selectTotalAllTime) || 0;

  const fmtCurrency = (n) => {
    const v = Number(n || 0);
    return `₹${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };
  const fmtCurrencyFloat = (n) => {
    const v = Number(n || 0);
    return `₹${v.toFixed(0)}`;
  };

  const statsGridStyle = {
    display: 'grid',
    /* four columns, but each column won't shrink below 220px — keeps cards wide */
    gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
    gap: 18,
    alignItems: 'stretch',
    width: '100%',
    marginTop: 20,
  };

  const lowerRowStyle = {
    display: 'grid',
    /* left small, right large (wider card for breakdown) */
    gridTemplateColumns: '1fr 1.6fr',
    gap: 22,
    marginTop: 22,
    width: '100%',
  };

  const cardInnerStyle = { padding: 20, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' };

  return (
    <div style={{ width: '100%' }}>
      {/* Top 4 stat cards (uses robust inline grid so it spans the page) */}
      <div className="stats-grid" style={statsGridStyle}>
        <div className="stat-card" style={{ ...cardInnerStyle }}>
          <div className="stat-title">Total this month</div>
          <div className="stat-value" style={{ marginTop: 12 }}>{fmtCurrency(totalThisMonth)}</div>
        </div>

        <div className="stat-card" style={{ ...cardInnerStyle }}>
          <div className="stat-title">Categories used</div>
          <div className="stat-value" style={{ marginTop: 12 }}>{categoriesUsed}</div>
        </div>

        <div className="stat-card" style={{ ...cardInnerStyle }}>
          <div className="stat-title">Average / day <small style={{ color: '#99a0b0', marginLeft: 8 }}>(over {daysElapsed} days)</small></div>
          <div className="stat-value" style={{ marginTop: 12 }}>{fmtCurrencyFloat(averagePerDay)}</div>
        </div>

        <div className="stat-card" style={{ ...cardInnerStyle }}>
          <div className="stat-title">Recent expenses</div>
          <div className="stat-value" style={{ marginTop: 12 }}>{recentCount}</div>
        </div>
      </div>

      {/* Two-column row below (left = total all, right = category breakdown area) */}
      <div style={lowerRowStyle}>
        {/* Left: total-all card */}
        <div className="table-card" style={{ ...cardInnerStyle }}>
          <div style={{ fontSize: 20, marginBottom: 10 }}>{fmtCurrency(totalAll)}</div>
          <div style={{ fontSize: 20 }}>total</div>
        </div>

        {/* Right: category breakdown card placeholder */}
        <div className="category-list" style={{ ...cardInnerStyle }}>
          <h3 style={{ margin: 0, marginBottom: 12, fontSize: 22, color: '#071428' }}>Category breakdown</h3>

          {totalThisMonth === 0 ? (
            <p style={{ color: '#475569', marginTop: 12 }}>No expenses for this month yet.</p>
          ) : (
            <div style={{ marginTop: 12 }}>
              {/* If you want category sums/donut here I can add that rendering. */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
