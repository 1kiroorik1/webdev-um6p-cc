<template>
    <div class="jobs-list">
      <div class="list-header">
        <h2>Liste des emplois disponibles</h2>
        <router-link to="/job/add" class="btn">Ajouter un emploi</router-link>
      </div>
      <div v-if="loading" class="loading">
        Chargement des emplois...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else-if="jobs.length === 0" class="no-jobs">
        Aucun emploi disponible actuellement.
      </div>
      <div v-else class="jobs-container">
        <div v-for="job in jobs" :key="job.id" class="job-card container">
          <h3>{{ job.title }}</h3>
          <p class="job-description">{{ job.description }}</p>
          <div class="job-details">
            <p><strong>Salaire:</strong> {{ formatCurrency(job.salary) }}</p>
            <p><strong>Expérience requise:</strong> {{ job.experienceYears }} ans</p>
            <p><strong>Date de création:</strong> {{ formatDate(job.createdAt) }}</p>
          </div>
          <div class="job-actions">
            <router-link :to="{ name: 'job-details', params: { id: job.id } }" class="btn">
              Voir les détails
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import JobService from '@/services/JobService';
  
  export default {
    name: 'JobsList',
    data() {
      return {
        jobs: [],
        loading: true,
        error: null
      };
    },
    created() {
      this.fetchJobs();
    },
    methods: {
      fetchJobs() {
        this.loading = true;
        this.error = null;
        
        JobService.getJobs()
          .then(response => {
            this.jobs = response.data;
            this.loading = false;
          })
          .catch(error => {
            this.error = 'Erreur lors du chargement des emplois: ' + error.message;
            this.loading = false;
            console.error('Error fetching jobs:', error);
          });
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
      },
      formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR');
      }
    }
  };
  </script>
  
  <style scoped>
  .jobs-list {
    width: 100%;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .jobs-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .job-card {
    display: flex;
    flex-direction: column;
  }
  
  .job-description {
    margin: 10px 0;
    color: #666;
  }
  
  .job-details {
    margin: 10px 0;
    flex-grow: 1;
  }
  
  .job-details p {
    margin-bottom: 5px;
  }
  
  .job-actions {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
  
  .loading, .error, .no-jobs {
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .error {
    color: #e74c3c;
  }
  </style>