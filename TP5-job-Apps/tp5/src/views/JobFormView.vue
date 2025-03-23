<template>
    <div class="job-form-view">
      <JobForm :id="id" />
    </div>
  </template>
  
  <script>
  import JobForm from '@/components/JobForm.vue';
  
  export default {
    name: 'JobFormView',
    components: {
      JobForm
    },
    props: {
      id: {
        type: String,
        required: false,
        default: null
      }
    }
  };
  </script>