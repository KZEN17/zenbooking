import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apartmentsApi } from '../services/api';
import type { Apartment, Booking } from '../types';

const CalendarPage: React.FC = () => {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form state
  const [guestName, setGuestName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [price, setPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    // Load bookings from localStorage for demo
    const stored = localStorage.getItem(`bookings_${apartmentId}`);
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, [apartmentId]);

  const loadData = async () => {
    try {
      const apt = await apartmentsApi.getById(Number(apartmentId));
      setApartment(apt);
    } catch (err) {
      setError('Failed to load apartment');
    }
  };

  const saveBookings = (newBookings: Booking[]) => {
    localStorage.setItem(`bookings_${apartmentId}`, JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  const checkDateOverlap = (newCheckIn: string, newCheckOut: string, excludeId?: string): boolean => {
    console.log('=== Checking overlap ===');
    console.log('New booking:', { checkIn: newCheckIn, checkOut: newCheckOut, excludeId });
    console.log('Existing bookings:', bookings);

    const hasOverlap = bookings.some((booking) => {
      // Skip the booking being edited
      if (excludeId && booking.id === excludeId) {
        console.log('Skipping booking being edited:', booking.id);
        return false;
      }

      // Check for overlap: new booking overlaps if check-in is before existing check-out AND check-out is after existing check-in
      const overlaps = newCheckIn < booking.checkOut && newCheckOut > booking.checkIn;
      console.log(`Checking against booking ${booking.id} (${booking.checkIn} to ${booking.checkOut}): ${overlaps}`);
      return overlaps;
    });

    console.log('Has overlap:', hasOverlap);
    console.log('===================');
    return hasOverlap;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date');
      return;
    }

    // Check for date conflicts
    const hasOverlap = editingBooking
      ? checkDateOverlap(checkIn, checkOut, editingBooking.id)
      : checkDateOverlap(checkIn, checkOut);

    if (hasOverlap) {
      setError('These dates overlap with an existing booking. Please choose different dates.');
      return;
    }

    setError(''); // Clear any previous errors

    if (editingBooking) {
      // Update existing booking
      const updatedBookings = bookings.map((b) =>
        b.id === editingBooking.id
          ? {
              ...b,
              guestName,
              checkIn,
              checkOut,
              price: parseFloat(price),
              paymentStatus,
              notes: notes || undefined,
            }
          : b
      );
      saveBookings(updatedBookings);
      setEditingBooking(null);
    } else {
      // Create new booking
      const newBooking: Booking = {
        id: Date.now().toString(),
        apartmentId: Number(apartmentId),
        guestName,
        checkIn,
        checkOut,
        price: parseFloat(price),
        paymentStatus,
        status: 'confirmed',
        notes: notes || undefined,
      };
      saveBookings([...bookings, newBooking]);
    }

    setGuestName('');
    setCheckIn('');
    setCheckOut('');
    setPrice('');
    setPaymentStatus('pending');
    setNotes('');
    setShowForm(false);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setGuestName(booking.guestName);
    setCheckIn(booking.checkIn);
    setCheckOut(booking.checkOut);
    setPrice(booking.price.toString());
    setPaymentStatus(booking.paymentStatus);
    setNotes(booking.notes || '');
    setError('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBooking(null);
    setGuestName('');
    setCheckIn('');
    setCheckOut('');
    setPrice('');
    setPaymentStatus('pending');
    setNotes('');
    setError('');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this booking?')) return;
    saveBookings(bookings.filter((b) => b.id !== id));
  };

  const togglePaymentStatus = (booking: Booking) => {
    const updatedBookings = bookings.map((b) =>
      b.id === booking.id
        ? { ...b, paymentStatus: b.paymentStatus === 'paid' ? 'pending' : 'paid' as 'paid' | 'pending' }
        : b
    );
    saveBookings(updatedBookings);
  };

  const isDateBooked = (date: Date): boolean => {
    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    console.log('Checking if date is booked:', dateStr);

    return bookings.some((booking) => {
      // A date is booked if it's >= check-in and < check-out
      // The check-out date itself is available for the next guest
      const isBooked = dateStr >= booking.checkIn && dateStr < booking.checkOut;
      if (isBooked) {
        console.log(`Date ${dateStr} is booked by booking ${booking.checkIn} to ${booking.checkOut}`);
      }
      return isBooked;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-1">
        ← Back to Dashboard
      </button>

      <div className="flex-between mb-2">
        <h1>Bookings - {apartment?.name}</h1>
        <button onClick={() => {
          if (showForm) {
            handleCancel();
          } else {
            setShowForm(true);
            setError('');
          }
        }} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add Booking'}
        </button>
      </div>

      {error && <div className="form-error mb-1">{error}</div>}

      {showForm && (
        <div className="card mb-2">
          <h3 className="card-title">{editingBooking ? 'Edit Booking' : 'Add Booking'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Guest Name *</label>
              <input
                type="text"
                className="form-input"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Check-In Date *</label>
              <input
                type="date"
                className="form-input"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Check-Out Date *</label>
              <input
                type="date"
                className="form-input"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                min={checkIn}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rental Price (₱) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0.01"
                placeholder="Total rental amount"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Status *</label>
              <select
                className="form-select"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'pending')}
                required
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input
                type="text"
                className="form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special notes..."
              />
            </div>
            <div className="flex-gap">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingBooking ? 'Update Booking' : 'Add Booking'}
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

      <div className="card mb-2">
        <div className="flex-between mb-1">
          <button onClick={prevMonth} className="btn btn-secondary btn-small">
            ← Previous
          </button>
          <h3>{monthName}</h3>
          <button onClick={nextMonth} className="btn btn-secondary btn-small">
            Next →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
          {weekDays.map((day) => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: '10px' }}>
              {day}
            </div>
          ))}
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} style={{ padding: '10px' }} />;
            }
            const booked = isDateBooked(date);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: booked ? '#fecaca' : isToday ? '#dbeafe' : 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  cursor: booked ? 'pointer' : 'default',
                }}
                title={booked ? 'Booked' : 'Available'}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>

        <div className="mt-1">
          <p><span style={{ backgroundColor: '#fecaca', padding: '2px 8px', borderRadius: '4px' }}>Red</span> = Booked</p>
          <p><span style={{ backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>Blue</span> = Today</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">All Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray text-center">No bookings yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.guestName}</td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td className="text-success">
                    <strong>
                      {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                      }).format(booking.price)}
                    </strong>
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
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: booking.status === 'confirmed' ? '#dbeafe' : '#fef3c7',
                        color: '#000',
                      }}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.notes || '-'}</td>
                  <td>
                    <div className="flex-gap">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="btn btn-secondary btn-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
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
    </div>
  );
};

export default CalendarPage;
