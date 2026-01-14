import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apartmentsApi } from '../services/api';

const ApartmentFormPage: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apartmentsApi.create({ name, location: location || undefined });
      navigate('/');
    } catch (err: any) {
      setError('Failed to create apartment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form">
      <h2 className="form-title">Add New Apartment</h2>

      {error && <div className="form-error text-center mb-1">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Apartment Name *
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            placeholder="e.g., Downtown Studio"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location (optional)
          </label>
          <input
            type="text"
            id="location"
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 123 Main St, City"
          />
        </div>

        <div className="flex-gap">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Apartment'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApartmentFormPage;
