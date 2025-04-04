// src/components/AppointmentDetailModal.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoctorDetail from './DoctorDetail';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AppointmentDetailModal({ 
  appointment: initialAppointment, 
  open, 
  onClose 
}) {
  const { auth } = useAuth();
  const [appointment, setAppointment] = useState(initialAppointment);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [testsResults, setTestsResults] = useState(
    appointment?.testsPrescribed || []
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [doctorDetailOpen, setDoctorDetailOpen] = useState(false);

  // Helper: Format date/time nicely
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();

  // Save changes (update appointment via API)
  const handleSaveChanges = async () => {
    const updates = {
      notes,
      testsPrescribed: testsResults
    };

    // For doctors/clinics, allow status update too if editMode (status UI could be added separately)
    if (auth.user.role !== 'USER' && appointment.status !== 'CANCELLED') {
      // Assume a local state update for status if needed, or add additional UI controls.
      updates.status = appointment.status;
    }

    try {
      const response = await api.put(`/appointment/${appointment._id}`, updates);
      setAppointment(response.data);
      setSnackbarMsg('Appointment updated successfully.');
      setOpenSnackbar(true);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbarMsg('Error updating appointment.');
      setOpenSnackbar(true);
    }
  };

  // Cancel appointment (for patients)
  const handleCancelAppointment = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await api.put(`/appointment/${appointment._id}`, { 
          ...appointment, 
          status: "cancelled" 
      });
        setAppointment(response.data);
        setSnackbarMsg('Appointment cancelled.');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        setSnackbarMsg('Error cancelling appointment.');
        setOpenSnackbar(true);
      }
    }
  };

  // For doctors/clinics: confirm or cancel via buttons
  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await api.put(`/appointment/${appointment._id}`, { 
        ...appointment, 
        status: newStatus 
      });
      setAppointment(response.data);
      setSnackbarMsg(`Appointment ${newStatus.toUpperCase()}.`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbarMsg('Error updating status.');
      setOpenSnackbar(true);
    }
  };

  // Update test results locally
  const handleTestResultChange = (index, value) => {
    const updated = [...testsResults];
    updated[index] = { ...updated[index], testResults: value };
    setTestsResults(updated);
  };

  // Open doctor detail modal
  const openDoctorModal = () => setDoctorDetailOpen(true);
  const closeDoctorModal = () => setDoctorDetailOpen(false);

  // Handle close with confirmation if in edit mode
  const handleClose = () => {
    if (editMode) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setEditMode(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  // When saving changes also close the modal
  const handleSaveAndClose = async () => {
    await handleSaveChanges();
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      scroll="paper"
    >
      {/* App Bar with close button */}
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Appointment Details
          </Typography>
          {editMode ? (
            <Button color="inherit" onClick={handleSaveAndClose}>
              Save
            </Button>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => setEditMode(true)}
              disabled={
                auth.user.role === 'USER' && 
                (appointment.status !== 'scheduled' && appointment.status !== 'confirmed')
              }
            >
              Edit
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Grid container spacing={2}>
              {/* Patient and Doctor Names */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  Patient: {appointment.patient?.firstName} {appointment.patient?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={openDoctorModal}
                >
                  Doctor: Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </Typography>
              </Grid>
              {/* Clinic Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Clinic: {appointment.clinic?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {appointment.clinic?.address?.street || 'N/A'}, {appointment.clinic?.address?.city || 'N/A'}, {appointment.clinic?.address?.province || 'N/A'}
                </Typography>
              </Grid>
              {/* Appointment Date & Status */}
              <Grid item xs={12}>
                <Typography variant="body1">
                  Date & Time: {formatDateTime(appointment.appointmentDate)}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: appointment.status.toUpperCase() === 'CONFIRMED'
                      ? 'green'
                      : appointment.status.toUpperCase() === 'CANCELLED'
                      ? 'red'
                      : appointment.status.toUpperCase() === 'COMPLETED'
                      ? 'grey'
                      : 'black'
                  }}
                >
                  {appointment.status.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              {/* Patient Concerns */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Patient Concerns:</Typography>
                {editMode && (auth.user.role === 'USER' || auth.user.role === 'DOCTOR' || auth.user.role === 'CLINIC') &&
                  (appointment.status === 'scheduled' || appointment.status === 'confirmed') ? (
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      variant="outlined"
                      margin="normal"
                    />
                  ) : (
                    <Typography variant="body2" paragraph>
                      {appointment.patientConcerns || 'No concerns noted.'}
                    </Typography>
                  )
                }
              </Grid>
              {/* Doctor's Notes and Prescription */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Prescription:</Typography>
                <Typography variant="body2" paragraph>
                  {appointment.prescription || 'No prescriptions provided.'}
                </Typography>
              </Grid>
              {/* Tests Prescribed */}
              {appointment.testsPrescribed && appointment.testsPrescribed.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Tests Prescribed:</Typography>
                  {appointment.testsPrescribed.map((test, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {test.testName}
                      </Typography>
                      <Typography variant="body2" gutterBottom>Details: {test.details}</Typography>
                      <Typography variant="body2">
                        Test Results:{' '}
                        {editMode && (appointment.status === 'scheduled' || appointment.status === 'confirmed') ? (
                          <TextField
                            value={testsResults[index]?.testResults || ''}
                            onChange={(e) => handleTestResultChange(index, e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="normal"
                          />
                        ) : (
                          test.testResults || 'N/A'
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              )}
              {/* Last Edited */}
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Last Updated: {new Date(appointment.updatedAt || appointment.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        {(auth.user.role === 'DOCTOR' || auth.user.role === 'CLINIC') && 
          (appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleStatusUpdate('confirmed')}
              sx={{ mr: 1 }}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleStatusUpdate('cancelled')}
            >
              Cancel
            </Button>
          </Box>
        )}
        {auth.user.role === 'USER' && 
          (appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelAppointment}
          >
            Cancel Appointment
          </Button>
        )}
        <Box>
          <Button onClick={handleClose}>Close</Button>
          {editMode && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveChanges}
              sx={{ ml: 1 }}
            >
              Save Changes
            </Button>
          )}
        </Box>
      </DialogActions>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
      
      {/* Doctor Detail Modal */}
      {doctorDetailOpen && (
        <DoctorDetail
          doctorId={appointment.doctor?._id}
          onClose={closeDoctorModal}
        />
      )}
    </Dialog>
  );
}