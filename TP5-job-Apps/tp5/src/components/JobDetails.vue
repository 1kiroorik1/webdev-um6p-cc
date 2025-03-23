<template>
    <div class="job-details container">
      <div v-if="loading" class="loading">
        Chargement des détails de l'emploi...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else-if="job">
        <h2>{{ job.title }}</h2>
        <div class="job-info">
          <p class="job-description">{{ job.description }}</p>
          <div class="job-meta">
            <p><strong>Salaire:</strong> {{ formatCurrency(job.salary) }}</p>
            <p><strong>Expérience requise:</strong> {{ job.experienceYears }} ans</p>
            <p><strong>Date de création:</strong> {{ formatDate(job.createdAt) }}</p>
          </div>
        </div>
        <div class="actions">
          <router-link :to="{ name: 'job-edit', params: { id: job.id } }" class="btn">
            Modifier
          </router-link>
          <button @click="showDeleteConfirmation = true" class="btn delete">
            Supprimer
          </button>
          <router-link to="/" class="btn secondary">
            Retour
          </router-link>
        </div>
        
        <delete-confirmation 
          v-if="showDeleteConfirmation"
          :item-name="job.title"
          @confirm="deleteJob"
          @cancel="showDeleteConfirmation = false"
        />
      </div>
      <div v-else class="not-found">
        L'emploi demandé n'existe pas.
      </div>
    </div>
  </template>
  
  <script>
  import JobService from '@/services/JobService';
  import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
  
  export default {
    name: 'JobDetails',
    components: {
      DeleteConfirmation
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        job: null,
        loading: true,
        error: null,
        showDeleteConfirmation: false
      };
    },
    created() {
      this.fetchJob();
    },
    methods: {
      fetchJob() {
        this.loading = true;
        this.error = null;
        
        JobService.getJob(this.id)
          .then(response => {
            this.job = response.data;
            this.loading = false;
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              this.error = "L'emploi demandé n'existe pas.";
            } else {
              this.error = 'Erreur lors du chargement des détails: ' + error.message;
            }
            this.loading = false;
            console.error('Error fetching job:', error);
          });
      },
      deleteJob() {
        JobService.deleteJob(this.id)
          .then(() => {
            this.$router.push({ name: 'home' });
          })
          .catch(error => {
            this.error = 'Erreur lors de la suppression: ' + error.message;
            console.error('Error deleting job:', error);
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
  .job-details {
    padding: 20px;
  }
  
  .job-info {
    margin: 20px 0;
  }
  
  .job-description {
    margin-bottom: 20px;
    line-height: 1.8;
  }
  
  .job-meta {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
  }
  
  .job-meta p {
    margin-bottom: 10px;
  }
  
  .actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
  
  .loading, .error, .not-found {
    text-align: center;
    padding: 20px;
  }
  
  .error {
    color: #e74c3c;
  }
  </style>