// src/features/expenses/selectors.js
import { createSelector } from 'reselect';
import dayjs from 'dayjs';

// Base - adapt if your slice path is different
const selectExpensesState = state => state.expenses || {};
export const selectExpensesList = createSelector(
  selectExpensesState,
  s => s.list || []
);

// Normalize to dayjs safely
const toDayjs = (d) => {
  if (!d) return null;
  if (dayjs.isDayjs(d)) return d;
  // handle typical ISO strings and Date objects
  return dayjs(typeof d === 'string' ? d : (d.toISOString ? d.toISOString() : String(d)));
};

// Expenses for the current month (local timezone)
export const selectExpensesForCurrentMonth = createSelector(
  selectExpensesList,
  (list) => {
    const now = dayjs();
    const y = now.year();
    const m = now.month(); // 0-indexed
    return list.filter(exp => {
      const dd = toDayjs(exp.date);
      if (!dd || !dd.isValid()) return false;
      return dd.year() === y && dd.month() === m;
    });
  }
);

// helper sum
const sumAmounts = (arr) => arr.reduce((s, e) => s + (Number(e.amount) || 0), 0);

// Stats for current month (total, unique categories, average/day, count)
export const selectMonthStats = createSelector(
  selectExpensesForCurrentMonth,
  (monthList) => {
    const totalThisMonth = sumAmounts(monthList);

    // unique non-empty categories
    const categories = new Set();
    monthList.forEach(e => {
      const c = (e.category || '').toString().trim();
      if (c) categories.add(c);
    });
    const categoriesUsed = categories.size;

    const today = dayjs();
    const daysElapsed = today.date(); // 1..31 (day of month)
    const averagePerDay = daysElapsed > 0 ? (totalThisMonth / daysElapsed) : 0;

    const recentCount = monthList.length;

    return {
      totalThisMonth,
      categoriesUsed,
      averagePerDay,
      daysElapsed,
      recentCount
    };
  }
);

// Total across all expenses
export const selectTotalAllTime = createSelector(
  selectExpensesList,
  (list) => sumAmounts(list)
);
