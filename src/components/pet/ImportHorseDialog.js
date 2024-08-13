import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth0 } from '@auth0/auth0-react';

const ImportHorseDialog = ({ open, onClose, onHorseSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [birthYear, setBirthYear] = useState(''); // New state for birth year
  const [loading, setLoading] = useState(false);
  const [horses, setHorses] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  // Effect to clear horses list when dialog is closed
  useEffect(() => {
    if (!open) {
      setHorses([]);
      setSearchTerm(''); // Clear search term when closing dialog
      setBirthYear(''); // Clear birth year when closing dialog
    }
  }, [open]);

  const handleSearch = async () => {
    if (!searchTerm) {
      alert('Please enter at least horse name.');
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/horseSearch`, 
        { nev: searchTerm, szuletesiEv: birthYear}
        ,{
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setHorses(response.data.horses); // Adjust according to the new response structure
      setSearchTerm(''); // Clear search term after search
      setBirthYear(''); // Clear birth year after search
    } catch (error) {
      console.error('Error fetching horse data:', error);
    }
    setLoading(false);
  };

  const handleSelectHorse = (horse) => {
    onHorseSelected(horse);
    // Clear everything in the dialog
    setHorses([]);
    setLoading(false);
    onClose(); // Close the dialog
  };

  // Format the date to a more readable format
  const formatDate = (year, month, day) => {
    if (!year || !month || !day) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import Horse</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              name="searchTerm"
              label="Horse Name"
              type="text"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              margin="dense"
              name="birthYear"
              label="Birth Year"
              type="number"
              fullWidth
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button 
              onClick={handleSearch} 
              color="primary"
              fullWidth
              variant="contained"
              style={{ marginTop: '8px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        {loading && <CircularProgress />}
        <List>
          {horses.map((horse) => (
            <ListItem button key={horse.loId} onClick={() => handleSelectHorse(horse)}>
              <ListItemText
                primary={horse.nev}
                secondary={`DOB: ${formatDate(horse.szuletesiEv, horse.szuletesiHo, horse.szuletesiNap)}, Owner: ${horse.tenyesztoNev}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportHorseDialog;
