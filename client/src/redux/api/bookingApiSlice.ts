import { apiSlice } from './apiSlice';

// Define booking types
export interface Booking {
  id: string;
  studioId: string;
  clientId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  studio?: Studio;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  staffAssignments?: StaffAssignment[];
  payments?: Payment[];
  prepMaterials?: PrepMaterial[];
}

export interface Studio {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  location: string;
  capacity: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface StaffAssignment {
  id: string;
  bookingId: string;
  staffId: string;
  role: string;
  staff?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrepMaterial {
  id: string;
  bookingId: string;
  title: string;
  description?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  studioId?: string;
  clientId?: string;
}

interface CreateBookingRequest {
  studioId: string;
  startTime: string;
  endTime: string;
  notes?: string;
  staffIds?: string[];
}

interface UpdateBookingRequest {
  startTime?: string;
  endTime?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

// Extend the api slice with booking endpoints
export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bookings with optional filters
    getBookings: builder.query<Booking[], BookingFilters | void>({
      query: (filters) => ({
        url: '/bookings',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Bookings' as const, id })),
              { type: 'Bookings', id: 'LIST' },
            ]
          : [{ type: 'Bookings', id: 'LIST' }],
    }),
    
    // Get a single booking by ID
    getBookingById: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bookings', id }],
    }),
    
    // Create a new booking
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),
    
    // Update an existing booking
    updateBooking: builder.mutation<Booking, { id: string; bookingData: UpdateBookingRequest }>({
      query: ({ id, bookingData }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: bookingData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),
    
    // Delete a booking
    deleteBooking: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Bookings', id },
        { type: 'Bookings', id: 'LIST' },
      ],
    }),
  }),
});

// Export auto-generated hooks for usage in components
export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApiSlice;