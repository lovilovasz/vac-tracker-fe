import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Fab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CreatePetDialog from './CreatePetDialog';
import { useAuth0 } from '@auth0/auth0-react';


const PetList = ({ owner }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const fetchPets = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/pets/owner/${owner}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setPets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [owner]);

  const handleDeleteClick = (event, pet) => {
    event.stopPropagation();
    setSelectedPet(pet);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPet(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/pets/${selectedPet.id}`);
      setPets(pets.filter((pet) => pet.id !== selectedPet.id));
      handleDialogClose();
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleItemClick = (petId) => {
    navigate(`/pet/${petId}`);
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handlePetCreated = () => {
    fetchPets(); // Refresh the list of pets after creating a new one
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Your Pets
        </Typography>
        <Fab color="primary"
         aria-label="add" 
         onClick={handleCreateDialogOpen}
         sx={{
          '&:hover': {
            background: 'rgba(39, 200, 245, 0.8)',
          }
        }}>
          <AddIcon />
        </Fab>
      </Box>
      <List>
        {pets.map((pet) => (
          <Box key={pet.id}>
            <div onClick={() => handleItemClick(pet.id)}>
              <ListItem button>
                <Avatar sx={{ marginRight: 2 }}>{pet.name[0]}</Avatar>
                <ListItemText
                  primary={pet.name}
                  secondary={`Species: ${pet.species} | Breed: ${pet.breed} | Age: ${new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()} years`}
                />
                <IconButton edge="end" aria-label="delete" onClick={(event) => handleDeleteClick(event, pet)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          </Box>
        ))}
      </List>

      {selectedPet && (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Delete Pet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {selectedPet.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      )}

      <CreatePetDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        owner={owner}
        onPetCreated={handlePetCreated}
      />
    </Container>
  );
};

export default PetList;
