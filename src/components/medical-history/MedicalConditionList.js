import React, { useState } from 'react';
import { Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, TextField, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NotesIcon from '@mui/icons-material/Notes';
import StatusIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const MedicalConditionList = ({ petId, records, onRecordUpdate }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({ conditionName: '', diagnosisDate: '', treatment: '', status: '' });
  const { getAccessTokenSilently } = useAuth0();

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCreateDialogOpen(false);
    setNewCondition({ conditionName: '', diagnosisDate: '', treatment: '', status: '' });
  };

  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/medicalConditions/${id}`, {
        headers: { Accept: 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error deleting medical condition:', error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewCondition(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/${petId}/medicalConditions`, newCondition, {
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error creating medical condition record:', error);
    }
  };

  return (
    <div>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, position: 'relative' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Medical Conditions
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
                      <strong>Condition Name:</strong> {record.conditionName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Diagnosis Date:</strong> {new Date(record.diagnosisDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <NotesIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Treatment:</strong> {record.treatment}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <StatusIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Status:</strong> {record.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Medical Condition Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <LocalHospitalIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Condition Name:</strong> {selectedRecord.conditionName}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Diagnosis Date:</strong> {new Date(selectedRecord.diagnosisDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <NotesIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Treatment:</strong> {selectedRecord.treatment}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <StatusIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Status:</strong> {selectedRecord.status}</Typography>
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
        <DialogTitle>Create Medical Condition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="conditionName"
            label="Condition Name"
            type="text"
            fullWidth
            value={newCondition.conditionName}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="diagnosisDate"
            label="Diagnosis Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newCondition.diagnosisDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="treatment"
            label="Treatment"
            type="text"
            fullWidth
            value={newCondition.treatment}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            type="text"
            fullWidth
            value={newCondition.status}
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

export default MedicalConditionList;
