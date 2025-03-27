import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ManageAppointmentsPage() {
  const { doctorId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/clinic/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleNoteChange = (id, note) => {
    setNoteMap((prev) => ({ ...prev, [id]: note }));
  };

  const saveNote = (id) => {
    console.log(`Saved note for ${id}:`, noteMap[id]);
    // Optional: make API call to save note to DB
  };

  const filteredAppointments =
    statusFilter === 'All'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

      app.get('/clinic/appointments/doctor/:doctorId', (req, res) => {
        const { doctorId } = req.params;
      
        const allAppointments = [
          { _id: '1', doctorId: '1', patientName: 'John Doe', reason: 'Fever', date: '2025-03-24', time: '10:30 AM', status: 'Confirmed' },
          { _id: '2', doctorId: '1', patientName: 'Jane Smith', reason: 'Back Pain', date: '2025-03-24', time: '11:30 AM', status: 'Pending' },
          { _id: '3', doctorId: '2', patientName: 'Alice Brown', reason: 'Skin Rash', date: '2025-03-24', time: '01:00 PM', status: 'Cancelled' }
        ];
      
        const filtered = allAppointments.filter(a => a.doctorId === doctorId);
        res.json(filtered);
      });
      

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Manage Appointments
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={statusFilter}
          label="Status Filter"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      {filteredAppointments.length > 0 ? (
        <Grid container spacing={2}>
          {filteredAppointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {appointment.patientName} - {appointment.reason || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.date} at {appointment.time}
                  </Typography>
                  <Chip
                    label={appointment.status}
                    color={
                      appointment.status === 'Confirmed'
                        ? 'success'
                        : appointment.status === 'Pending'
                        ? 'warning'
                        : 'error'
                    }
                    sx={{ mt: 1 }}
                  />

                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Add Note"
                      fullWidth
                      multiline
                      maxRows={4}
                      value={noteMap[appointment._id] || ''}
                      onChange={(e) => handleNoteChange(appointment._id, e.target.value)}
                    />
                    <Button
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() => saveNote(appointment._id)}
                    >
                      Save Note
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No appointments found for this doctor.</Typography>
      )}
    </Container>
  );
}
