import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RegisterWalkIn from '../components/RegisterWalkIn';

export default function ClinicDashboardPage() {
  const [openWalkIn, setOpenWalkIn] = useState(false);
  
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Button 
        variant="contained" 
        onClick={() => setOpenWalkIn(true)} // Fixed: Wrapped in arrow function
      >
        Register Walk-In Patient
      </Button>
      <RegisterWalkIn 
        open={openWalkIn} 
        onClose={() => setOpenWalkIn(false)} // Added close handler
      />
    </Stack>
  );
}