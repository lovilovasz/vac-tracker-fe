import React, { useState } from 'react';
import { Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, TextField, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AllergyIcon from '@mui/icons-material/BugReport';
import ReactionIcon from '@mui/icons-material/Warning';
import DateIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const AllergyList = ({ petId, records, onRecordUpdate }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAllergy, setNewAllergy] = useState({ allergen: '', reaction: '', dateIdentified: '' });
  const { getAccessTokenSilently } = useAuth0();

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCreateDialogOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/allergies/${id}`, {
        headers: { Accept: 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate('allergies'); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error deleting allergy record:', error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewAllergy(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/${petId}/allergies`, newAllergy, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         }
      });
      onRecordUpdate('allergies'); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error creating allergy record:', error);
    }
  };

  return (
    <div>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, position: 'relative' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Allergies
          </Typography>
          {records.length > 0 && (
            <Fab
              color="primary"
              onClick={handleCreateOpen}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 16,
                transform: 'translateY(-50%)',
                '&:hover': {
                  background: 'rgba(39, 200, 245, 0.8)',
                }
              }}
            >
              <AddIcon />
            </Fab>
          )}
        </CardContent>
      </Card>

      {records.length === 0 ? (
        <Card
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            cursor: 'pointer',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f3e5f5 30%, #e1bee7 90%)',
            position: 'relative'
          }}
          onClick={handleCreateOpen}
        >
          <CardContent>
            <IconButton color="primary" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <AddIcon style={{ fontSize: 48 }} />
            </IconButton>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {records.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f3e5f5 30%, #e1bee7 90%)',
                  position: 'relative'
                }}
                onClick={() => handleRecordClick(record)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AllergyIcon color="error" />
                    <Box ml={1}>
                      <Typography variant="h6" component="div">
                        <strong>Allergen:</strong> {record.allergen}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ReactionIcon color="warning" />
                    <Box ml={1}>
                      <Typography variant="body1">
                        <strong>Reaction:</strong> {record.reaction}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <DateIcon color="action" />
                    <Box ml={1}>
                      <Typography variant="body2">
                        <strong>Date Identified:</strong> {new Date(record.dateIdentified).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Allergy Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <AllergyIcon color="error" />
                <Box ml={1}>
                  <Typography variant="body1"><strong>Allergen:</strong> {selectedRecord.allergen}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <ReactionIcon color="warning" />
                <Box ml={1}>
                  <Typography variant="body1"><strong>Reaction:</strong> {selectedRecord.reaction}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <DateIcon color="action" />
                <Box ml={1}>
                  <Typography variant="body2"><strong>Date Identified:</strong> {new Date(selectedRecord.dateIdentified).toLocaleDateString()}</Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => handleDelete(selectedRecord.id)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={handleClose}>
        <DialogTitle>Create Allergy</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="allergen"
            label="Allergen"
            type="text"
            fullWidth
            value={newAllergy.allergen}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="reaction"
            label="Reaction"
            type="text"
            fullWidth
            value={newAllergy.reaction}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="dateIdentified"
            label="Date Identified"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAllergy.dateIdentified}
            onChange={handleCreateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllergyList;
