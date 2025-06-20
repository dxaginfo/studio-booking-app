import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectCurrentUser, 
  startLoading, 
  stopLoading,
  setCredentials,
  logout
} from '../redux/slices/authSlice';
import { useGetMeQuery } from '../redux/api/authApiSlice';

// Define context shape
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const loading = useSelector((state: any) => state.auth.isLoading);
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Fetch user data if token exists
  const { data: userData, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });
  
  useEffect(() => {
    // Set loading state
    dispatch(startLoading());
    
    // If we have a token but no user data in Redux, try to fetch user data
    if (token && !user) {
      if (userData && !error) {
        // Successfully retrieved user data, update Redux state
        dispatch(setCredentials({ user: userData, token }));
      } else if (error) {
        // Token is invalid or expired, clear it
        dispatch(logout());
      }
    }
    
    // Stop loading after user data is fetched or on error
    if (!isLoading) {
      dispatch(stopLoading());
    }
  }, [dispatch, token, user, userData, error, isLoading]);
  
  // Provide auth state to components
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;