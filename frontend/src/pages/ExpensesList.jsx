// frontend/src/pages/ExpensesList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, deleteExpense } from '../features/expenses/expensesSlice';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const PRESET_CATEGORIES = [
  'All', 'Groceries', 'Food', 'Transport', 'Rent', 'Bills',
  'Shopping', 'Entertainment', 'Health', 'Travel', 'Education', 'Others'
];

export default function ExpensesList() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const items = useSelector((s) => s.expenses.items || []);
  const status = useSelector((s) => s.expenses.status);
  const error = useSelector((s) => s.expenses.error);

  // filters
  const [month, setMonth] = useState(dayjs().format('YYYY-MM')); // YYYY-MM
  const [category, setCategory] = useState('All');

  // new: showAll toggle — when true, list ignores month filter and shows every entry
  const [showAll, setShowAll] = useState(false);

  // fetch list when filters change or showAll changes
  useEffect(() => {
    if (showAll) {
      // ask backend for all expenses
      dispatch(fetchExpenses());
      return;
    }
    const from = `${month}-01`;
    const to = dayjs(from).endOf('month').format('YYYY-MM-DD');
    const params = { from, to };
    if (category && category !== 'All') params.category = category;
    dispatch(fetchExpenses(params));
  }, [dispatch, month, category, showAll]);

  const derivedCategories = useMemo(() => {
    const set = new Set(PRESET_CATEGORIES);
    items.forEach(i => set.add(i.category || 'Others'));
    return Array.from(set);
  }, [items]);

  const exportCSV = () => {
    if (!items || items.length === 0) return alert('No rows to export.');
    const headers = ['id','title','amount','category','date','note'];
    const csvRows = [headers.join(',')];
    items.forEach(r => {
      const row = [
        r.id,
        `"${(r.title || '').replace(/"/g, '""')}"`,
        r.amount,
        `"${(r.category || '').replace(/"/g, '""')}"`,
        `"${dayjs(r.date).format('YYYY-MM-DD')}"`,
        `"${(r.note || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    const csvText = csvRows.join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = showAll ? `expenses_all.csv` : `expenses_${month}.csv`;
    a.setAttribute('download', fileName);
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id, date) => {
    if (!confirm('Delete this expense? This cannot be undone.')) return;
    try {
      await dispatch(deleteExpense({ id, date })).unwrap();
      // refetch (respect showAll)
      if (showAll) dispatch(fetchExpenses());
      else {
        const from = `${month}-01`;
        const to = dayjs(from).endOf('month').format('YYYY-MM-DD');
        const params = { from, to, ...(category !== 'All' ? { category } : {}) };
        dispatch(fetchExpenses(params));
      }
    } catch (err) {
      alert('Delete failed');
      console.error(err);
    }
  };

  return (
    <div className="app-background" style={{ position:'relative' }}>
      <div className="expenses-page" style={{ position:'relative', zIndex:1 }}>
        <div className="expenses-header">
          <div>
            <h1>Expenses</h1>
            <div style={{ color:'#6b7280', marginTop:6 }}>Manage your expenses — filter, export or edit entries.</div>
          </div>

          <div className="top-actions" style={{ alignItems: 'flex-start' }}>
            <button className="btn-ghost" onClick={() => nav('/dashboard')}>Back</button>
            <button className="btn-primary" onClick={() => nav('/expenses/new')}>+ Add New</button>
          </div>
        </div>

        <div style={{ marginBottom: 18, display:'flex', gap:12, alignItems:'center' }}>
          {/* Show All toggle */}
          <label style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', borderRadius:10, border:'1px solid #eef2f7', background: showAll ? 'linear-gradient(135deg,#eef2ff,#fff)' : 'transparent' }}>
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
            />
            <span style={{ fontWeight:600, color: showAll ? '#0f172a' : '#475569' }}>Show all</span>
            <span style={{ marginLeft:8, color:'#6b7280', fontSize:13 }}> (ignore month filter)</span>
          </label>

          <div style={{ display:'flex', gap:8, alignItems:'center', opacity: showAll ? 0.45 : 1 }}>
            <label style={{ color:'#475569', fontWeight:600 }}>Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ padding:8, borderRadius:8, border:'1px solid #e6edf7' }}
              disabled={showAll}
            />
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center', opacity: showAll ? 0.45 : 1 }}>
            <label style={{ color:'#475569', fontWeight:600 }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding:8, borderRadius:8, border:'1px solid #e6edf7' }}
              disabled={showAll}
            >
              {derivedCategories.map(c => <option value={c} key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
            <button className="btn-ghost" onClick={() => { setShowAll(false); setMonth(dayjs().format('YYYY-MM')); setCategory('All'); }}>Reset</button>
            <button className="btn-ghost" onClick={exportCSV}>Export CSV</button>
          </div>
        </div>

        <div className="layout-grid">
          <div className="table-card">
            {status === 'loading' && <div style={{ padding:12 }}>Loading...</div>}
            {error && <div style={{ color: 'red', padding:12 }}>{error}</div>}

            <table className="expenses-table" aria-label="expenses">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="col-amount">Amount</th>
                  <th>Category</th>
                  <th className="col-date">Date</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 18, color: '#6b7280' }}>
                      No expenses for this filter — try another month or add a new expense.
                    </td>
                  </tr>
                )}

                {items.map((e, idx) => (
                  <tr className="animated-row" key={e.id} style={{ animationDelay: `${idx * 40}ms` }}>
                    <td>{e.title}</td>
                    <td className="col-amount">₹{Number(e.amount).toLocaleString()}</td>
                    <td>{e.category}</td>
                    <td className="col-date">{dayjs(e.date).format('DD/MM/YYYY')}</td>
                    <td className="col-actions">
                      <Link to={`/expenses/${e.id}/edit`} className="action-link">Edit</Link>
                      <button className="btn-delete" onClick={() => handleDelete(e.id, e.date)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="sidebar-card">
            <h3 style={{ marginTop:0 }}>Quick tips</h3>
            <ul style={{ color:'#475569', lineHeight:1.9 }}>
              <li>Use Month + Category to narrow results quickly.</li>
              <li>Export CSV to download current filtered rows.</li>
              <li>Edit to correct entries or Delete if necessary.</li>
            </ul>
            <div style={{ marginTop:12 }}>
              <strong>Showing:</strong> {items.length} row{items.length !== 1 ? 's' : ''}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
