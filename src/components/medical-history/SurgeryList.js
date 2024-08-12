import React, { useState } from 'react';
import { Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const SurgeryList = ({ petId, records, onRecordUpdate }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSurgery, setNewSurgery] = useState({ surgeryType: '', surgeryDate: '', outcome: '' });
  const { getAccessTokenSilently } = useAuth0();

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCreateDialogOpen(false);
    setNewSurgery({ surgeryType: '', surgeryDate: '', outcome: '' });
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/surgeries/${id}`, {
        headers: { Accept: 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error deleting surgery record:', error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewSurgery(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/${petId}/surgeries`, newSurgery, {
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error creating surgery record:', error);
    }
  };

  return (
    <div>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, position: 'relative' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Surgeries
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
                    <LocalHospitalIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Surgery Type:</strong> {record.surgeryType}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Surgery Date:</strong> {new Date(record.surgeryDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <DoneAllIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Outcome:</strong> {record.outcome}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Surgery Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <LocalHospitalIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Surgery Type:</strong> {selectedRecord.surgeryType}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Surgery Date:</strong> {new Date(selectedRecord.surgeryDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <DoneAllIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Outcome:</strong> {selectedRecord.outcome}</Typography>
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
        <DialogTitle>Create Surgery Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="surgeryType"
            label="Surgery Type"
            type="text"
            fullWidth
            value={newSurgery.surgeryType}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="surgeryDate"
            label="Surgery Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSurgery.surgeryDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="outcome"
            label="Outcome"
            type="text"
            fullWidth
            value={newSurgery.outcome}
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

export default SurgeryList;
