import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Get all jobs
  getJobs() {
    return apiClient.get('/jobs');
  },
  
  // Get a specific job by ID
  getJob(id) {
    return apiClient.get(`/jobs/${id}`);
  },
  
  // Create a new job
  createJob(job) {
    return apiClient.post('/jobs', job);
  },
  
  // Update an existing job
  updateJob(job) {
    return apiClient.patch(`/jobs/${job.id}`, job);
  },
  
  // Delete a job
  deleteJob(id) {
    return apiClient.delete(`/jobs/${id}`);
  }
};