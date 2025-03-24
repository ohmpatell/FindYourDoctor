// src/pages/Auth/Appointment.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const steps = ['Select Date', 'Select Time', 'Add Concerns', 'Confirmation'];

export default function Appointment({ open, onClose, doctor }) {

  const { auth } = useAuth();
  

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [concerns, setConcerns] = useState('');
  const [availableTime, setAvailableTime] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);


  // Fetch available times when a date is selected.
  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableTimes = async () => {
        try {
          const response = await api.get('/doctors/availability', {
            params: {
              doctorId: doctor._id,
              date: selectedDate.toISOString()
            }
          });
          // Expecting response.data.freeSlots to be an array of available hour integers.
          setAvailableTime(response.data.freeSlots);
        } catch (error) {
          console.error('Error fetching available times:', error);
          setSnackbarMsg(error.response?.data?.error || 'Error fetching available times.');
          setSnackbarOpen(true);
        }
      };

      fetchAvailableTimes();
    }
  }, [selectedDate, doctor.id]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if(activeStep === 0) {
      onClose();
    }
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConfirm = async () => {
    // Combine selected date and time into one Date object.
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(selectedTime, 10), 0, 0, 0);

    try {
      await api.post('/appointments', {
        patientId: auth.user._id,
        doctorId: doctor._id,
        appointmentDate: appointmentDateTime,
        concerns: concerns,
      });
      setSnackbarMsg('Appointment confirmed!');
      setAppointmentConfirmed(true);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setSnackbarMsg('Error confirming appointment.');
      setSnackbarOpen(true);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Select a Date
            </Typography>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedTime(''); // Reset time when date changes
              }}
              minDate={new Date()}
              inline
            />
          </Box>
        );
      case 1:
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Select a Time
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {availableTime?.length > 0 ? (
                availableTime.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === String(time) ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTime(String(time))}
                  >
                    {`${time}:00`}
                  </Button>
                ))
              ) : (
                <Typography>No available time slots.</Typography>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Add Your Concerns
            </Typography>
            <TextField
              multiline
              rows={4}
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              fullWidth
              placeholder="Describe your concerns or symptoms..."
              inputProps={{ maxLength: 500 }}
              helperText={`${concerns.length}/500`}
            />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Appointment
            </Typography>
            <Typography>Date: {selectedDate?.toDateString()}</Typography>
            <Typography>Time: {selectedTime}:00</Typography>
            <Typography>Concerns: {concerns}</Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="appointment-modal-title">
      <Paper sx={modalStyle}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
          {getStepContent(activeStep)}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleConfirm} disabled={appointmentConfirmed}>
                Confirm
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !selectedDate) ||
                  (activeStep === 1 && !selectedTime) ||
                  (activeStep === 2 && !concerns.trim())
                }
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </Modal>
  );
}
