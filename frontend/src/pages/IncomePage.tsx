import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incomesApi, apartmentsApi } from '../services/api';
import type { Income, Apartment } from '../types';

const IncomePage: React.FC = () => {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [apartmentId]);

  const loadData = async () => {
    try {
      const apt = await apartmentsApi.getById(Number(apartmentId));
      setApartment(apt);
      const inc = await incomesApi.getByApartment(Number(apartmentId));
      setIncomes(inc);
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
      await incomesApi.create({
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        description: description || undefined,
        apartmentId: Number(apartmentId),
      });
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setShowForm(false);
      loadData();
    } catch (err: any) {
      setError('Failed to create income');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this income entry?')) return;
    try {
      await incomesApi.delete(id);
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

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-1">
        ← Back to Dashboard
      </button>

      <div className="flex-between mb-2">
        <div>
          <h1>Income - {apartment?.name}</h1>
          <p className="text-gray">Total Income: {formatCurrency(totalIncome)}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add Income'}
        </button>
      </div>

      {error && <div className="form-error mb-1">{error}</div>}

      {showForm && (
        <div className="card mb-2">
          <h3 className="card-title">Add Income Entry</h3>
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
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly rent"
              />
            </div>
            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Add Income
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

      {incomes.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray">No income entries yet. Add your first one!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id}>
                <td>{formatDate(income.date)}</td>
                <td className="text-success">{formatCurrency(income.amount)}</td>
                <td>{income.description || '-'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(income.id)}
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

export default IncomePage;
