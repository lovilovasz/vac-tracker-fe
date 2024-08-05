import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, Divider, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import MedicalConditionList from '../medical-history/MedicalConditionList';
import VaccinationRecordList from '../medical-history/VaccinationRecordList';
import MedicationRecordList from '../medical-history/MedicationRecordList';
import AllergyList from '../medical-history/AllergyList';
import SurgeryList from '../medical-history/SurgeryList';
import CheckUpList from '../medical-history/CheckUpList';
import {
  Pets as PetsIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  ColorLens as ColorLensIcon,
  MonitorWeight as MonitorWeightIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
} from '@mui/icons-material';

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchPetDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/pets/${id}`, {
        headers: { Accept: 'application/json' }
      });
      setPet(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const handleRecordUpdate = (field) => {
    fetchPetDetails();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error fetching pet details: {error.message}
        </Typography>
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container>
        <Typography variant="h6">
          Pet not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {pet.name}'s Details
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PetsIcon sx={{ mr: 1 }} />
                <Typography variant="h6"><strong>Species:</strong> {pet.species}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ColorLensIcon sx={{ mr: 1 }} />
                <Typography variant="h6"><strong>Color:</strong> {pet.color}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MonitorWeightIcon sx={{ mr: 1 }} />
                <Typography variant="h6"><strong>Weight:</strong> {pet.weight} kg</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6"><strong>Owner:</strong> {pet.owner}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ConfirmationNumberIcon sx={{ mr: 1 }} />
                <Typography variant="h6"><strong>Microchip Number:</strong> {pet.microchipNumber}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="h6"><strong>Date of Birth:</strong> {new Date(pet.dateOfBirth).toLocaleDateString()}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="medical history tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="Medical Conditions" />
          <Tab label="Vaccinations" />
          <Tab label="Medications" />
          <Tab label="Allergies" />
          <Tab label="Surgeries" />
          <Tab label="Check-Ups" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <TabContent>
          <MedicalConditionList petId={pet.id} records={pet.medicalHistory.medicalConditions} onRecordUpdate={() => handleRecordUpdate('medicalConditions')} />
        </TabContent>
      )}
      {tabValue === 1 && (
        <TabContent>
          <VaccinationRecordList petId={pet.id} records={pet.medicalHistory.vaccinationRecords} onRecordUpdate={() => handleRecordUpdate('vaccinationRecords')} />
        </TabContent>
      )}
      {tabValue === 2 && (
        <TabContent>
          <MedicationRecordList petId={pet.id} records={pet.medicalHistory.medicationRecords} onRecordUpdate={() => handleRecordUpdate('medicationRecords')} />
        </TabContent>
      )}
      {tabValue === 3 && (
        <TabContent>
          <AllergyList petId={pet.id} records={pet.medicalHistory.allergies} onRecordUpdate={() => handleRecordUpdate('allergies')} />
        </TabContent>
      )}
      {tabValue === 4 && (
        <TabContent>
          <SurgeryList petId={pet.id} records={pet.medicalHistory.surgeries} onRecordUpdate={() => handleRecordUpdate('surgeries')} />
        </TabContent>
      )}
      {tabValue === 5 && (
        <TabContent>
          <CheckUpList petId={pet.id} records={pet.medicalHistory.checkUps} onRecordUpdate={() => handleRecordUpdate('checkUps')} />
        </TabContent>
      )}
    </Container>
  );
};

const TabContent = ({ children }) => (
  <Box sx={{ p: 2 }}>
    {children}
  </Box>
);

export default PetDetails;
