// src/components/AppointmentDetailModal.jsx
import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
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
  DialogTitle,
  DialogContentText,
  IconButton,
  AppBar,
  Toolbar,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoctorDetail from './DoctorDetail';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Confirmation Dialog Component
function ConfirmationDialog({ open, title, content, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">No</Button>
        <Button onClick={onConfirm} color="primary" autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

// Prescription Modal Component
function PrescriptionModal({ open, onClose, prescriptionText }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'sticky' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
            Prescription Details
          </Typography>
          <Button color="inherit" onClick={handlePrint}>Print</Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <Typography variant="body1">
            {prescriptionText || 'No prescription provided.'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function AppointmentDetailModal({
  appointment: initialAppointment,
  open,
  onClose,
  onUpdate
}) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(initialAppointment);
  const [editMode, setEditMode] = useState(false);
  const [patientConcerns, setPatientConcerns] = useState(appointment?.patientConcerns || '');
  const [doctorsNotes, setDoctorsNotes] = useState(appointment?.doctorsNotes || '');
  const [prescription, setPrescription] = useState(appointment?.prescription || '');
  // Use local testsResults for edit mode; if not editing, fallback to appointment.testsPrescribed
  const [testsResults, setTestsResults] = useState(appointment?.testsPrescribed || []);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [doctorDetailOpen, setDoctorDetailOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'cancel' or 'confirm'
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

  // Helper: Format date/time nicely
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();

  // When modal opens, update state from initialAppointment
  useEffect(() => {
    if (open && initialAppointment) {
      setAppointment(initialAppointment);
      setPatientConcerns(initialAppointment.patientConcerns || '');
      setDoctorsNotes(initialAppointment.doctorsNotes || '');
      setPrescription(initialAppointment.prescription || '');
      setTestsResults(initialAppointment.testsPrescribed || []);
    }
  }, [open, initialAppointment]);

  // Save changes (update appointment via API)
  const handleSaveChanges = async () => {
    const updates = {
      patientConcerns,
      doctorsNotes,
      prescription,
      testsPrescribed: testsResults
    };

    if (auth.user.role !== 'USER' && appointment.status !== 'cancelled') {
      updates.status = appointment.status;
    }

    try {
      const response = await api.put(`/appointment/${appointment._id}`, updates);
      setAppointment(response.data);
      setSnackbarMsg('Appointment updated successfully.');
      setOpenSnackbar(true);
      setEditMode(false);
      if (onUpdate) onUpdate(response.data);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbarMsg('Error updating appointment.');
      setOpenSnackbar(true);
    }
  };

  // Confirmation for cancel or confirm actions using ConfirmationDialog
  const handleConfirmAction = async () => {
    if (confirmAction === 'cancelled') {
      if (appointment.status === 'completed') {
        setSnackbarMsg('Appointment already completed.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
        return;
      }
      if (appointment.status === 'cancelled') {
        setSnackbarMsg('Appointment already cancelled.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
        return;
      }
      try {
        const response = await api.put(`/appointment/${appointment._id}`, { ...appointment, status: 'cancelled' });
        setAppointment(response.data);
        setSnackbarMsg('Appointment cancelled.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        setSnackbarMsg('Error cancelling appointment.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
      }
    } else if (confirmAction === 'confirmed') {
      if (appointment.status === 'completed') {
        setSnackbarMsg('Appointment already completed.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
        return;
      }
      if (appointment.status === 'confirmed') {
        setSnackbarMsg('Appointment already confirmed.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
        return;
      }
      try {
        const response = await api.put(`/appointment/${appointment._id}`, { ...appointment, status: 'confirmed' });
        setAppointment(response.data);
        setSnackbarMsg('Appointment confirmed.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
      } catch (error) {
        console.error('Error confirming appointment:', error);
        setSnackbarMsg('Error confirming appointment.');
        setOpenSnackbar(true);
        setConfirmDialogOpen(false);
      }
    }
  };

  const handleStatusUpdateClick = (newStatus) => {
    setConfirmAction(newStatus);
    setConfirmDialogOpen(true);
  };

  // Cancel appointment (for patients) using confirmation dialog
  const handleCancelAppointment = async () => {
    setConfirmDialogOpen(true);
    setConfirmAction('cancel');
  };

  const handleTestResultChange = (index, value) => {
    const updated = [...testsResults];
    updated[index] = { ...updated[index], testResults: value };
    setTestsResults(updated);
  };

  // Add new test entry (for doctors/clinics)
  const handleAddTest = () => {
    setTestsResults(prev => [...prev, { testName: '', details: '', testResults: '' }]);
  };

  // Remove test entry by index
  const handleRemoveTest = (index) => {
    setTestsResults(prev => prev.filter((_, i) => i !== index));
  };

  // Open doctor detail modal
  const openDoctorModal = () => setDoctorDetailOpen(true);
  const closeDoctorModal = () => setDoctorDetailOpen(false);

  // Instead of window.confirm on unsaved changes, open a confirmation dialog
  const handleAttemptClose = () => {
    if (editMode) {
      setUnsavedDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleUnsavedConfirm = () => {
    setEditMode(false);
    setUnsavedDialogOpen(false);
    onClose();
  };

  const handleUnsavedCancel = () => {
    setUnsavedDialogOpen(false);
  };

  // Open Prescription Modal when "View Prescription" is clicked
  const handleViewPrescription = () => setPrescriptionModalOpen(true);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleAttemptClose}
      TransitionComponent={Transition}
      scroll="paper"
    >
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleAttemptClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Appointment Details
          </Typography>
          {editMode ? (
            <Button color="inherit" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => setEditMode(true)}
              disabled={auth.user.role === 'USER' && (appointment.status !== 'scheduled' && appointment.status !== 'confirmed')}
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
                <Typography
                  variant="h6"
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(`/patient/${initialAppointment.patient?._id}`, { state: { patient: initialAppointment.patient } })
                  }
                >
                  Patient: {initialAppointment.patient?.firstName} {initialAppointment.patient?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={openDoctorModal}
                >
                  Doctor: Dr. {initialAppointment.doctor?.firstName} {initialAppointment.doctor?.lastName}
                </Typography>
              </Grid>
              {/* Clinic Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Clinic: {initialAppointment.clinic?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {initialAppointment.clinic?.address?.street || 'N/A'}, {initialAppointment.clinic?.address?.city || 'N/A'}, {initialAppointment.clinic?.address?.province || 'N/A'}
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
                      value={patientConcerns}
                      onChange={(e) => setPatientConcerns(e.target.value)}
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
              {/* Doctor's Notes */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Doctor's Notes:</Typography>
                {editMode && (auth.user.role === 'DOCTOR' || auth.user.role === 'CLINIC') &&
                  (appointment.status === 'scheduled' || appointment.status === 'confirmed') ? (
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      value={doctorsNotes}
                      onChange={(e) => setDoctorsNotes(e.target.value)}
                      variant="outlined"
                      margin="normal"
                    />
                  ) : (
                    <Typography variant="body2" paragraph>
                      {appointment.doctorsNotes || 'No doctor notes provided.'}
                    </Typography>
                  )
                }
              </Grid>
              {/* Prescription Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Prescription:</Typography>
                {editMode && (auth.user.role === 'DOCTOR' || auth.user.role === 'CLINIC') &&
                  (appointment.status === 'scheduled' || appointment.status === 'confirmed') ? (
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      variant="outlined"
                      margin="normal"
                    />
                  ) : (
                    <Typography variant="body2" paragraph>
                      {appointment.prescription || 'No prescription provided.'}
                    </Typography>
                  )
                }
                {appointment.prescription && (
                  <Button variant="outlined" onClick={handleViewPrescription}>
                    View Prescription
                  </Button>
                )}
              </Grid>
              {/* Tests Prescribed */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Tests Prescribed:
                </Typography>
                {editMode ? (
                  testsResults.map((test, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Test Name"
                            fullWidth
                            value={test.testName}
                            onChange={(e) => {
                              const updated = [...testsResults];
                              updated[index] = { ...updated[index], testName: e.target.value };
                              setTestsResults(updated);
                            }}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Details"
                            fullWidth
                            value={test.details}
                            onChange={(e) => {
                              const updated = [...testsResults];
                              updated[index] = { ...updated[index], details: e.target.value };
                              setTestsResults(updated);
                            }}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Results"
                            fullWidth
                            value={test.testResults || ''}
                            onChange={(e) => handleTestResultChange(index, e.target.value)}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveTest(index)}
                            size="small"
                          >
                            X
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  appointment.testsPrescribed && appointment.testsPrescribed.length > 0 ? (
                    appointment.testsPrescribed.map((test, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {test.testName}
                        </Typography>
                        <Typography variant="body2">Details: {test.details}</Typography>
                        <Typography variant="body2">Results: {test.testResults || 'N/A'}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tests prescribed.
                    </Typography>
                  )
                )}
                {(editMode && (auth.user.role === 'DOCTOR' || auth.user.role === 'CLINIC')) && (
                  <Button variant="outlined" onClick={handleAddTest} sx={{ mt: 1 }}>
                    Add Test
                  </Button>
                )}
              </Grid>
              {/* Last Updated */}
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Created: {new Date(appointment.updatedAt || appointment.createdAt).toLocaleString()}
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
                onClick={() => handleStatusUpdateClick('confirmed')}
                sx={{ mr: 1 }}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleStatusUpdateClick('cancelled')}
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
          <Button onClick={onClose}>Close</Button>
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

      {/* Confirmation Dialog for status updates */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Confirm Action"
        content={`Are you sure you want to ${confirmAction} this appointment?`}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {/* Confirmation Dialog for unsaved changes on close */}
      <ConfirmationDialog
        open={unsavedDialogOpen}
        title="Unsaved Changes"
        content="You have unsaved changes. Are you sure you want to close without saving?"
        onConfirm={handleUnsavedConfirm}
        onCancel={handleUnsavedCancel}
      />

      {/* Prescription Modal */}
      <PrescriptionModal
        open={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        prescriptionText={appointment.prescription}
      />

      {/* Doctor Detail Modal */}
      {doctorDetailOpen && (
        <DoctorDetail
          doctorId={appointment.doctor?._id}
          open={doctorDetailOpen}
          onClose={closeDoctorModal}
        />
      )}
    </Dialog>
  );
}

export { ConfirmationDialog, PrescriptionModal };
