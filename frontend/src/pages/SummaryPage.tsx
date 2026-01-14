import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apartmentsApi, expensesApi } from '../services/api';
import type { Apartment, Booking, Expense } from '../types';

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apts = await apartmentsApi.getAll();
      setApartments(apts);

      // Load all expenses
      const allExpenses: Expense[] = [];
      for (const apt of apts) {
        const exp = await expensesApi.getByApartment(apt.id);
        allExpenses.push(...exp);
      }
      setExpenses(allExpenses);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingsForApartment = (apartmentId: number): Booking[] => {
    const stored = localStorage.getItem(`bookings_${apartmentId}`);
    return stored ? JSON.parse(stored) : [];
  };

  const getAllBookings = (): Booking[] => {
    const allBookings: Booking[] = [];
    apartments.forEach((apt) => {
      const bookings = getBookingsForApartment(apt.id);
      allBookings.push(...bookings);
    });
    return allBookings;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  if (isLoading) return <div className="container">Loading...</div>;

  const allBookings = getAllBookings();
  const paidBookings = allBookings.filter((b) => b.paymentStatus === 'paid');
  const pendingBookings = allBookings.filter((b) => b.paymentStatus === 'pending');

  const totalPaidIncome = paidBookings.reduce((sum, booking) => sum + booking.price, 0);
  const totalPendingIncome = pendingBookings.reduce((sum, booking) => sum + booking.price, 0);
  const totalProjectedIncome = totalPaidIncome + totalPendingIncome;

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalPaidIncome - totalExpenses;
  const projectedProfit = totalProjectedIncome - totalExpenses;

  // Per-apartment breakdown
  const apartmentStats = apartments.map((apt) => {
    const bookings = getBookingsForApartment(apt.id);
    const aptExpenses = expenses.filter((e) => e.apartmentId === apt.id);

    const paidIncome = bookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.price, 0);

    const pendingIncome = bookings
      .filter((b) => b.paymentStatus === 'pending')
      .reduce((sum, b) => sum + b.price, 0);

    const aptExpenseTotal = aptExpenses.reduce((sum, e) => sum + e.amount, 0);
    const aptNetProfit = paidIncome - aptExpenseTotal;

    return {
      apartment: apt,
      bookingsCount: bookings.length,
      paidIncome,
      pendingIncome,
      totalIncome: paidIncome + pendingIncome,
      expenses: aptExpenseTotal,
      netProfit: aptNetProfit,
    };
  });

  // Monthly breakdown
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  allBookings.forEach((booking) => {
    const date = new Date(booking.checkIn);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    monthlyData[monthKey].income += booking.price;
  });

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    monthlyData[monthKey].expenses += expense.amount;
  });

  const sortedMonths = Object.entries(monthlyData).sort(([a], [b]) => b.localeCompare(a));

  // Expense categories
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-1">
        ← Back to Dashboard
      </button>

      <h1 className="mb-2">Financial Summary</h1>

      {error && <div className="form-error mb-1">{error}</div>}

      {/* Overall Stats */}
      <div className="grid grid-3 mb-2">
        <div className="card">
          <h3 className="card-title">Total Paid Income</h3>
          <p className="text-success" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(totalPaidIncome)}
          </p>
          <p className="text-gray">{paidBookings.length} paid bookings</p>
        </div>
        <div className="card">
          <h3 className="card-title">Total Expenses</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-gray">{expenses.length} expenses</p>
        </div>
        <div className="card">
          <h3 className="card-title">Net Profit</h3>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: netProfit >= 0 ? '#10b981' : '#ef4444',
            }}
          >
            {formatCurrency(netProfit)}
          </p>
          <p className="text-gray">From paid bookings</p>
        </div>
      </div>

      {/* Projected Stats */}
      {totalPendingIncome > 0 && (
        <div className="card mb-2" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
          <h3 className="card-title">Projected Totals (Including Pending)</h3>
          <div className="grid grid-3">
            <div>
              <p className="text-gray">Projected Income</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {formatCurrency(totalProjectedIncome)}
              </p>
            </div>
            <div>
              <p className="text-gray">Total Expenses</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-gray">Projected Profit</p>
              <p
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: projectedProfit >= 0 ? '#10b981' : '#ef4444',
                }}
              >
                {formatCurrency(projectedProfit)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Per-Apartment Breakdown */}
      <div className="card mb-2">
        <h3 className="card-title">Per-Apartment Summary</h3>
        {apartmentStats.length === 0 ? (
          <p className="text-gray text-center">No apartments yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Apartment</th>
                <th>Bookings</th>
                <th>Paid Income</th>
                <th>Pending Income</th>
                <th>Expenses</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {apartmentStats.map((stat) => (
                <tr key={stat.apartment.id}>
                  <td><strong>{stat.apartment.name}</strong></td>
                  <td>{stat.bookingsCount}</td>
                  <td className="text-success">
                    <strong>{formatCurrency(stat.paidIncome)}</strong>
                  </td>
                  <td style={{ color: '#f59e0b' }}>
                    {formatCurrency(stat.pendingIncome)}
                  </td>
                  <td style={{ color: '#ef4444' }}>
                    {formatCurrency(stat.expenses)}
                  </td>
                  <td
                    style={{
                      fontWeight: 'bold',
                      color: stat.netProfit >= 0 ? '#10b981' : '#ef4444',
                    }}
                  >
                    {formatCurrency(stat.netProfit)}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
                <td>TOTAL</td>
                <td>{allBookings.length}</td>
                <td className="text-success">{formatCurrency(totalPaidIncome)}</td>
                <td style={{ color: '#f59e0b' }}>
                  {formatCurrency(totalPendingIncome)}
                </td>
                <td style={{ color: '#ef4444' }}>{formatCurrency(totalExpenses)}</td>
                <td
                  style={{
                    color: netProfit >= 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {formatCurrency(netProfit)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Monthly Breakdown */}
      {sortedMonths.length > 0 && (
        <div className="card mb-2">
          <h3 className="card-title">Monthly Breakdown</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {sortedMonths.map(([month, data]) => {
                const profit = data.income - data.expenses;
                return (
                  <tr key={month}>
                    <td>
                      <strong>
                        {new Date(month + '-01').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </strong>
                    </td>
                    <td className="text-success">
                      <strong>{formatCurrency(data.income)}</strong>
                    </td>
                    <td style={{ color: '#ef4444' }}>
                      {formatCurrency(data.expenses)}
                    </td>
                    <td
                      style={{
                        fontWeight: 'bold',
                        color: profit >= 0 ? '#10b981' : '#ef4444',
                      }}
                    >
                      {formatCurrency(profit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Categories */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <h3 className="card-title">Expenses by Category</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <tr key={category}>
                    <td><strong>{category}</strong></td>
                    <td style={{ color: '#ef4444' }}>
                      <strong>{formatCurrency(amount)}</strong>
                    </td>
                    <td className="text-gray">
                      {((amount / totalExpenses) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {allBookings.length === 0 && expenses.length === 0 && (
        <div className="card text-center">
          <p className="text-gray">
            No financial data yet. Start by adding apartments, bookings, and expenses.
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
