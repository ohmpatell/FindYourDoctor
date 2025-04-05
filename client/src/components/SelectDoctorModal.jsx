import {React, useState} from 'react';
import {
  Modal, Box, Typography, Button, List, ListItem, ListItemText, Divider
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};



export default function SelectDoctorModal({ open, onClose, patient, doctors, onDoctorSelected }) {
  const [loading, setLoading] = useState(false);  
  const handleSelectDoctor = async (doctor) => {
		onDoctorSelected(doctor);
	};

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="select-doctor-title"
    >
      <Box sx={style}>
        <Typography id="select-doctor-title" variant="h6" gutterBottom>
          Select a Doctor for {patient?.firstName} {patient?.lastName}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List>
          {doctors.map((doctor) => (
            <ListItem 
              key={doctor._id} 
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              divider
            >
              <ListItemText 
                primary={`Dr. ${doctor.firstName} ${doctor.lastName}`} 
                secondary={doctor.specialization}
              />
              <Button 
								variant="contained" 
								onClick={() => handleSelectDoctor(doctor)}
								disabled={loading}
							>
								{loading ? 'Assigning...' : 'Assign'}
							</Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
