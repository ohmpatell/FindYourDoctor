import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AppointmentDetailModal from '../components/AppointmentDetailModal';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const appointmentRefs = useRef({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointment');
      const sortedAppointments = response.data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const now = new Date();
    const upcomingAppointment = appointments.find(appointment => new Date(appointment.appointmentDate) >= now);
    if (upcomingAppointment && appointmentRefs.current[upcomingAppointment._id]) {
      appointmentRefs.current[upcomingAppointment._id].scrollIntoView({ behavior: 'smooth' });
    }
  }, [appointments]);

  const handleOpenDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsAppointmentDetailOpen(false);
    fetchAppointments();
  };

  const isPastAppointment = (appointmentDate) => {
    const now = new Date();
    return new Date(appointmentDate) < now;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      <Grid container spacing={2}>
        {appointments.map((appointment) => {
          const past = isPastAppointment(appointment.appointmentDate);
          const cardStyles = past
            ? { backgroundColor: '#f0f0f0', pointerEvents: 'none', opacity: 0.7 }
            : { cursor: 'pointer' };

          return (
            <Grid item xs={12} key={appointment._id} >
              <Paper
                ref={el => appointmentRefs.current[appointment._id] = el}
                sx={{ p: 2, ...cardStyles }}
                onClick={() => handleOpenDetail(appointment)}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="h6">
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Specialty: {appointment.doctor?.specialty}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Clinic: {appointment.clinic?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    Address: {appointment.clinic?.address?.street || 'N/A'}, {appointment.clinic?.address?.city || 'N/A'}, {appointment.clinic?.address?.province || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date & Time: {new Date(appointment.appointmentDate).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          open={isAppointmentDetailOpen}
          onClose={handleCloseDetail}
        />
      )}
    </Box>
  );
};

export default MyAppointmentsPage;
