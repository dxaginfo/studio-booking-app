import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '../../redux/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'STAFF' | 'CLIENT';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector((state: any) => state.auth.user);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required role if specified
  if (requiredRole && user?.role !== requiredRole) {
    // For admin-only routes
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // For staff-only routes, allow admins too
    if (requiredRole === 'STAFF' && user?.role !== 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;