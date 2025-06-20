import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';

// Studio pages
import StudioList from './pages/studios/StudioList';
import StudioDetails from './pages/studios/StudioDetails';
import StudioForm from './pages/studios/StudioForm';

// Booking pages
import BookingList from './pages/bookings/BookingList';
import BookingDetails from './pages/bookings/BookingDetails';
import BookingForm from './pages/bookings/BookingForm';

// Equipment pages
import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentForm from './pages/equipment/EquipmentForm';

// User pages
import UserProfile from './pages/users/UserProfile';
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';

// Error pages
import NotFound from './pages/errors/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';

// Protected route component
import ProtectedRoute from './components/common/ProtectedRoute';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#e67e22',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Studio routes */}
              <Route path="studios" element={<StudioList />} />
              <Route path="studios/new" element={<StudioForm />} />
              <Route path="studios/:id" element={<StudioDetails />} />
              <Route path="studios/:id/edit" element={<StudioForm />} />
              
              {/* Booking routes */}
              <Route path="bookings" element={<BookingList />} />
              <Route path="bookings/new" element={<BookingForm />} />
              <Route path="bookings/:id" element={<BookingDetails />} />
              <Route path="bookings/:id/edit" element={<BookingForm />} />
              
              {/* Equipment routes */}
              <Route path="equipment" element={<EquipmentList />} />
              <Route path="equipment/new" element={<EquipmentForm />} />
              <Route path="equipment/:id/edit" element={<EquipmentForm />} />
              
              {/* User routes */}
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id/edit" element={<UserForm />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={5000} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;