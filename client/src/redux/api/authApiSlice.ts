import { apiSlice } from './apiSlice';
import { User } from '../slices/authSlice';

// Define interface for request and response types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
}

interface AuthResponse {
  token: string;
  user: User;
}

// Extend the api slice with auth endpoints
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

// Export auto-generated hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} = authApiSlice;