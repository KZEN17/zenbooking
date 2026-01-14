import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expensesApi, apartmentsApi } from '../services/api';
import type { Expense, Apartment } from '../types';

const GlobalExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('');
  const [error, setError] = useState('');

  const categories = ['Maintenance', 'Utilities', 'Tax', 'Insurance', 'Repairs', 'Cleaning', 'Marketing', 'Software', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apts = await apartmentsApi.getAll();
      setApartments(apts);

      // Load expenses from all apartments
      const allExpenses: Expense[] = [];
      for (const apt of apts) {
        const exp = await expensesApi.getByApartment(apt.id);
        allExpenses.push(...exp);
      }
      setExpenses(allExpenses.sort((a, b) => b.date.localeCompare(a.date)));
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedApartmentId) {
      setError('Please select an apartment');
      return;
    }

    try {
      await expensesApi.create({
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        category,
        description: description || undefined,
        apartmentId: Number(selectedApartmentId),
      });
      setAmount('');
      setCategory('Maintenance');
      setDescription('');
      setSelectedApartmentId('');
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

  const getApartmentName = (apartmentId: number): string => {
    const apt = apartments.find((a) => a.id === apartmentId);
    return apt?.name || 'Unknown';
  };

  if (isLoading) return <div className="container">Loading...</div>;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category
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

      <div className="flex-between mb-2">
        <div>
          <h1>Total Expenses</h1>
          <p className="text-danger" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-gray">{expenses.length} total expenses</p>
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
              <label className="form-label">Apartment *</label>
              <select
                className="form-select"
                value={selectedApartmentId}
                onChange={(e) => setSelectedApartmentId(e.target.value)}
                required
              >
                <option value="">Select an apartment</option>
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.name}
                  </option>
                ))}
              </select>
            </div>
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

      {/* Expenses by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card mb-2">
          <h3 className="card-title">Expenses by Category</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <tr key={category}>
                    <td><strong>{category}</strong></td>
                    <td className="text-danger">
                      <strong>{formatCurrency(amount)}</strong>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Expenses */}
      {expenses.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray">No expense entries yet. Add your first one!</p>
        </div>
      ) : (
        <div className="card">
          <h3 className="card-title">All Expenses</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Apartment</th>
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
                  <td><strong>{getApartmentName(expense.apartmentId)}</strong></td>
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
        </div>
      )}
    </div>
  );
};

export default GlobalExpensePage;
