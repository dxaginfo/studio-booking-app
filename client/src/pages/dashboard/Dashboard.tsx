import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetBookingsQuery } from '../../redux/api/bookingApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { format } from 'date-fns';

// Material UI imports
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  MusicNote as MusicNoteIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

// Dashboard component
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const user = useSelector(selectCurrentUser);
  
  // Fetch upcoming bookings
  const { data: bookings, isLoading, error } = useGetBookingsQuery({
    // Filter for upcoming bookings in next 30 days
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ...(user?.role === 'CLIENT' ? { clientId: user.id } : {}),
  });
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Welcome message */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1">
          {user?.role === 'CLIENT' 
            ? 'Here you can manage your studio bookings and view your upcoming sessions.'
            : 'Here you can manage studio bookings, staff assignments, and monitor your business.'}
        </Typography>
      </Paper>
      
      {/* Quick stats for admins and staff */}
      {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Bookings</Typography>
                </Box>
                <Typography variant="h4">
                  {isLoading ? <CircularProgress size={20} /> : bookings?.filter(booking => 
                    new Date(booking.startTime).toDateString() === new Date().toDateString()
                  ).length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MusicNoteIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Studios</Typography>
                </Box>
                <Typography variant="h4">
                  {/* This would come from another query */}
                  4
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Staff Working</Typography>
                </Box>
                <Typography variant="h4">
                  {/* This would come from another query */}
                  3
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MoneyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Revenue</Typography>
                </Box>
                <Typography variant="h4">
                  ${isLoading ? <CircularProgress size={20} /> : 
                    bookings?.filter(booking => 
                      new Date(booking.startTime).toDateString() === new Date().toDateString() &&
                      booking.status === 'CONFIRMED'
                    ).reduce((acc, booking) => acc + booking.totalPrice, 0).toFixed(2) || '0.00'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Tabs section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Upcoming Bookings" />
          {user?.role !== 'CLIENT' && <Tab label="Pending Approvals" />}
          <Tab label="Recent Activity" />
        </Tabs>
      </Box>
      
      {/* Upcoming Bookings tab */}
      {activeTab === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Upcoming Bookings</Typography>
            <Button 
              component={RouterLink} 
              to="/bookings/new" 
              variant="contained" 
              color="primary"
            >
              New Booking
            </Button>
          </Box>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              Error loading bookings. Please try again later.
            </Alert>
          ) : bookings && bookings.length > 0 ? (
            <Grid container spacing={3}>
              {bookings.map((booking) => (
                <Grid item xs={12} sm={6} md={4} key={booking.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" noWrap>
                          {booking.studio?.name}
                        </Typography>
                        <Chip 
                          label={booking.status} 
                          color={getStatusColor(booking.status) as any} 
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {format(new Date(booking.startTime), 'MMM dd, yyyy')} | {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      {user?.role !== 'CLIENT' && (
                        <Typography variant="body2" gutterBottom>
                          Client: {booking.client?.firstName} {booking.client?.lastName}
                        </Typography>
                      )}
                      
                      <Typography variant="body2" gutterBottom>
                        Staff: {booking.staffAssignments && booking.staffAssignments.length > 0 
                          ? booking.staffAssignments.map(sa => `${sa.staff?.firstName} ${sa.staff?.lastName}`).join(', ')
                          : 'None assigned'}
                      </Typography>
                      
                      <Typography variant="body1" fontWeight="bold" mt={1}>
                        ${booking.totalPrice.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        component={RouterLink} 
                        to={`/bookings/${booking.id}`} 
                        size="small"
                      >
                        View Details
                      </Button>
                      <Button 
                        component={RouterLink} 
                        to={`/bookings/${booking.id}/edit`} 
                        size="small" 
                        color="primary"
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No upcoming bookings found. {' '}
              <Link component={RouterLink} to="/studios">
                Browse studios
              </Link> {' '}
              to make a booking.
            </Alert>
          )}
        </Box>
      )}
      
      {/* Pending Approvals tab - only for staff and admin */}
      {activeTab === 1 && user?.role !== 'CLIENT' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Pending Approvals
          </Typography>
          
          {/* We would have another query for pending bookings */}
          <Alert severity="info">
            No bookings pending approval at this time.
          </Alert>
        </Box>
      )}
      
      {/* Recent Activity tab */}
      {activeTab === (user?.role === 'CLIENT' ? 1 : 2) && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          
          {/* We would have another query for recent activity */}
          <Alert severity="info">
            No recent activity to display.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;