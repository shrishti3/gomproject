import axios from 'axios';
import { API_ENDPOINTS } from './api';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitInquiry = async (inquiryData) => {
  try {
    const response = await axiosInstance.post('/api/inquiry', inquiryData);
    return response.data;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
};

export const getInquiries = async () => {
  try {
    const response = await axiosInstance.get('/api/inquiries');
    return response.data;
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const response = await axiosInstance.get('/api/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axiosInstance.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default axiosInstance;
