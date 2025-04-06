import React, { useState, useEffect } from 'react';
import RegisterWalkIn from './RegisterWalkIn';
import SelectDoctorModal from './SelectDoctorModal';
import BookAppointment from './BookAppointment';

export default function WalkInFlow({ open, onClose, doctors, onAppointmentCreated }) {
  const [currentStep, setCurrentStep] = useState(null);
  const [newPatient, setNewPatient] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (open) {
      setCurrentStep('register');
    } else {
      setCurrentStep(null);
      setNewPatient(null);
      setSelectedDoctor(null);
      setBookingModalOpen(false);
    }
  }, [open]);

  const handleRegistrationSuccess = (patientData) => {
    setNewPatient(patientData);
    setCurrentStep('select-doctor');
  };

  const handleDoctorSelected = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(null); // Close the select doctor modal
    setBookingModalOpen(true); // Open the booking modal
  };

  const handleAppointmentCreated = () => {
    onAppointmentCreated();
    onClose();
    setBookingModalOpen(false);
  };

  const handleClose = () => {
    setCurrentStep(null);
    setNewPatient(null);
    setSelectedDoctor(null);
    setBookingModalOpen(false);
    onClose();
  };

  return (
    <>
      <RegisterWalkIn
        open={currentStep === 'register'}
        onClose={handleClose}
        onSuccess={handleRegistrationSuccess}
      />

      <SelectDoctorModal
        open={currentStep === 'select-doctor'}
        onClose={handleClose}
        patient={newPatient}
        doctors={doctors}
        onSuccess={handleAppointmentCreated}
        onDoctorSelected={handleDoctorSelected}
      />
      {selectedDoctor && (
        <BookAppointment
          open={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setCurrentStep('select-doctor'); // Return to doctor selection if needed
          }}
          doctor={selectedDoctor}
          walkInPatient={newPatient}
          onSuccess={handleAppointmentCreated}
        />
      )}
    </>
  );
}