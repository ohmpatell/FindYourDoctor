import * as React from 'react';
import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import Appointment from '../components/Appointment'; // Import the Appointment component

export default function SearchDoctor() {
  const [open, setOpen] = useState(false); // State to control modal visibility

  // Open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Book Appointment
      </Button>

      {/* Modal for Appointment */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="appointment-modal"
        aria-describedby="appointment-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Book Appointment
          </Typography>
          <Appointment onClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}