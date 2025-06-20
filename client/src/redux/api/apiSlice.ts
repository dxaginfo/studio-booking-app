import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define our base api service
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from auth state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, include it in the request
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }
  }),
  tagTypes: ['Bookings', 'Studios', 'Equipment', 'Users', 'Auth', 'Availability', 'Payments'],
  endpoints: () => ({}),
});

// Export hooks for usage in components
// These are auto-generated based on the endpoints you define
export const {} = apiSlice;