import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImportHorseDialog from './ImportHorseDialog';
import { useAuth0 } from '@auth0/auth0-react';

const CreatePetDialog = ({ open, onClose, owner, onPetCreated }) => {
  const initialPetState = {
    name: '',
    species: '', // Leave species empty initially
    breed: '',
    gender: '',
    weight: '',
    color: '',
    owner: owner,
    microchipNumber: '',
    dateOfBirth: ''
  };

  const [newPet, setNewPet] = useState(initialPetState);
  const [errors, setErrors] = useState({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPet({ ...newPet, [name]: value });
  };

  const validateFields = () => {
    const errors = {};
    if (!newPet.name) errors.name = 'Name is required';
    if (!newPet.species) errors.species = 'Species is required';
    if (!newPet.gender) errors.gender = 'Gender is required';
    if (newPet.gender && !['Male', 'Female'].includes(newPet.gender)) errors.gender = 'Gender must be either Male or Female';
    return errors;
  };

  const handleCreatePet = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/pets`, newPet, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      onPetCreated(); // Call the callback to refresh the pet list
      resetForm(); // Reset the form after creation
      onClose(); // Close the dialog
      navigate(`/pet/${response.data.id}`); // Redirect to the new pet's details page
    } catch (error) {
      console.error('Error creating pet:', error);
    }
  };

  const handleHorseSelected = (horse) => {
    const formattedDateOfBirth = horse.BirthDate ? horse.BirthDate.split('T')[0] : ''; // Format the date as yyyy-MM-dd

    setNewPet({
      ...newPet,
      name: horse.Name,
      species: 'Horse', // Set species to "Horse" when importing
      breed: horse.BreedName,
      gender: horse.Sex === 'Kanca' ? 'Female' : horse.Sex === 'Mén' ? 'Male' : '',
      color: horse.Color,
      microchipNumber: horse.Chip,
      dateOfBirth: formattedDateOfBirth,
    });

    // Close the import dialog
    setImportDialogOpen(false);
  };

  const resetForm = () => {
    setNewPet(initialPetState); // Reset state to initial values
  };

  const handleCloseDialog = () => {
    resetForm(); // Reset the form when closing the dialog
    onClose(); // Close the dialog
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Create Pet</DialogTitle>
        <DialogContent>
          <Button onClick={() => setImportDialogOpen(true)}>Import from dijugratas.hu</Button>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newPet.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="species"
            label="Species"
            type="text"
            fullWidth
            variant="standard"
            value={newPet.species}
            onChange={handleInputChange}
            error={!!errors.species}
            helperText={errors.species}
          />
          <TextField
            margin="dense"
            name="breed"
            label="Breed"
            type="text"
            fullWidth
            variant="standard"
            value={newPet.breed}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense" variant="standard" error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={newPet.gender}
              onChange={handleInputChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
          <TextField
            margin="dense"
            name="weight"
            label="Weight"
            type="number"
            fullWidth
            variant="standard"
            value={newPet.weight}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="color"
            label="Color"
            type="text"
            fullWidth
            variant="standard"
            value={newPet.color}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="microchipNumber"
            label="Microchip Number"
            type="text"
            fullWidth
            variant="standard"
            value={newPet.microchipNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            fullWidth
            variant="standard"
            value={newPet.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreatePet} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <ImportHorseDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onHorseSelected={handleHorseSelected}
      />
    </>
  );
};

export default CreatePetDialog;
