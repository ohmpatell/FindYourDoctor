import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AppointmentDetailModal from './AppointmentDetailModal';
import DoctorDetail from './DoctorDetail';

const UserDashboard = () => {
  const { auth } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
const [doctorDetailOpen, setDoctorDetailOpen] = useState(false);
const [selectedDoctorId, setSelectedDoctorId] = useState(null);

const handleOpenDoctorDetail = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setDoctorDetailOpen(true);
};

const closeDoctorModal = () => {
    setDoctorDetailOpen(false);
    setSelectedDoctorId(null);
};

  const handleOpenDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsAppointmentDetailOpen(false);
    setSelectedAppointment(null);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get(`/appointment`);
        const sorted = res.data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        const now = new Date();
        setUpcomingAppointments(sorted.filter(a => new Date(a.appointmentDate) > now));
        setLastAppointment(sorted.filter(a => new Date(a.appointmentDate) <= now).pop());
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [auth.user._id]);


  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Health Hub
      </Typography>

      {/* Upcoming Appointments */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <EventAvailableIcon sx={{ mr: 1 }} /> Upcoming Appointments
        </Typography>
        {upcomingAppointments.length === 0 ? (
          <Typography color="text.secondary">You have no upcoming appointments.</Typography>
        ) : (
          <Grid container spacing={2}>
            {upcomingAppointments.slice(0, 2).map((appt) => (
              <Grid item xs={12} md={6} key={appt._id} >
                <Paper sx={{ p: 2,  cursor: 'pointer' }} onClick={() => handleOpenDetail(appt)}>
                  <Typography variant="subtitle1">
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </Typography>
                  <Typography>
                    Doctor: Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clinic: {appt.clinic?.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Last Appointment */}
      {lastAppointment && (
        <Paper sx={{ p: 3, mb: 4, cursor: 'pointer' }} elevation={3} onClick={() => handleOpenDetail(lastAppointment)} >
          <Typography variant="h6" sx={{ mb: 2 }}>
            <LocalHospitalIcon sx={{ mr: 1 }} /> Last Appointment
          </Typography>
          <Typography variant="subtitle1">
            {new Date(lastAppointment.appointmentDate).toLocaleString()}
          </Typography>
          <Typography>
            Doctor: Dr. {lastAppointment.doctor?.firstName} {lastAppointment.doctor?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clinic: {lastAppointment.clinic?.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Notes: {lastAppointment.notes || 'No notes provided.'}
          </Typography>
        </Paper>
      )}

      {/* Quick Contact with Last Doctor */}
      {lastAppointment?.doctor && (
        <Paper sx={{ p: 3, cursor: 'pointer' }} elevation={3} onClick={() => handleOpenDoctorDetail(lastAppointment.doctor._id)}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <PersonIcon sx={{ mr: 1 }} /> Your Last Doctor
          </Typography>
          <Typography>
            Dr. {lastAppointment.doctor.firstName} {lastAppointment.doctor.lastName}
          </Typography>
          <Typography variant="body2">
            Email: {lastAppointment.doctor.email || 'N/A'}
          </Typography>
        </Paper>
      )}

        {selectedAppointment && (
              <AppointmentDetailModal
                appointment={selectedAppointment}
                open={isAppointmentDetailOpen}
                onClose={handleCloseDetail}
              />
        )}

        {doctorDetailOpen && (
            <DoctorDetail
            doctorId={selectedDoctorId}
            onClose={closeDoctorModal}
            />
        )}
    </Box>
  );
};

export default UserDashboard;
