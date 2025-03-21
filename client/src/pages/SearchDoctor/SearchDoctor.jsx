import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Grid, Card, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios'; // Install axios using `npm install axios`
import DoctorDetail from '../../components/DoctorDetail';

function SearchDoctorPage() {
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
        const response = await axios.get('http://localhost:5000/api/doctors'); // Replace with your backend URL
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
        doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.clinicAddress && doctor.clinicAddress.toLowerCase().includes(searchQuery.toLowerCase()))
      ) &&
      (locationFilter === '' || (doctor.clinicAddress && doctor.clinicAddress.toLowerCase().includes(locationFilter.toLowerCase()))) &&
      (specialtyFilter === '' || doctor.specialization.toLowerCase() === specialtyFilter.toLowerCase())
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

  const handleDoctorDetailClick = (doctorId) => () => {
    setDoctorId(doctorId);
    setShowDoctorDetail(true);  
  }


  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setSpecialtyFilter('');
    setFilteredDoctors(doctorsData); // reset to original list
  };
  

  return (
    <div style={{ padding: '20px', marginTop: '80px' }}>
  <form 
    onSubmit={handleSearchSubmit} 
    style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: '12px', 
      marginBottom: '30px',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <TextField
      label="Search Doctors"
      variant="outlined"
      value={searchQuery}
      onChange={handleSearchChange}
      sx={{ width: 250 }}
    />
    <FormControl sx={{ minWidth: 160, marginRight: '10px' }}>
    <InputLabel>Specialty</InputLabel>
    <Select value={specialtyFilter} onChange={handleSpecialtyFilterChange} label="Specialty">
      <MenuItem value=""><em>All</em></MenuItem>
      <MenuItem value="Radiology">Radiology</MenuItem>
      <MenuItem value="Dermatology">Dermatology</MenuItem>
      <MenuItem value="Psychiatry">Psychiatry</MenuItem>
      <MenuItem value="Pediatrics">Pediatrics</MenuItem>
      <MenuItem value="Cardiology">Cardiology</MenuItem>
      <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
      <MenuItem value="Orthopedics">Orthopedics</MenuItem>
      <MenuItem value="Neurology">Neurology</MenuItem>
    </Select>
  </FormControl>
  <FormControl sx={{ minWidth: 160, marginRight: '10px' }}>
    <InputLabel>Location</InputLabel>
    <Select value={locationFilter} onChange={handleLocationFilterChange} label="Location">
      <MenuItem value=""><em>All</em></MenuItem>
      <MenuItem value="Winnipeg">Winnipeg</MenuItem>
      <MenuItem value="Edmonton">Edmonton</MenuItem>
      <MenuItem value="Calgary">Calgary</MenuItem>
      <MenuItem value="Montreal">Montreal</MenuItem>
      <MenuItem value="Ottawa">Ottawa</MenuItem>
      <MenuItem value="Vancouver">Vancouver</MenuItem>
      <MenuItem value="Toronto">Toronto</MenuItem>
      <MenuItem value="Quebec City">Quebec City</MenuItem>
      <MenuItem value="Halifax">Halifax</MenuItem>
      <MenuItem value="Victoria">Victoria</MenuItem>
    </Select>
  </FormControl>

    <FormControl sx={{ minWidth: 160 }}>
      <InputLabel>Sort By</InputLabel>
      <Select value={sortCriterion} onChange={handleSortChange} label="Sort By">
        <MenuItem value="name">Name (A-Z)</MenuItem>
        <MenuItem value="availability">Availability</MenuItem>
      </Select>
    </FormControl>
    <IconButton type="submit" color="primary" sx={{ bgcolor: '#1976d2', color: '#fff', '&:hover': { bgcolor: '#1565c0' } }}>
      <SearchIcon />
    </IconButton>
    <Button 
      variant="outlined" 
      color="primary" 
      onClick={handleClearFilters}
      style={{ marginLeft: '10px' }}
    >
      Clear Filters
    </Button>

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
        {showDoctorDetail && (
  <DoctorDetail doctorId={doctorId} onClose={() => setShowDoctorDetail(false)} />
)}
    </div>
  );
}

export default SearchDoctorPage;