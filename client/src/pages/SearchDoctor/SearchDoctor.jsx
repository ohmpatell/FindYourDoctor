import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Grid, Card, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios'; // Install axios using `npm install axios`
import DoctorDetail from '../../components/DoctorDetail';

function DoctorSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsData, setDoctorsData] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [sortCriterion, setSortCriterion] = useState('name');

  const [doctorId, setDoctorId] = useState('');
  const [showDoctorDetail, setShowDoctorDetail] = useState(false);

  // Fetch doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors/doctors'); // Replace with your backend URL
        setDoctorsData(response.data);
        setFilteredDoctors(response.data); // Initialize filteredDoctors with all doctors
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    filterDoctors();
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
      (doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.clinic && doctor.clinic.location.toLowerCase().includes(searchQuery.toLowerCase()))
    ))
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

  const handleDoctorDetailClick = (doctorId) => () => {
    setDoctorId(doctorId);
    showDoctorDetail(true);
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search Doctors"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginRight: '10px' }}
        />
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Location</InputLabel>
          <Select value={locationFilter} onChange={handleLocationFilterChange} label="Location">
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Toronto, ON">Toronto, ON</MenuItem>
            <MenuItem value="Mississauga, ON">Mississauga, ON</MenuItem>
            <MenuItem value="Brampton, ON">Brampton, ON</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Specialty</InputLabel>
          <Select value={specialtyFilter} onChange={handleSpecialtyFilterChange} label="Specialty">
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Cardiology">Cardiology</MenuItem>
            <MenuItem value="Dermatology">Dermatology</MenuItem>
            <MenuItem value="Pediatrics">Pediatrics</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortCriterion} onChange={handleSortChange} label="Sort By">
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="availability">Availability</MenuItem>
          </Select>
        </FormControl>
        <IconButton type="submit" color="primary">
          <SearchIcon />
        </IconButton>
      </form>
      <Grid container spacing={2}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <Card>
              <CardContent>
                <img src={doctor.profileImage || 'https://via.placeholder.com/150'} alt={doctor.firstName} style={{ width: '100%', height: 'auto' }} />
                <Typography variant="h6">{`${doctor.firstName} ${doctor.lastName}`}</Typography>
                <Typography variant="body2" color="textSecondary">{doctor.specialization}</Typography>
                <Typography variant="body2" color="textSecondary">{doctor.clinic?.location || 'Location not available'}</Typography>
                <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={handleDoctorDetailClick(doctor._id)}>View Information</Button>
                <Button variant="outlined" color="primary" style={{ marginTop: '10px', marginLeft: '10px' }}>Request Appointment</Button>
                <IconButton color="primary" style={{ marginTop: '10px' }}>
                  <LocationOnIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

        {/* To be created */}
      <DoctorDetail doctorId={doctorId} />
    </div>
  );
}

export default DoctorSearchPage;