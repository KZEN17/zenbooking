// User Types
export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Apartment Types
export interface Apartment {
  id: number;
  name: string;
  location?: string;
  createdAt: string;
  userId: number;
}

export interface CreateApartment {
  name: string;
  location?: string;
}

// Income Types
export interface Income {
  id: number;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
  apartmentId: number;
}

export interface CreateIncome {
  amount: number;
  date: string;
  description?: string;
  apartmentId: number;
}

// Expense Types
export interface Expense {
  id: number;
  amount: number;
  date: string;
  category: string;
  description?: string;
  createdAt: string;
  apartmentId: number;
}

export interface CreateExpense {
  amount: number;
  date: string;
  category: string;
  description?: string;
  apartmentId: number;
}

// Summary Types
export interface MonthlySummary {
  apartmentId: number;
  apartmentName: string;
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeCount: number;
  expenseCount: number;
}

// Booking Types (Client-side only for now)
export interface Booking {
  id: string;
  apartmentId: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  price: number; // Total rental price for this booking
  paymentStatus: 'paid' | 'pending'; // Payment status
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}
