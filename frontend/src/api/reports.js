// api/reports.js
import axios from 'axios';

const API_URL = '/api/reports';

const addReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, reportData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de l\'ajout du rapport');
  }
};

const getReports = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/task/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des rapports');
  }
};
const getReportsByTechnicien = async (technicienId) => {
    try {
      const response = await axios.get(`${API_URL}/technicien/${technicienId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des rapports');
    }
  };

export default {
  addReport,
  getReports,
  getReportsByTechnicien,
};
