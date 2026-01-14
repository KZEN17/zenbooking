import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ email, password, role });
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message
        || err.response?.data?.errors
        || err.message
        || 'Registration failed. Please check console for details.';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form">
      <h2 className="form-title">Create Account</h2>

      {error && (
        <div className="form-error text-center mb-1">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password (min 6 characters)
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-1 text-gray">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
