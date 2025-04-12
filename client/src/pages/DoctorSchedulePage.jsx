// src/pages/DoctorSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  TextField,
  Alert
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import dayjs from 'dayjs';

const TIME_START = 8; // 8 AM
const TIME_END = 18;  // 6 PM

const DoctorSchedulePage = () => {
  const { auth } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);

  // Fetch appointments for the selected date & doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
        const response = await api.post('/doctors/schedule', {
          doctorId: auth.user._id,
          date: dateStr
        });

        const sorted = response.data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        if (sorted.length === 0) {
          setSnackbarMsg('No appointments found for the selected date.');
          setOpenSnackbar(true);  
        }
        setAppointments(sorted);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setSnackbarMsg('Error fetching schedule.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate, auth.user._id]);

  // Date navigation handlers
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Open detail modal for an appointment
  const handleOpenDetailModal = (appt) => {
    setSelectedAppointment(appt);
    setOpenDetailModal(true);
  };

  // Render a single time slot (1-hour interval)
  const renderTimeSlot = (hour) => {
    const timeLabel = dayjs().hour(hour).minute(0).format('h A');
    const slotAppointments = appointments.filter(appt => {
      const apptDate = new Date(appt.appointmentDate);
      return apptDate.getHours() === hour;
    });

    return (
      <Paper key={hour} sx={{ p: 1, mb: 1, backgroundColor: '#fff' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{timeLabel}</Typography>
        {slotAppointments.length === 0 ? (
          <Typography variant="caption" color="text.secondary">No appointments</Typography>
        ) : (
          slotAppointments.map(appt => (
            <Paper
              key={appt._id}
              sx={{ p: 1, mb: 1, cursor: 'pointer', backgroundColor: '#e3f2fd' }}
              onClick={() => handleOpenDetailModal(appt)}
            >
              <Typography variant="body2">
                {appt.patient?.firstName} {appt.patient?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {appt.status.toUpperCase()}
              </Typography>
            </Paper>
          ))
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Schedule for {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <IconButton onClick={handlePreviousDay} color="primary">
            <ArrowBackIosIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleToday}>Today</Button>
        </Grid>
        <Grid item>
          <IconButton onClick={handleNextDay} color="primary">
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setOpenCalendarDialog(true)} color="primary">
            <CalendarTodayIcon />
          </IconButton>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {Array.from({ length: TIME_END - TIME_START }, (_, i) => TIME_START + i)
            .map(hour => renderTimeSlot(hour))}
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          onUpdate={(updated) => {
            setAppointments(prev =>
              prev.map(appt => appt._id === updated._id ? updated : appt)
            );
          }}
        />
      )}

      {/* Calendar Dialog using react-datepicker */}
      <Dialog open={openCalendarDialog} onClose={() => setOpenCalendarDialog(false)}>
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setOpenCalendarDialog(false);
            }}
            customInput={<TextField fullWidth label="Pick a date" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalendarDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorSchedulePage;
