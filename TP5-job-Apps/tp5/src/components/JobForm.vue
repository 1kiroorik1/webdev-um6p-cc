<template>
    <div class="job-form container">
      <h2>{{ isEditing ? 'Modifier un emploi' : 'Ajouter un nouvel emploi' }}</h2>
      <div v-if="loading" class="loading">
        Chargement des données...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <form v-else @submit.prevent="submitForm">
        <div class="form-control">
          <label for="title">Titre</label>
          <input 
            type="text" 
            id="title"
            v-model="jobForm.title"
            required
            placeholder="Titre de l'emploi"
          >
        </div>
        
        <div class="form-control">
          <label for="description">Description</label>
          <textarea 
            id="description"
            v-model="jobForm.description"
            rows="5"
            required
            placeholder="Description détaillée de l'emploi"
          ></textarea>
        </div>
        
        <div class="form-control">
          <label for="salary">Salaire (€)</label>
          <input 
            type="number" 
            id="salary"
            v-model.number="jobForm.salary"
            required
            min="0"
            step="1000"
            placeholder="Salaire annuel"
          >
        </div>
        
        <div class="form-control">
          <label for="experienceYears">Années d'expérience requises</label>
          <input 
            type="number" 
            id="experienceYears"
            v-model.number="jobForm.experienceYears"
            required
            min="0"
            step="1"
            placeholder="Années d'expérience"
          >
        </div>
        
        <div class="form-control">
          <label for="createdAt">Date de création</label>
          <input 
            type="date" 
            id="createdAt"
            v-model="jobForm.createdAt"
            required
          >
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn">{{ isEditing ? 'Mettre à jour' : 'Ajouter' }}</button>
          <router-link to="/" class="btn secondary">Annuler</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import JobService from '@/services/JobService';
  
  export default {
    name: 'JobForm',
    props: {
      id: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        jobForm: {
          title: '',
          description: '',
          salary: 0,
          experienceYears: 0,
          createdAt: new Date().toISOString().substr(0, 10)
        },
        loading: false,
        error: null
      };
    },
    computed: {
      isEditing() {
        return !!this.id;
      }
    },
    created() {
      if (this.isEditing) {
        this.fetchJob();
      }
    },
    methods: {
      fetchJob() {
        this.loading = true;
        this.error = null;
        
        JobService.getJob(this.id)
          .then(response => {
            const job = response.data;
            this.jobForm = {
              ...job,
              createdAt: new Date(job.createdAt).toISOString().substr(0, 10)
            };
            this.loading = false;
          })
          .catch(error => {
            this.error = 'Erreur lors du chargement de l\'emploi: ' + error.message;
            this.loading = false;
            console.error('Error fetching job:', error);
          });
      },
      submitForm() {
        this.loading = true;
        this.error = null;
        
        const jobData = {
          ...this.jobForm
        };
        
        const request = this.isEditing
          ? JobService.updateJob({ ...jobData, id: parseInt(this.id) })
          : JobService.createJob(jobData);
          
        request
          .then(() => {
            this.$router.push({ name: 'home' });
          })
          .catch(error => {
            this.error = `Erreur lors de ${this.isEditing ? 'la mise à jour' : 'l\'ajout'} de l'emploi: ` + error.message;
            this.loading = false;
            console.error('Error submitting job:', error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .job-form {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-control {
    margin-bottom: 20px;
  }
  
  .form-control label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-control input,
  .form-control textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .loading, .error {
    text-align: center;
    padding: 20px;
  }
  
  .error {
    color: #e74c3c;
  }
  </style>