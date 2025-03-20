import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DoctorDetail({ doctorId, open, onClose }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      axios.get(`/api/doctors/${doctorId}`)
        .then(response => {
          setDoctor(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching doctor details:', error);
          setLoading(false);
        });
    }
  }, [doctorId]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="doctor-detail-title">
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {loading ? (
          <CircularProgress />
        ) : doctor ? (
          <>
            <Typography id="doctor-detail-title" variant="h6" component="h2">
              {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Email:</strong> {doctor.email}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Phone Number:</strong> {doctor.phoneNumber}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Specialty:</strong> {doctor.specialty}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Clinic ID:</strong> {doctor.clinicId}
            </Typography>
            {doctor.profileImage && (
              <Box sx={{ mt: 2 }}>
                <img src={doctor.profileImage} alt={`${doctor.firstName} ${doctor.lastName}`} width="100%" />
              </Box>
            )}
          </>
        ) : (
          <Typography>No doctor details available.</Typography>
        )}
      </Box>
    </Modal>
  );
}
