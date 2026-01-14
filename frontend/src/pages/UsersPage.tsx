import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi, usersApi } from '../services/api';
import type { User } from '../types';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (currentUser?.role !== 'Admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await authApi.register({ email, password, role });
      setEmail('');
      setPassword('');
      setRole('User');
      setShowForm(false);
      loadUsers();
      alert('User created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersApi.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      alert('User deleted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (isLoading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-1">
        ← Back to Dashboard
      </button>

      <div className="flex-between mb-2">
        <div>
          <h1>User Management</h1>
          <p className="text-gray">Manage system users (Admin only)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {error && <div className="form-error mb-1">{error}</div>}

      {showForm && (
        <div className="card mb-2">
          <h3 className="card-title">Create New User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password (min 6 characters) *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Create User
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

      <div className="card">
        <h3 className="card-title">All Users ({users.length})</h3>
        {users.length === 0 ? (
          <p className="text-gray text-center">No users found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.email}</strong></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: user.role === 'Admin' ? 'var(--primary-color)' : 'var(--gray-200)',
                        color: user.role === 'Admin' ? 'white' : 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
