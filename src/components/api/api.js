import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const fetchPet = async (id) => {
  const response = await apiClient.get(`/pets/${id}`);
  return response.data;
};

export const deleteMedicalCondition = async (id) => {
  await apiClient.delete(`/medical/history/medicalConditions/${id}`);
};

export const deleteVaccinationRecord = async (id) => {
  await apiClient.delete(`/medical/history/vaccinations/${id}`);
};

export const deleteMedicationRecord = async (id) => {
  await apiClient.delete(`/medical/history/medications/${id}`);
};

export const deleteAllergy = async (id) => {
  await apiClient.delete(`/medical/history/allergies/${id}`);
};

export const deleteSurgery = async (id) => {
  await apiClient.delete(`/medical/history/surgeries/${id}`);
};

export const deleteCheckUp = async (id) => {
  await apiClient.delete(`/medical/history/checkUps/${id}`);
};

// Add other API methods as needed
