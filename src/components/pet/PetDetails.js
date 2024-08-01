import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/pets/${id}`, {
          headers: {
            Accept: 'application/json'
          }
        });
        setPet(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pet) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Pet not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {pet.name}
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Species" secondary={pet.species} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Breed" secondary={pet.breed} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Gender" secondary={pet.gender} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Weight" secondary={`${pet.weight} kg`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Color" secondary={pet.color} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Microchip Number" secondary={pet.microchipNumber} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Date of Birth" secondary={new Date(pet.dateOfBirth).toLocaleDateString()} />
        </ListItem>
      </List>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h5" gutterBottom>
        Medical History
      </Typography>

      <Typography variant="h6" gutterBottom>
        Medical Conditions
      </Typography>
      <List>
        {pet.medicalHistory.medicalConditions.map((condition) => (
          <ListItem key={condition.id}>
            <ListItemText
              primary={condition.conditionName}
              secondary={`Diagnosis Date: ${new Date(condition.diagnosisDate).toLocaleDateString()} | Treatment: ${condition.treatment} | Status: ${condition.status}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Vaccination Records
      </Typography>
      <List>
        {pet.medicalHistory.vaccinationRecords.map((record) => (
          <ListItem key={record.id}>
            <ListItemText
              primary={record.vaccineName}
              secondary={`Vaccination Date: ${new Date(record.vaccinationDate).toLocaleDateString()} | Expiration Date: ${new Date(record.expirationDate).toLocaleDateString()} | Administered By: ${record.administeredBy}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Medication Records
      </Typography>
      <List>
        {pet.medicalHistory.medicationRecords.map((record) => (
          <ListItem key={record.id}>
            <ListItemText
              primary={record.medicationName}
              secondary={`Dosage: ${record.dosage} | Start Date: ${new Date(record.startDate).toLocaleDateString()} | End Date: ${new Date(record.endDate).toLocaleDateString()} | Instructions: ${record.instructions}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Allergies
      </Typography>
      <List>
        {pet.medicalHistory.allergies.map((allergy) => (
          <ListItem key={allergy.id}>
            <ListItemText
              primary={allergy.allergen}
              secondary={`Reaction: ${allergy.reaction} | Date Identified: ${new Date(allergy.dateIdentified).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Surgeries
      </Typography>
      <List>
        {pet.medicalHistory.surgeries.map((surgery) => (
          <ListItem key={surgery.id}>
            <ListItemText
              primary={surgery.surgeryType}
              secondary={`Surgery Date: ${new Date(surgery.surgeryDate).toLocaleDateString()} | Outcome: ${surgery.outcome}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom>
        Check-Ups
      </Typography>
      <List>
        {pet.medicalHistory.checkUps.map((checkUp) => (
          <ListItem key={checkUp.id}>
            <ListItemText
              primary={`Visit Date: ${new Date(checkUp.visitDate).toLocaleDateString()}`}
              secondary={`Veterinarian: ${checkUp.veterinarian} | Notes: ${checkUp.notes}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PetDetails;
