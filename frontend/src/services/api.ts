import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  Apartment,
  CreateApartment,
  Income,
  CreateIncome,
  Expense,
  CreateExpense,
  MonthlySummary
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:5082/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/Auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/Auth/register', data);
    return response.data;
  },
};

// Users API (Admin only)
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/Users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/Users/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Users/${id}`);
  },
};

// Apartments API
export const apartmentsApi = {
  getAll: async (): Promise<Apartment[]> => {
    const response = await api.get<Apartment[]>('/Apartments');
    return response.data;
  },

  getById: async (id: number): Promise<Apartment> => {
    const response = await api.get<Apartment>(`/Apartments/${id}`);
    return response.data;
  },

  create: async (data: CreateApartment): Promise<Apartment> => {
    const response = await api.post<Apartment>('/Apartments', data);
    return response.data;
  },

  update: async (id: number, data: CreateApartment): Promise<Apartment> => {
    const response = await api.put<Apartment>(`/Apartments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Apartments/${id}`);
  },
};

// Incomes API
export const incomesApi = {
  getByApartment: async (apartmentId: number): Promise<Income[]> => {
    const response = await api.get<Income[]>(`/Incomes/apartment/${apartmentId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Income> => {
    const response = await api.get<Income>(`/Incomes/${id}`);
    return response.data;
  },

  create: async (data: CreateIncome): Promise<Income> => {
    const response = await api.post<Income>('/Incomes', data);
    return response.data;
  },

  update: async (id: number, data: CreateIncome): Promise<Income> => {
    const response = await api.put<Income>(`/Incomes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Incomes/${id}`);
  },
};

// Expenses API
export const expensesApi = {
  getByApartment: async (apartmentId: number): Promise<Expense[]> => {
    const response = await api.get<Expense[]>(`/Expenses/apartment/${apartmentId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Expense> => {
    const response = await api.get<Expense>(`/Expenses/${id}`);
    return response.data;
  },

  create: async (data: CreateExpense): Promise<Expense> => {
    const response = await api.post<Expense>('/Expenses', data);
    return response.data;
  },

  update: async (id: number, data: CreateExpense): Promise<Expense> => {
    const response = await api.put<Expense>(`/Expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Expenses/${id}`);
  },
};

// Summary API
export const summaryApi = {
  getMonthlySummary: async (
    apartmentId: number,
    year: number,
    month: number
  ): Promise<MonthlySummary> => {
    const response = await api.get<MonthlySummary>(
      `/Summary/monthly/${apartmentId}/${year}/${month}`
    );
    return response.data;
  },

  getYearlySummary: async (year: number): Promise<MonthlySummary[]> => {
    const response = await api.get<MonthlySummary[]>(`/Summary/yearly/${year}`);
    return response.data;
  },
};

export default api;
