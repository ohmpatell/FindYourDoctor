import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Modal } from '@mui/material';
import api from '../services/api';

const DoctorDetail = ({ doctorId, onClose }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/doctors/${doctorId}`); // You may need to add this route
        setDoctor(response.data);
      } catch (err) {
        setError('Error loading doctor details');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
    fetchDoctor();
    }
  }, [doctorId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Modal open={Boolean(doctor)} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Card>
          {doctor && (
            <> 
            {doctor?.profileImage && (
              <CardMedia
                component="img"
                height="250"
                image={doctor.profileImage}
                alt={`${doctor.firstName} ${doctor.lastName}`}
              />
            )}
            <CardContent>
              <Typography variant="h5">{doctor.firstName} {doctor.lastName}</Typography>
              <Typography variant="subtitle1">Specialization: {doctor.specialization}</Typography>
              <Typography variant="body2">{doctor.bio}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Credentials: {doctor.credentials}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Clinic: {doctor.clinic?.name || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Address: {doctor.clinic?.address ? `${doctor.clinic.address.street}, ${doctor.clinic.address.city}, ${doctor.clinic.address.province}` : 'N/A'}
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={onClose}>Close</Button>
            </CardContent>
          </>
          )}
          </Card>
      </Box>
    </Modal>
  );
};

export default DoctorDetail;
