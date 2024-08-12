import React, { useState } from 'react';
import { Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicationIcon from '@mui/icons-material/Medication';
import DosageIcon from '@mui/icons-material/LocalPharmacy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const MedicationRecordList = ({ petId, records, onRecordUpdate }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({ medicationName: '', dosage: '', startDate: '', endDate: '', instructions: '' });
  const { getAccessTokenSilently } = useAuth0();

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCreateDialogOpen(false);
    setNewMedication({ medicationName: '', dosage: '', startDate: '', endDate: '', instructions: '' });
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/medications/${id}`, {
        headers: { Accept: 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error deleting medication record:', error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/${petId}/medications`, newMedication, {
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error creating medication record:', error);
    }
  };

  return (
    <div>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, position: 'relative' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
            Medication Records
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
                    <MedicationIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Medication Name:</strong> {record.medicationName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <DosageIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Dosage:</strong> {record.dosage}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Start Date:</strong> {new Date(record.startDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>End Date:</strong> {new Date(record.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <NotesIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Instructions:</strong> {record.instructions}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Medication Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <MedicationIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Medication Name:</strong> {selectedRecord.medicationName}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <DosageIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Dosage:</strong> {selectedRecord.dosage}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Start Date:</strong> {new Date(selectedRecord.startDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>End Date:</strong> {new Date(selectedRecord.endDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <NotesIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Instructions:</strong> {selectedRecord.instructions}</Typography>
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
        <DialogTitle>Create Medication Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="medicationName"
            label="Medication Name"
            type="text"
            fullWidth
            value={newMedication.medicationName}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="dosage"
            label="Dosage"
            type="text"
            fullWidth
            value={newMedication.dosage}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newMedication.startDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newMedication.endDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="instructions"
            label="Instructions"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newMedication.instructions}
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

export default MedicationRecordList;
