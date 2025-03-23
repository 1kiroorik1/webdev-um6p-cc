<template>
    <div class="job-details-view">
      <JobDetails :id="id" />
    </div>
  </template>
  
  <script>
  import JobDetails from '@/components/JobDetails.vue';
  
  export default {
    name: 'JobDetailsView',
    components: {
      JobDetails
    },
    props: {
      id: {
        type: String,
        required: true
      }
    }
  };
  </script>