<template>
    <div class="search-bar">
      <i class="fas fa-search search-icon"></i>
      <input 
        type="text" 
        placeholder="Rechercher par titre ou auteur..." 
        v-model="searchQuery"
        @input="updateSearch"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      updateSearch() {
        this.$emit('search', this.searchQuery)
      }
    }
  }
  </script>