import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expensesApi, apartmentsApi } from '../services/api';
import type { Expense, Apartment } from '../types';

const ExpensePage: React.FC = () => {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const categories = ['Maintenance', 'Utilities', 'Tax', 'Insurance', 'Repairs', 'Cleaning', 'Other'];

  useEffect(() => {
    loadData();
  }, [apartmentId]);

  const loadData = async () => {
    try {
      const apt = await apartmentsApi.getById(Number(apartmentId));
      setApartment(apt);
      const exp = await expensesApi.getByApartment(Number(apartmentId));
      setExpenses(exp);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await expensesApi.create({
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        category,
        description: description || undefined,
        apartmentId: Number(apartmentId),
      });
      setAmount('');
      setCategory('Maintenance');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setShowForm(false);
      loadData();
    } catch (err: any) {
      setError('Failed to create expense');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this expense entry?')) return;
    try {
      await expensesApi.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) return <div className="container">Loading...</div>;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-1">
        ← Back to Dashboard
      </button>

      <div className="flex-between mb-2">
        <div>
          <h1>Expenses - {apartment?.name}</h1>
          <p className="text-gray">Total Expenses: {formatCurrency(totalExpenses)}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {error && <div className="form-error mb-1">{error}</div>}

      {showForm && (
        <div className="card mb-2">
          <h3 className="card-title">Add Expense Entry</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Amount (₱) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Fixed broken window"
              />
            </div>
            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray">No expense entries yet. Add your first one!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{formatDate(expense.date)}</td>
                <td>{expense.category}</td>
                <td className="text-danger">{formatCurrency(expense.amount)}</td>
                <td>{expense.description || '-'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpensePage;
