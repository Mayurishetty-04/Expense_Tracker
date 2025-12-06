// backend/src/utils/validation.js
export function isISODateString(s) {
  if (!s) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

/*
 options: { partial: boolean }
 returns { valid: bool, errors: {}, parsed: {} }
*/
export function validateExpense(payload = {}, options = {}) {
  const errors = {};
  const parsed = {};

  if (!options.partial || payload.title !== undefined) {
    if (!payload.title || typeof payload.title !== 'string') errors.title = 'Title is required';
    else parsed.title = payload.title.trim();
  }

  if (!options.partial || payload.amount !== undefined) {
    const amount = Number(payload.amount);
    if (Number.isNaN(amount)) errors.amount = 'Amount must be a number';
    else parsed.amount = amount;
  }

  if (!options.partial || payload.category !== undefined) {
    if (!payload.category || typeof payload.category !== 'string') errors.category = 'Category is required';
    else parsed.category = payload.category.trim();
  }

  if (!options.partial || payload.date !== undefined) {
    if (!isISODateString(payload.date)) errors.date = 'Date must be a valid date (ISO format)';
    else parsed.date = new Date(payload.date);
  }

  // note is optional
  if (payload.note !== undefined) parsed.note = payload.note ? String(payload.note).trim() : null;

  return { valid: Object.keys(errors).length === 0, errors, parsed };
}
