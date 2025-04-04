// src/pages/Auth/DoctorSearchPage.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DoctorDetail from '../../components/DoctorDetail';
import BookAppointment from '../../components/BookAppointment';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


function SearchDoctorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsData, setDoctorsData] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [sortCriterion, setSortCriterion] = useState('name');

  const { auth } = useAuth();

  const navigate = useNavigate();
  

  // For DoctorDetail modal
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [openDoctorDetail, setOpenDoctorDetail] = useState(false);

  // For Appointment modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openAppointment, setOpenAppointment] = useState(false);

  // Fetch doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors/'); // Replace with your backend URL
        // console.log(response.data);
        setDoctorsData(response.data);
        setFilteredDoctors(response.data); // Initialize filteredDoctors with all doctors
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const [provinces, setProvinces] = useState([]);
  useEffect(() => {
    const fetchProvinces = async() => {
      try{
        const response = await api.get('/clinics/provinces');
        setProvinces(response.data);
        // console.log(response.data);
      }
      catch(error){
        console.error('Error:',error);
      }
    };
    fetchProvinces();
  },[]);

  const [specializations, setSpecializations] = useState([]);
  useEffect(() => {
    const fetchSpecializations = async() =>{
      try{
        const response = await api.get('/doctors/specializations');
        setSpecializations(response.data);
        // console.log(specializations);
      }
      catch(error){
        console.error('Error:',error);
      }
    };
    fetchSpecializations();
  },[]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    filterDoctors(searchQuery, locationFilter, specialtyFilter);
  };

  const handleLocationFilterChange = (event) => {
    setLocationFilter(event.target.value);
    filterDoctors();
  };

  const handleSpecialtyFilterChange = (event) => {
    setSpecialtyFilter(event.target.value);
    filterDoctors();
  };

  const handleSortChange = (event) => {
    setSortCriterion(event.target.value);
    sortDoctors(event.target.value);
  };

  const filterDoctors = () => {
    const filtered = doctorsData.filter((doctor) =>
      (
        doctor.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) // Check full name
      ) && 
      (specialtyFilter === '' || doctor.specialization === specialtyFilter) && ((locationFilter === '' || (doctor.clinic.address.city.toLowerCase() === locationFilter.toLowerCase())))
    );
    setFilteredDoctors(filtered);
  };

  const sortDoctors = (criterion) => {
    const sorted = [...filteredDoctors].sort((a, b) => {
      if (criterion === 'name') {
        return a.firstName.localeCompare(b.firstName);
      } else if (criterion === 'availability') {
        // Add logic for sorting by availability if needed
        return 0;
      }
      return 0;
    });
    setFilteredDoctors(sorted);
  };

  // Open Doctor Detail Modal
  const handleDoctorDetailClick = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setOpenDoctorDetail(true);
  };

  // Open Appointment Modal for the selected doctor
  const handleRequestAppointment = (doctor) => {
    if(!auth.isAuthenticated || auth.user.role !== 'USER') {
      navigate('/login');
      return;
    }

    setSelectedDoctor(doctor);
    setOpenAppointment(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <TextField
          label="Search Doctors"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginRight: '10px' }}
        />
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={locationFilter}
            onChange={handleLocationFilterChange}
            label="Location"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {[...provinces].sort().map((province) => (
              <MenuItem key={province} value={province}>{province}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            value={specialtyFilter}
            onChange={handleSpecialtyFilterChange}
            label="Specialty"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {[...specializations].sort().map((specialization) => (
              <MenuItem key={specialization} value={specialization}>{specialization}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortCriterion}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="availability">Availability</MenuItem>
          </Select>
        </FormControl>
        <IconButton type="submit" color="primary">
          <SearchIcon />
        </IconButton>
      </form>

      {/* Search Results Section */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
  <Grid container spacing={2}>
    {filteredDoctors.length > 0 ? (
      filteredDoctors.map((doctor) => (
        <Grid item xs={12} sm={6} md={4} key={doctor._id}>
          <Card>
            <CardContent>
              <img
                src={doctor.profileImage || 'https://via.placeholder.com/150'}
                alt={doctor.firstName}
                style={{ width: '100%', height: 'auto' }}
              />
              <Typography variant="h6">{`${doctor.firstName} ${doctor.lastName}`}</Typography>
              <Typography variant="body2" color="textSecondary">
                {doctor.specialization}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDoctorDetailClick(doctor._id)}
                >
                  View Information
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRequestAppointment(doctor)}
                >
                  Request Appointment
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))
    ) : (
      <Typography variant="h6" color="textSecondary" align="center" style={{ width: '100%', padding: '20px' }}>
        No doctors found. Please refine your search.
      </Typography>
    )}
  </Grid>
</Paper>

      {/* Doctor Detail Modal */}
      {openDoctorDetail && (
        <DoctorDetail
          doctorId={selectedDoctorId}
          open={openDoctorDetail}
          onClose={() => setOpenDoctorDetail(false)}
        />
      )}

      {/* Appointment Modal */}
      {openAppointment && selectedDoctor && (
        <BookAppointment
          open={openAppointment}
          doctor={selectedDoctor}
          onClose={() => setOpenAppointment(false)}
        />
      )}
    </div>
  );
}

export default SearchDoctorPage;
