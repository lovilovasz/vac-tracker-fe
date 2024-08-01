import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Avatar, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const PetList = ({ owner }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/pets/owner/${owner}`, {
          headers: {
            Accept: 'application/json'
          }
        });
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, [owner]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Pets
      </Typography>
      <List>
        {pets.map((pet) => (
          <Box key={pet.id}>
            <ListItem button component={Link} to={`/pet/${pet.id}`}>
              <Avatar sx={{ marginRight: 2 }}>{pet.name[0]}</Avatar>
              <ListItemText
                primary={pet.name}
                secondary={`Species: ${pet.species} | Breed: ${pet.breed} | Age: ${new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()} years`}
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Container>
  );
};

export default PetList;