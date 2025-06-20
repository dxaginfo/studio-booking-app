import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  useCreateBookingMutation, 
  useUpdateBookingMutation, 
  useGetBookingByIdQuery 
} from '../../redux/api/bookingApiSlice';
import { toast } from 'react-toastify';
import { format, addHours, isAfter, parseISO } from 'date-fns';

// Material UI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

// Validation schema
const bookingSchema = Yup.object().shape({
  studioId: Yup.string().required('Studio is required'),
  startTime: Yup.date()
    .required('Start time is required')
    .min(new Date(), 'Start time must be in the future'),
  endTime: Yup.date()
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function(value) {
      const { startTime } = this.parent;
      return !startTime || !value || isAfter(value, startTime);
    }),
  notes: Yup.string(),
  staffIds: Yup.array().of(Yup.string()),
});

// Mock studio data for now
// In a real app, this would come from an API call
const mockStudios = [
  { id: '1', name: 'Recording Studio A', hourlyRate: 75 },
  { id: '2', name: 'Recording Studio B', hourlyRate: 60 },
  { id: '3', name: 'Mixing Room', hourlyRate: 50 },
  { id: '4', name: 'Rehearsal Space', hourlyRate: 40 },
];

// Mock staff data for now
// In a real app, this would come from an API call
const mockStaff = [
  { id: '1', firstName: 'John', lastName: 'Doe', role: 'Sound Engineer' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', role: 'Assistant Engineer' },
  { id: '3', firstName: 'Robert', lastName: 'Johnson', role: 'Producer' },
];

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // RTK Query hooks
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const { data: existingBooking, isLoading: isFetching } = useGetBookingByIdQuery(id!, {
    skip: !isEditMode,
  });

  const [studios] = useState(mockStudios);
  const [staff] = useState(mockStaff);
  
  // Initial form values
  const initialValues = {
    studioId: existingBooking?.studioId || '',
    startTime: existingBooking?.startTime ? parseISO(existingBooking.startTime) : addHours(new Date(), 1),
    endTime: existingBooking?.endTime ? parseISO(existingBooking.endTime) : addHours(new Date(), 2),
    notes: existingBooking?.notes || '',
    staffIds: existingBooking?.staffAssignments?.map(sa => sa.staffId) || [],
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (isEditMode && existingBooking) {
        // Update existing booking
        await updateBooking({
          id: existingBooking.id,
          bookingData: {
            startTime: values.startTime.toISOString(),
            endTime: values.endTime.toISOString(),
            notes: values.notes,
            // Status might be updated from another form in a real app
          }
        }).unwrap();
        
        toast.success('Booking updated successfully!');
      } else {
        // Create new booking
        await createBooking({
          studioId: values.studioId,
          startTime: values.startTime.toISOString(),
          endTime: values.endTime.toISOString(),
          notes: values.notes,
          staffIds: values.staffIds,
        }).unwrap();
        
        toast.success('Booking created successfully!');
      }
      
      // Redirect to bookings list
      navigate('/bookings');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate price estimate based on selected studio and times
  const calculatePriceEstimate = (studioId: string, startTime: Date, endTime: Date) => {
    const studio = studios.find(s => s.id === studioId);
    if (!studio) return 0;
    
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return studio.hourlyRate * durationHours;
  };

  if (isEditMode && isFetching) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link color="inherit" href="/bookings">
          Bookings
        </Link>
        <Typography color="text.primary">
          {isEditMode ? 'Edit Booking' : 'New Booking'}
        </Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Booking' : 'New Booking'}
      </Typography>
      
      <Card>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={bookingSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Studio selection */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      select
                      name="studioId"
                      label="Studio"
                      fullWidth
                      disabled={isEditMode}
                      error={touched.studioId && Boolean(errors.studioId)}
                      helperText={touched.studioId && errors.studioId}
                    >
                      <MenuItem value="">Select a studio</MenuItem>
                      {studios.map((studio) => (
                        <MenuItem key={studio.id} value={studio.id}>
                          {studio.name} - ${studio.hourlyRate}/hr
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  
                  {/* Date/time pickers */}
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Start Time"
                        value={values.startTime}
                        onChange={(newValue) => {
                          setFieldValue('startTime', newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: touched.startTime && Boolean(errors.startTime),
                            helperText: touched.startTime && errors.startTime as string,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="End Time"
                        value={values.endTime}
                        onChange={(newValue) => {
                          setFieldValue('endTime', newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: touched.endTime && Boolean(errors.endTime),
                            helperText: touched.endTime && errors.endTime as string,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  {/* Staff selection */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      select
                      name="staffIds"
                      label="Staff (Optional)"
                      fullWidth
                      SelectProps={{
                        multiple: true,
                      }}
                      error={touched.staffIds && Boolean(errors.staffIds)}
                      helperText={touched.staffIds && errors.staffIds}
                    >
                      {staff.map((person) => (
                        <MenuItem key={person.id} value={person.id}>
                          {person.firstName} {person.lastName} - {person.role}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  
                  {/* Notes */}
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="notes"
                      label="Notes"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.notes && Boolean(errors.notes)}
                      helperText={touched.notes && errors.notes}
                    />
                  </Grid>
                  
                  {/* Price estimate */}
                  {values.studioId && values.startTime && values.endTime && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Studio:
                        </Typography>
                        <Typography variant="body1">
                          {studios.find(s => s.id === values.studioId)?.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Duration:
                        </Typography>
                        <Typography variant="body1">
                          {((values.endTime.getTime() - values.startTime.getTime()) / (1000 * 60 * 60)).toFixed(1)} hours
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Rate:
                        </Typography>
                        <Typography variant="body1">
                          ${studios.find(s => s.id === values.studioId)?.hourlyRate}/hour
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                          Estimated Total:
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${calculatePriceEstimate(values.studioId, values.startTime, values.endTime).toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Alert severity="info" sx={{ mb: 2 }}>
                        This is an estimated price. Final price may vary based on additional services or changes.
                      </Alert>
                    </Grid>
                  )}
                  
                  {/* Buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/bookings')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || isCreating || isUpdating}
                      >
                        {(isSubmitting || isCreating || isUpdating) ? (
                          <CircularProgress size={24} />
                        ) : isEditMode ? 'Update Booking' : 'Create Booking'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingForm;