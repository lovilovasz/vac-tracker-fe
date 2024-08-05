import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns'; // For date formatting

const ImportHorseDialog = ({ open, onClose, onHorseSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [horses, setHorses] = useState([]);

  // Effect to clear horses list when dialog is closed
  useEffect(() => {
    if (!open) {
      setHorses([]);
      setSearchTerm(''); // Clear search term when closing dialog
    }
  }, [open]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/horseSearch/${searchTerm}`);
      setHorses(response.data.rows);
      setSearchTerm(''); // Clear search term after search
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
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd'); // Adjust format as needed
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import Horse</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
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
            <Button 
              onClick={handleSearch} 
              color="primary"
              fullWidth
              variant="contained"
              style={{ marginTop: '8px' }} // Adjust the margin to align with the TextField
            >
              Search
            </Button>
          </Grid>
        </Grid>
        {loading && <CircularProgress />}
        <List>
          {horses.map((horse) => (
            <ListItem button key={horse.Id} onClick={() => handleSelectHorse(horse)}>
              <ListItemText
                primary={horse.Name}
                secondary={`DOB: ${formatDate(horse.BirthDate)}, Owner: ${horse.Owner}`}
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
