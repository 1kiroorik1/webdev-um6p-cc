<template>
    <div class="container">
      <div class="controls">
        <SearchBar @search="handleSearch" />
        <StatusFilter @filter-change="handleFilterChange" />
      </div>
  
      <div v-if="filteredBooks.length > 0" class="books-grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :book="book"
          @click="showBookDetail(book)"
        />
      </div>
      
      <div v-else class="empty-state">
        <i class="fas fa-book"></i>
        <h2>Aucun livre trouvé</h2>
        <p>Essayez d'ajuster vos critères de recherche ou de filtrage pour trouver ce que vous cherchez.</p>
      </div>
  
      <BookDetail 
        v-if="selectedBook" 
        :book="selectedBook" 
        @close="closeBookDetail"
      />
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import SearchBar from '@/components/SearchBar.vue'
  import StatusFilter from '@/components/StatusFilter.vue'
  import BookCard from '@/components/BookCard.vue'
  import BookDetail from '@/components/BookDetail.vue'
  
  export default {
    name: 'Library',
    components: {
      SearchBar,
      StatusFilter,
      BookCard,
      BookDetail
    },
    data() {
      return {
        books: [],
        filteredBooks: [],
        searchQuery: '',
        statusFilter: 'all',
        selectedBook: null,
        loading: false,
        error: null
      }
    },
    created() {
      this.fetchBooks()
    },
    methods: {
      async fetchBooks() {
        this.loading = true
        try {
          const response = await axios.get('http://localhost:3000/livres')
          this.books = response.data
          this.applyFilters()
          this.loading = false
        } catch (error) {
          console.error('Erreur lors du chargement des livres:', error)
          this.error = 'Impossible de charger les livres. Veuillez réessayer plus tard.'
          this.loading = false
        }
      },
      handleSearch(query) {
        this.searchQuery = query
        this.applyFilters()
      },
      handleFilterChange(status) {
        this.statusFilter = status
        this.applyFilters()
      },
      applyFilters() {
        let filtered = [...this.books]
        
        // Appliquer le filtre de recherche
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          filtered = filtered.filter(book => {
            return (
              book.titre.toLowerCase().includes(query) ||
              book.auteur.toLowerCase().includes(query)
            )
          })
        }
        
        // Appliquer le filtre de statut
        if (this.statusFilter !== 'all') {
          const isAvailable = this.statusFilter === 'available'
          filtered = filtered.filter(book => book.disponible === isAvailable)
        }
        
        this.filteredBooks = filtered
      },
      showBookDetail(book) {
        this.selectedBook = book
        document.body.style.overflow = 'hidden'
      },
      closeBookDetail() {
        this.selectedBook = null
        document.body.style.overflow = 'auto'
      }
    }
  }
  </script>