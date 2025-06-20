import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

// Material UI imports
import {
  Box,
  Container,
  Typography,
  Link,
  CssBaseline,
  useTheme,
} from '@mui/material';

// AuthLayout component
const AuthLayout: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useTheme();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'linear-gradient(to right bottom, #2c3e50, #3a4f63, #496177, #59748c, #6a87a1)',
      }}
    >
      <CssBaseline />
      
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          color="white"
          fontWeight="bold"
          sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          Studio Booking Assistant
        </Typography>
      </Box>
      
      {/* Main content */}
      <Container
        component="main"
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Outlet />
      </Container>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Studio Booking Assistant. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Terms of Service
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Contact
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;