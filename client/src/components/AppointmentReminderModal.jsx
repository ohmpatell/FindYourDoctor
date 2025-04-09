import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
// import { useAuth } from '../contexts/AuthContext';

const AppointmentReminderModal = ({ open, onClose, appointments }) => {
  // const { auth } = useAuth();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reminder: You have appointment(s) tomorrow</DialogTitle>
      <DialogContent dividers>
        {appointments.map((appt) => (
          <Box key={appt._id} sx={{ mb: 2 }}>
            <Typography>
              {new Date(appt.appointmentDate).toLocaleString()}
            </Typography>
            <Typography>
              Doctor: Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
            </Typography>
            <Typography variant="body2">
              Clinic: {appt.clinic?.name}
            </Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Dismiss</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentReminderModal;