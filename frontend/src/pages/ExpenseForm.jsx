import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createExpense, updateExpense } from '../features/expenses/expensesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import dayjs from 'dayjs';

const PRESET_CATEGORIES = [
  'Groceries', 'Food', 'Transport', 'Rent', 'Bills',
  'Shopping', 'Entertainment', 'Health', 'Travel', 'Education'
];

export default function ExpenseForm({ edit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [otherCategory, setOtherCategory] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [note, setNote] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (edit && params.id) {
      api.get(`/expenses/${params.id}`)
        .then(res => {
          const e = res.data;
          setTitle(e.title || '');
          setAmount(String(e.amount || ''));
          if (PRESET_CATEGORIES.includes(e.category)) {
            setCategory(e.category);
            setOtherCategory('');
          } else {
            setCategory('Other');
            setOtherCategory(e.category || '');
          }
          setDate(e.date ? e.date.split('T')[0] : dayjs().format('YYYY-MM-DD'));
          setNote(e.note || '');
        })
        .catch(() => alert('Failed to load expense.'));
    }
  }, [edit, params.id]);

  const finalCategory = () => (category === 'Other' ? otherCategory.trim() || 'Others' : category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a title.');
    const amt = Number(amount);
    if (!amt || amt <= 0) return alert('Please enter a valid amount.');
    if (!date) return alert('Please choose a date.');
    if (category === 'Other' && !otherCategory.trim()) return alert('Please enter a custom category.');

    const payload = { title: title.trim(), amount: amt, category: finalCategory(), date, note: note.trim() };

    try {
      if (edit && params.id) {
        await dispatch(updateExpense({ id: params.id, payload })).unwrap();
      } else {
        await dispatch(createExpense(payload)).unwrap();
      }
      nav('/expenses');
    } catch (err) {
      console.error(err);
      alert('Save failed.');
    }
  };

  return (
    <div className="expense-form-page">
      <div className="expense-form-card">
        <h1>{edit ? 'Edit Expense' : 'New Expense'}</h1>

        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="fields">

            <div className="full">
              <label className="field-label">Title</label>
              <input
                className="input"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="amount-field">
              <label className="field-label">Amount</label>
              <input
                className="input"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                inputMode="decimal"
              />
            </div>

            <div className="category-field">
              <label className="field-label">Category</label>
              <select
                className="input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {PRESET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other (type custom)</option>
              </select>
            </div>

            {category === 'Other' && (
              <div className="full">
                <label className="field-label">Custom category</label>
                <input
                  className="input"
                  placeholder="e.g. Coffee, Gifts"
                  value={otherCategory}
                  onChange={e => setOtherCategory(e.target.value)}
                />
              </div>
            )}

            <div className="full">
              <label className="field-label">Date</label>
              <input
                className="input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div className="full">
              <label className="field-label">Note</label>
              <textarea
                className="input"
                placeholder="Optional note"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

          </div>

          <div className="form-actions full">
            <button type="submit" className="btn-save">{edit ? 'Update' : 'Save'}</button>
            <button type="button" className="btn-cancel" onClick={() => nav('/expenses')}>Cancel</button>
            <div style={{ marginLeft: 12 }} className="form-help">Category helps grouping &amp; reports.</div>
          </div>
        </form>
      </div>
    </div>
  );
}
