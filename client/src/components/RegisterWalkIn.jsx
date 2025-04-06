// File: RegisterWalkIn.jsx
import React, { useState } from 'react';
import api from '../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

export default function RegisterWalkIn({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async () => {
    if (!isEmailValid) return;

    try {
      const response = await api.post('/walk-ins/register', formData);

      setSnackbar({
        open: true,
        message: 'Registration successful!',
        severity: 'success'
      });

      setFormData({ firstName: '', lastName: '', email: '' });

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Register Walk-In Patient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name *"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email *"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!isEmailValid && formData.email !== ''}
            helperText={
              !isEmailValid && formData.email !== ''
                ? 'Enter a valid email (e.g., user@example.com)'
                : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.firstName || !isEmailValid}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}
