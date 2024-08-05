import React, { useState } from 'react';
import { Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const VaccinationRecordList = ({ petId, records, onRecordUpdate }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newVaccination, setNewVaccination] = useState({
    vaccineName: '',
    vaccinationDate: '',
    expirationDate: '',
    administeredBy: ''
  });

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCreateDialogOpen(false);
    setNewVaccination({
      vaccineName: '',
      vaccinationDate: '',
      expirationDate: '',
      administeredBy: ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/vaccinationRecords/${id}`, {
        headers: { Accept: 'application/json' }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error deleting vaccination record:', error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewVaccination(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/medical/history/${petId}/vaccinationRecords`, newVaccination, {
        headers: { 'Content-Type': 'application/json' }
      });
      onRecordUpdate(); // Notify parent to update the record list
      handleClose();
    } catch (error) {
      console.error('Error creating vaccination record:', error);
    }
  };

  return (
    <div>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, position: 'relative' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Vaccination Records
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
                    <VaccinesIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Vaccine Name:</strong> {record.vaccineName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Vaccination Date:</strong> {new Date(record.vaccinationDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <DateRangeIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Expiration Date:</strong> {new Date(record.expirationDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Administered By:</strong> {record.administeredBy}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Vaccination Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <VaccinesIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Vaccine Name:</strong> {selectedRecord.vaccineName}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarTodayIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Vaccination Date:</strong> {new Date(selectedRecord.vaccinationDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <DateRangeIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Expiration Date:</strong> {new Date(selectedRecord.expirationDate).toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="body2"><strong>Administered By:</strong> {selectedRecord.administeredBy}</Typography>
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
        <DialogTitle>Create Vaccination Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="vaccineName"
            label="Vaccine Name"
            type="text"
            fullWidth
            value={newVaccination.vaccineName}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="vaccinationDate"
            label="Vaccination Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newVaccination.vaccinationDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="expirationDate"
            label="Expiration Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newVaccination.expirationDate}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="administeredBy"
            label="Administered By"
            type="text"
            fullWidth
            value={newVaccination.administeredBy}
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

export default VaccinationRecordList;
