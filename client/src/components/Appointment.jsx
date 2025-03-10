import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, Typography, Paper, Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Default styles

const steps = ['Select Date', 'Select Time', 'Add Concerns', 'Confirmation'];

const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'
  ]; //To be changed by the API handler

export default function Appointment({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [concerns, setConcerns] = useState('');

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConfirm = () => {
    // Submit appointment details to the backend
    console.log('Appointment confirmed:', { selectedDate, selectedTime, concerns });
    onClose(); // Close the modal after confirmation
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="h6" gutterBottom>
              Select a Date
            </Typography>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()} // Only allow dates from today onwards
              inline // Display the calendar inline
            />
          </Box>
        );
      case 1:
        return (
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="h6" gutterBottom>
              Select a Time
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </Box>
          </Box>
        );
      case 2:
        return (
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
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
              inputProps={{ maxLength: 500 }} // Optional: Add a character limit
              helperText={`${concerns.length}/500`} // Optional: Show character count
            />
          </Box>
        );
      case 3:
        return (
            <div>
            <Typography variant="h6" gutterBottom>
              Confirm Your Appointment
            </Typography>
            <Typography>Date: {selectedDate?.toDateString()}</Typography>
            <Typography>Time: {selectedTime}</Typography>
            <Typography>Concerns: {concerns}</Typography>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {getStepContent(activeStep)}
        <div style={{ marginTop: '20px' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !selectedDate) || // Disable "Next" if no date is selected
                (activeStep === 1 && !selectedTime) || // Disable "Next" if no time is selected
                (activeStep === 2 && !concerns.trim()) // Disable "Next" if concerns are empty
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </Paper>
  );
}