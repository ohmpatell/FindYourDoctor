// src/pages/ClinicDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Grid, Card, CardContent, Box, Button, Divider, Stack
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Your axios instance
import RegisterWalkIn from '../components/RegisterWalkIn'; 

export default function ClinicDashboardPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [openWalkIn, setOpenWalkIn] = useState(false);


  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get(`/clinic/doctors`); // 🔁 You should implement this endpoint
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/clinic/appointments/today`); // 🔁 Backend returns today's appointments
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const appointmentsByDoctor = doctors.reduce((acc, doctor) => {
    acc[doctor._id] = appointments.filter(appt => appt.doctor === doctor._id);
    return acc;
  }, {});

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Clinic Dashboard
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Today's Appointments
      </Typography>
      <Stack spacing={2} sx={{ p: 2 }}>
      <Button 
        variant="contained" 
        onClick={() => setOpenWalkIn(true)} // Fixed: Wrapped in arrow function
      >
        Register Walk-In Patient
      </Button>
      <RegisterWalkIn 
        open={openWalkIn} 
        onClose={() => setOpenWalkIn(false)} // Added close handler
      />
    </Stack>

      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {(appointmentsByDoctor[doctor._id] || []).length > 0 ? (
                appointmentsByDoctor[doctor._id].map((appt) => (
                  <Card key={appt._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {appt.patientName || 'Patient'} - {appt.time}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {appt.status}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2">No appointments today.</Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
        Registered Doctors
      </Typography>
      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Dr. {doctor.firstName}</Typography>
              <Typography variant="body2" color="textSecondary">
                Specialty: {doctor.specialization}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/clinic/appointments/${doctor._id}`)}
                >
                  Manage Appointments
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Want to add more?</Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate('/clinic/register-doctor')}>
              Register Doctor
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
