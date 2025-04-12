// src/pages/PatientDetailPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const PatientDetailPage = () => {
  const location = useLocation();
  const patientFromState = location.state?.patient;
  const [patient, setPatient] = useState(patientFromState);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get(`/appointment/patient/${patient._id}`);
        const sorted = res.data.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        setAppointments(sorted);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setSnackbar({ open: true, message: 'Error fetching appointments.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (patient) {
      fetchAppointments();
    }
  }, [patient]);

  if (!patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Patient data not available.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Patient Profile Section */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={patient.profileImage} sx={{ width: 100, height: 100 }}>
              {patient.firstName[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5">
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {patient.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {patient.phoneNumber}
            </Typography>
            {patient.address && (
              <Typography variant="body1" color="text.secondary">
                {patient.address}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Medical History Section */}
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Medical History
        </Typography>
        {appointments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No history found for this patient.
          </Typography>
        ) : (
          <List>
            {appointments.map((appt) => (
              <Box key={appt._id} sx={{ mb: 2 }}>
                <ListItem alignItems="flex-start" button>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {new Date(appt.appointmentDate).toLocaleString()}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          Doctor: Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          Clinic: {appt.clinic?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Concerns: {appt.patientConcerns || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Doctor Notes: {appt.doctorNotes || 'No Notes'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Prescription: {appt.prescription || 'No prescription'}
                        </Typography>
                        {appt.testsPrescribed && appt.testsPrescribed.length > 0 && (
                          <Box sx={{ mt: 1, pl: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Tests:
                            </Typography>
                            {appt.testsPrescribed.map((test, idx) => (
                              <Typography key={idx} variant="caption" display="block" color="text.secondary">
                                {test.testName}: {test.details} - Result: {test.testResults || 'N/A'}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </Box>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientDetailPage;
