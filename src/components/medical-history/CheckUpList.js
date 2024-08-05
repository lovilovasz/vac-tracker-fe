import React, { useState } from 'react';
import { Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, TextField, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import NoteIcon from '@mui/icons-material/Note';
import axios from 'axios';

const CheckUpList = ({ petId, records, onRecordUpdate }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCheckUp, setNewCheckUp] = useState({ visitDate: '', veterinarian: '', notes: '' });

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCreateDialogOpen(false);
    setNewCheckUp({ visitDate: '', veterinarian: '', notes: '' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/checkUps/${id}`, {
        headers: { Accept: 'application/json' }
      });
      onRecordUpdate('checkUps'); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error deleting check-up record:', error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewCheckUp(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/${petId}/checkUps`, newCheckUp, {
        headers: { 'Content-Type': 'application/json' }
      });
      onRecordUpdate('checkUps'); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error creating check-up record:', error);
    }
  };

  return (
    <div>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, position: 'relative' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <Typography variant="h6" gutterBottom>
            Check-Ups
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
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" component="div">
                      <strong>Visit Date:</strong> {new Date(record.visitDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Veterinarian:</strong> {record.veterinarian}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <NoteIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Notes:</strong> {record.notes}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Check-Up Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body1"><strong>Visit Date:</strong> {new Date(selectedRecord.visitDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="body1"><strong>Veterinarian:</strong> {selectedRecord.veterinarian}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <NoteIcon sx={{ mr: 1 }} />
                <Typography variant="body1"><strong>Notes:</strong> {selectedRecord.notes}</Typography>
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
        <DialogTitle>Create Check-Up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="visitDate"
            label="Visit Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newCheckUp.visitDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="veterinarian"
            label="Veterinarian"
            type="text"
            fullWidth
            value={newCheckUp.veterinarian}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newCheckUp.notes}
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

export default CheckUpList;
