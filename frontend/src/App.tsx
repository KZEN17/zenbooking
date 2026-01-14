import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApartmentsPage from './pages/ApartmentsPage';
import ApartmentFormPage from './pages/ApartmentFormPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import GlobalIncomePage from './pages/GlobalIncomePage';
import GlobalExpensePage from './pages/GlobalExpensePage';
import CalendarPage from './pages/CalendarPage';
import SummaryPage from './pages/SummaryPage';
import UsersPage from './pages/UsersPage';
import Sidebar from './components/Sidebar';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container text-center">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Sidebar />
      <div className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartments"
            element={
              <ProtectedRoute>
                <ApartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartments/new"
            element={
              <ProtectedRoute>
                <ApartmentFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartments/:apartmentId/income"
            element={
              <ProtectedRoute>
                <IncomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartments/:apartmentId/expenses"
            element={
              <ProtectedRoute>
                <ExpensePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartments/:apartmentId/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <GlobalIncomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <GlobalExpensePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <SummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
