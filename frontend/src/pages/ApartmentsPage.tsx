import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apartmentsApi } from '../services/api';
import type { Apartment } from '../types';

const ApartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      const data = await apartmentsApi.getAll();
      setApartments(data);
    } catch (err: any) {
      setError('Failed to load apartments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await apartmentsApi.update(editingId, { name, location: location || undefined });
      } else {
        await apartmentsApi.create({ name, location: location || undefined });
      }
      setName('');
      setLocation('');
      setEditingId(null);
      setShowForm(false);
      loadApartments();
    } catch (err: any) {
      setError('Failed to save apartment');
    }
  };

  const handleEdit = (apartment: Apartment) => {
    setName(apartment.name);
    setLocation(apartment.location || '');
    setEditingId(apartment.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this apartment?')) return;

    try {
      await apartmentsApi.delete(id);
      setApartments(apartments.filter((a) => a.id !== id));
    } catch (err: any) {
      alert('Failed to delete apartment');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setLocation('');
  };

  if (isLoading) {
    return <div className="container text-center">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="flex-between mb-2">
        <h1>Manage Apartments</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add Apartment'}
        </button>
      </div>

      {error && <div className="form-error mb-1">{error}</div>}

      {showForm && (
        <div className="card mb-2">
          <h3 className="card-title">{editingId ? 'Edit Apartment' : 'Add New Apartment'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Apartment Name *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                placeholder="e.g., Downtown Studio"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location (optional)</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 123 Main St, City"
              />
            </div>
            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingId ? 'Update' : 'Create'} Apartment
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {apartments.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray">No apartments yet. Create your first apartment to get started!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apartment) => (
              <tr key={apartment.id}>
                <td><strong>{apartment.name}</strong></td>
                <td>{apartment.location || '-'}</td>
                <td>{new Date(apartment.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex-gap">
                    <Link
                      to={`/apartments/${apartment.id}/calendar`}
                      className="btn btn-primary btn-small"
                    >
                      Calendar
                    </Link>
                    <button
                      onClick={() => handleEdit(apartment)}
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(apartment.id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApartmentsPage;
