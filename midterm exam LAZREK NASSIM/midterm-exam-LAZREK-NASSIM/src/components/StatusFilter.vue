<template>
    <div class="status-filter">
      <button 
        class="filter-btn" 
        :class="{ active: selectedStatus === 'all' }"
        @click="updateFilter('all')"
      >
        Tous
      </button>
      <button 
        class="filter-btn" 
        :class="{ active: selectedStatus === 'available' }"
        @click="updateFilter('available')"
      >
        Disponibles
      </button>
      <button 
        class="filter-btn" 
        :class="{ active: selectedStatus === 'borrowed' }"
        @click="updateFilter('borrowed')"
      >
        Empruntés
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatusFilter',
    data() {
      return {
        selectedStatus: 'all'
      }
    },
    methods: {
      updateFilter(status) {
        this.selectedStatus = status
        this.$emit('filter-change', status)
      }
    }
  }
  </script>