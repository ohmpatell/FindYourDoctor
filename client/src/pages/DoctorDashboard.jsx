// src/pages/DoctorDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import AppointmentDetailModal from '../components/AppointmentDetailModal';

const DoctorDashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);

  // Fetch doctor's appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointment');
        // Sort appointments chronologically
        const sorted = res.data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        setAppointments(sorted);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setSnackbar({ open: true, message: 'Failed to load appointments.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [auth.user._id]);

  // Helper: Check if an appointment is today
  const isToday = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    return now.toDateString() === date.toDateString();
  };

  // Filter today's appointments
  const todayAppointments = appointments.filter(appt => isToday(appt.appointmentDate));
  const now = new Date();
  const upcomingAppointments = todayAppointments.filter(appt => new Date(appt.appointmentDate) >= now);
  const completedAppointments = todayAppointments.filter(appt => new Date(appt.appointmentDate) < now);

  // Extract unique patients from appointments
  const allPatients = useMemo(() => {
    return [...new Map(appointments.map(appt => [appt.patient._id, appt.patient])).values()];
  }, [appointments]);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, allPatients]);

  const handleOpenDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsAppointmentDetailOpen(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f7f9fc' }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Welcome, Dr. {auth.user.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your dashboard for today—stay on top of your schedule and patient care.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Today's Appointments Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Upcoming
            </Typography>
            {upcomingAppointments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No upcoming appointments today.
              </Typography>
            ) : (
              upcomingAppointments.map(appt => (
                <Box
                  key={appt._id}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenDetail(appt)}
                >
                  <Typography variant="body1">
                    {new Date(appt.appointmentDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {appt.patient?.firstName} {appt.patient?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {appt.status.toUpperCase()}
                  </Typography>
                </Box>
              ))
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">
              Completed
            </Typography>
            {completedAppointments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No completed appointments today.
              </Typography>
            ) : (
              completedAppointments.map(appt => (
                <Box
                  key={appt._id}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    backgroundColor: '#f0f0f0'
                  }}
                  onClick={() =>
                    navigate(`/appointment/${appt._id}`, { state: { appointment: appt } })
                  }
                >
                  <Typography variant="body1">
                    {new Date(appt.appointmentDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {appt.patient?.firstName} {appt.patient?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {appt.status.toUpperCase()}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Patient Directory Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Patient Directory
            </Typography>
            <TextField
              fullWidth
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            {filteredPatients.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No patients found.
              </Typography>
            ) : (
              <List>
                {filteredPatients.map((patient) => (
                  <ListItem
                    key={patient._id}
                    button
                    onClick={() =>
                      navigate(`/patient/${patient._id}`, { state: { patient } })
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`${patient.firstName} ${patient.lastName}`}
                        src={patient.profileImage || ''}
                      >
                        {patient.firstName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${patient.firstName} ${patient.lastName}`}
                      secondary={patient.email}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} FindYourDoctor. All rights reserved.
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          open={isAppointmentDetailOpen}
          onClose={handleCloseDetail}
          onUpdate={(updated) => {
            setAppointments(prev => prev.map(appt => appt._id === updated._id ? updated : appt));
          }}
        />
      )}
    </Box>
  );
};

export default DoctorDashboard;
