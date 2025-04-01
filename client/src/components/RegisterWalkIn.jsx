import React, { useState } from 'react';
import api from '../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

export default function RegisterWalkIn({ open, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Basic email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async () => {
    if (!isEmailValid) return; // Prevent submission if invalid
    try {
        const response = await api.post('/walk-ins/register', formData);
        alert('Success!');
    }
    catch(error){
        console.error('Error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
    
        // Show user-friendly error feedback
        alert(errorMessage); // Replace with a toast/notification in production
    };
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register Walk-In Patient</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name *"
          fullWidth
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Email *"
          type="email"
          fullWidth
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
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
          disabled={!formData.firstName || !isEmailValid} // Disable if invalid
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}