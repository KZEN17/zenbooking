import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apartmentsApi, expensesApi } from '../services/api';
import type { Apartment, Booking, Expense } from '../types';

const DashboardPage: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [showAllBookings, setShowAllBookings] = useState(false);

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      const data = await apartmentsApi.getAll();
      setApartments(data);
      setFilteredApartments(data);
    } catch (err: any) {
      setError('Failed to load apartments');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalIncome = (): number => {
    let total = 0;
    apartments.forEach((apt) => {
      const bookings = getBookingsForApartment(apt.id);
      bookings.forEach((booking) => {
        if (booking.paymentStatus === 'paid') {
          total += booking.price;
        }
      });
    });
    return total;
  };

  const getPendingIncome = (): number => {
    let total = 0;
    apartments.forEach((apt) => {
      const bookings = getBookingsForApartment(apt.id);
      bookings.forEach((booking) => {
        if (booking.paymentStatus === 'pending') {
          total += booking.price;
        }
      });
    });
    return total;
  };

  const getTotalExpenses = async (): Promise<number> => {
    let total = 0;
    for (const apt of apartments) {
      const expenses = await expensesApi.getByApartment(apt.id);
      expenses.forEach((expense: Expense) => {
        total += expense.amount;
      });
    }
    return total;
  };

  const getBookingsForApartment = (apartmentId: number): Booking[] => {
    const stored = localStorage.getItem(`bookings_${apartmentId}`);
    return stored ? JSON.parse(stored) : [];
  };

  const getAllBookings = (): Array<Booking & { apartmentName: string }> => {
    const allBookings: Array<Booking & { apartmentName: string }> = [];
    apartments.forEach((apt) => {
      const bookings = getBookingsForApartment(apt.id);
      bookings.forEach((booking) => {
        allBookings.push({ ...booking, apartmentName: apt.name });
      });
    });
    return allBookings.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  };

  const isApartmentAvailable = (apartmentId: number, startDate: string, endDate?: string): boolean => {
    const bookings = getBookingsForApartment(apartmentId);

    // Check if the date range overlaps with any booking
    for (const booking of bookings) {
      const bookingStart = booking.checkIn;
      const bookingEnd = booking.checkOut;

      if (endDate) {
        // Both dates provided - check if range overlaps
        // Allow check-in on the same day as previous check-out
        if (startDate < bookingEnd && endDate > bookingStart) {
          return false; // Overlap found
        }
      } else {
        // Only check-in date provided - check if that specific date is booked
        if (startDate >= bookingStart && startDate < bookingEnd) {
          return false; // Date is booked
        }
      }
    }
    return true; // No overlap
  };

  const handleSearchChange = (checkInDate: string, checkOutDate: string) => {
    setSearchStartDate(checkInDate);
    setSearchEndDate(checkOutDate);

    // Auto-filter when check-in date is entered
    if (!checkInDate) {
      setFilteredApartments(apartments);
      return;
    }

    if (checkOutDate && checkInDate > checkOutDate) {
      return; // Invalid range, don't filter
    }

    const available = apartments.filter((apt) =>
      isApartmentAvailable(apt.id, checkInDate, checkOutDate || undefined)
    );
    setFilteredApartments(available);
  };

  const handleClearSearch = () => {
    setSearchStartDate('');
    setSearchEndDate('');
    setFilteredApartments(apartments);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUpcomingBookings = (limit: number = 5) => {
    const today = new Date().toISOString().split('T')[0];
    const allBookings = getAllBookings();
    return allBookings.filter((b) => b.checkOut >= today).slice(0, limit);
  };

  const togglePaymentStatus = (booking: Booking & { apartmentName: string }) => {
    const bookings = getBookingsForApartment(booking.apartmentId);
    const updatedBookings = bookings.map((b) =>
      b.id === booking.id
        ? { ...b, paymentStatus: b.paymentStatus === 'paid' ? 'pending' : 'paid' as 'paid' | 'pending' }
        : b
    );
    localStorage.setItem(`bookings_${booking.apartmentId}`, JSON.stringify(updatedBookings));
    // Force re-render by reloading apartments
    loadApartments();
  };

  if (isLoading) {
    return <div className="container text-center">Loading...</div>;
  }

  const upcomingBookings = getUpcomingBookings();
  const allBookings = getAllBookings();
  const totalBookings = allBookings.length;
  const totalIncome = getTotalIncome();
  const pendingIncome = getPendingIncome();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className="container">
      <h1 className="mb-2">Booking Dashboard</h1>

      {error && <div className="form-error mb-1">{error}</div>}

      {/* Quick Stats */}
      <div className="grid grid-3 mb-2">
        <div className="card">
          <h3 className="card-title">Paid Income</h3>
          <p className="text-success" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(totalIncome)}
          </p>
          {pendingIncome > 0 && (
            <p style={{ color: 'var(--warning-text)', fontSize: '0.9rem' }}>
              + {formatCurrency(pendingIncome)} pending
            </p>
          )}
          <Link to="/income" className="btn btn-primary btn-small" style={{ marginTop: '0.5rem' }}>
            View Details
          </Link>
        </div>
        <div className="card">
          <h3 className="card-title">Total Bookings</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {totalBookings}
          </p>
          <p className="text-gray">{upcomingBookings.length} upcoming</p>
        </div>
        <div className="card">
          <h3 className="card-title">Manage Expenses</h3>
          <p className="text-gray mb-1">Track all your property expenses</p>
          <Link to="/expenses" className="btn btn-secondary btn-small">
            View Expenses
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="card mb-2">
        <h3 className="card-title">Search Available Apartments</h3>
        <p className="text-gray mb-1">Enter check-in date to see available apartments (check-out is optional)</p>
        <div className="flex-gap mb-1">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Check-In Date *</label>
            <input
              type="date"
              className="form-input"
              value={searchStartDate}
              onChange={(e) => handleSearchChange(e.target.value, searchEndDate)}
              placeholder="Required"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Check-Out Date (Optional)</label>
            <input
              type="date"
              className="form-input"
              value={searchEndDate}
              onChange={(e) => handleSearchChange(searchStartDate, e.target.value)}
              min={searchStartDate}
              placeholder="Optional"
            />
          </div>
        </div>
        <button onClick={handleClearSearch} className="btn btn-secondary">
          Clear Search
        </button>
      </div>

      {/* Results Section */}
      <div className="mb-2">
        <h3 className="mb-1">
          {searchStartDate && searchEndDate
            ? `Available Apartments (${filteredApartments.length})`
            : `All Apartments (${filteredApartments.length})`}
        </h3>
        {filteredApartments.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray">
              {searchStartDate && searchEndDate
                ? 'No apartments available for the selected dates. Try different dates.'
                : 'No apartments found. Add apartments from the Apartments tab.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredApartments.map((apartment) => {
              const bookings = getBookingsForApartment(apartment.id);
              const nextBooking = bookings
                .filter((b) => b.checkOut >= new Date().toISOString().split('T')[0])
                .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];

              return (
                <div key={apartment.id} className="card">
                  <h3 className="card-title">{apartment.name}</h3>
                  {apartment.location && (
                    <p className="text-gray mb-1">📍 {apartment.location}</p>
                  )}
                  {nextBooking ? (
                    <div className="mb-1">
                      <p className="text-gray">
                        <strong>Next Booking:</strong>
                      </p>
                      <p className="text-gray">
                        {formatDate(nextBooking.checkIn)} - {formatDate(nextBooking.checkOut)}
                      </p>
                      <p className="text-gray">Guest: {nextBooking.guestName}</p>
                    </div>
                  ) : (
                    <p className="text-success mb-1">✓ Available - No upcoming bookings</p>
                  )}
                  <div className="card-actions">
                    <Link
                      to={`/apartments/${apartment.id}/calendar`}
                      className="btn btn-primary btn-small"
                    >
                      View Calendar & Book
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Bookings Section */}
      <div className="card">
        <div className="flex-between mb-1">
          <h3 className="card-title">
            {showAllBookings ? `All Bookings (${totalBookings})` : `Upcoming Bookings (${upcomingBookings.length})`}
          </h3>
          {totalBookings > 5 && (
            <button
              onClick={() => setShowAllBookings(!showAllBookings)}
              className="btn btn-secondary btn-small"
            >
              {showAllBookings ? 'Show Upcoming Only' : 'Show All'}
            </button>
          )}
        </div>
        {(showAllBookings ? allBookings : upcomingBookings).length === 0 ? (
          <p className="text-gray text-center">No bookings yet. Add bookings from apartment calendars.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Apartment</th>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(showAllBookings ? allBookings : upcomingBookings).map((booking) => (
                <tr key={`${booking.apartmentId}-${booking.id}`}>
                  <td><strong>{booking.apartmentName}</strong></td>
                  <td>{booking.guestName}</td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td>
                    <span
                      onClick={() => togglePaymentStatus(booking)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: booking.paymentStatus === 'paid' ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color: booking.paymentStatus === 'paid' ? 'var(--success-text)' : 'var(--warning-text)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      title="Click to toggle payment status"
                    >
                      {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: booking.status === 'confirmed' ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color: booking.status === 'confirmed' ? 'var(--success-text)' : 'var(--warning-text)',
                      }}
                    >
                      {booking.status}
                    </span>
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

export default DashboardPage;
