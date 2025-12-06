// backend/src/routes/expenses.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/expenses
 * Optional query params:
 *   - from: YYYY-MM-DD
 *   - to:   YYYY-MM-DD
 *   - limit: number
 */
router.get('/', async (req, res) => {
  try {
    const { from, to, limit = 100 } = req.query;

    const where = {};
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = dayjs(to).endOf('day').toDate();
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      take: Number(limit),
    });

    res.json(expenses);
  } catch (err) {
    console.error('GET /api/expenses error', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

/**
 * GET /api/expenses/summary?month=YYYY-MM
 * Returns summary for the requested month (defaults to current month).
 * Response:
 *   { total: Number, byCategory: { categoryName: amount, ... } }
 */
router.get('/summary', async (req, res) => {
  try {
    const monthQuery = req.query.month || dayjs().format('YYYY-MM');
    const start = dayjs(`${monthQuery}-01`).startOf('month').toDate();
    const end = dayjs(start).endOf('month').endOf('day').toDate();

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        }
      },
      select: {
        amount: true,
        category: true
      }
    });

    let total = 0;
    const byCategory = {};

    for (const e of expenses) {
      const amt = Number(e.amount) || 0;
      total += amt;
      const cat = (e.category || 'Others').toString();
      byCategory[cat] = (byCategory[cat] || 0) + amt;
    }

    res.json({ total, byCategory });
  } catch (err) {
    console.error('GET /api/expenses/summary error', err);
    res.status(500).json({ error: 'Failed to compute summary' });
  }
});

export default router;
