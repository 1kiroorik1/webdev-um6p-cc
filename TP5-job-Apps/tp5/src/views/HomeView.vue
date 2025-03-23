<template>
  <div class="home">
    <JobsList />
  </div>
</template>

<script>
import JobsList from '@/components/JobsList.vue';

export default {
  name: 'HomeView',
  components: {
    JobsList
  }
};
</script>