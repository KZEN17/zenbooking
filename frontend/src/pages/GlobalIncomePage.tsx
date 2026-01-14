import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apartmentsApi } from '../services/api';
import type { Apartment, Booking } from '../types';

const GlobalIncomePage: React.FC = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apartmentsApi.getAll();
      setApartments(data);
    } catch (err) {
      setError('Failed to load apartments');
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingsForApartment = (apartmentId: number): Booking[] => {
    const stored = localStorage.getItem(`bookings_${apartmentId}`);
    return stored ? JSON.parse(stored) : [];
  };

  const getAllBookingsWithApartment = (): Array<Booking & { apartmentName: string }> => {
    const allBookings: Array<Booking & { apartmentName: string }> = [];
    apartments.forEach((apt) => {
      const bookings = getBookingsForApartment(apt.id);
      bookings.forEach((booking) => {
        allBookings.push({ ...booking, apartmentName: apt.name });
      });
    });
    return allBookings.sort((a, b) => b.checkIn.localeCompare(a.checkIn)); // Most recent first
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const togglePaymentStatus = (booking: Booking & { apartmentName: string }) => {
    const bookings = getBookingsForApartment(booking.apartmentId);
    const updatedBookings = bookings.map((b) =>
      b.id === booking.id
        ? { ...b, paymentStatus: b.paymentStatus === 'paid' ? 'pending' : 'paid' as 'paid' | 'pending' }
        : b
    );
    localStorage.setItem(`bookings_${booking.apartmentId}`, JSON.stringify(updatedBookings));
    // Force re-render by reloading data
    loadData();
  };

  if (isLoading) return <div className="container">Loading...</div>;

  const allBookings = getAllBookingsWithApartment();
  const paidBookings = allBookings.filter((b) => b.paymentStatus === 'paid');
  const pendingBookings = allBookings.filter((b) => b.paymentStatus === 'pending');
  const totalIncome = paidBookings.reduce((sum, booking) => sum + booking.price, 0);
  const pendingIncome = pendingBookings.reduce((sum, booking) => sum + booking.price, 0);
  const totalProjected = totalIncome + pendingIncome;

  // Group by month for summary
  const incomeByMonth = allBookings.reduce((acc, booking) => {
    const date = new Date(booking.checkIn);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey] += booking.price;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-1">
        ← Back to Dashboard
      </button>

      <h1 className="mb-2">Income Overview</h1>

      {error && <div className="form-error mb-1">{error}</div>}

      {/* Income Stats */}
      <div className="grid grid-3 mb-2">
        <div className="card">
          <h3 className="card-title">Total Paid Income</h3>
          <p className="text-success" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-gray">{paidBookings.length} paid bookings</p>
        </div>
        <div className="card" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
          <h3 className="card-title">⏳ Pending Income</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {formatCurrency(pendingIncome)}
          </p>
          <p className="text-gray">{pendingBookings.length} pending payments</p>
        </div>
        <div className="card">
          <h3 className="card-title">Total Projected</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(totalProjected)}
          </p>
          <p className="text-gray">{allBookings.length} total bookings</p>
        </div>
      </div>

      {/* Monthly Summary */}
      {Object.keys(incomeByMonth).length > 0 && (
        <div className="card mb-2">
          <h3 className="card-title">Income by Month</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Income</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(incomeByMonth)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([month, amount]) => (
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
                      <strong>{formatCurrency(amount)}</strong>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pending Payments */}
      {pendingBookings.length > 0 && (
        <div className="card mb-2" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3 className="card-title">⏳ Pending Payments</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Apartment</th>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Amount</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking) => (
                <tr key={`${booking.apartmentId}-${booking.id}`}>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td><strong>{booking.apartmentName}</strong></td>
                  <td>{booking.guestName}</td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                    {formatCurrency(booking.price)}
                  </td>
                  <td>
                    <span
                      onClick={() => togglePaymentStatus(booking)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: booking.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                        color: '#000',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      title="Click to toggle payment status"
                    >
                      {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Bookings */}
      {allBookings.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray">No bookings yet. Add bookings from apartment calendars to see income.</p>
        </div>
      ) : (
        <div className="card">
          <h3 className="card-title">All Bookings (Income Sources)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Apartment</th>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Amount</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((booking) => (
                <tr key={`${booking.apartmentId}-${booking.id}`}>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td><strong>{booking.apartmentName}</strong></td>
                  <td>{booking.guestName}</td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td className={booking.paymentStatus === 'paid' ? 'text-success' : ''} style={{ fontWeight: 'bold' }}>
                    {formatCurrency(booking.price)}
                  </td>
                  <td>
                    <span
                      onClick={() => togglePaymentStatus(booking)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: booking.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                        color: '#000',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      title="Click to toggle payment status"
                    >
                      {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </span>
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

export default GlobalIncomePage;
