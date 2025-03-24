<template>
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="book-detail" v-if="book">
          <div class="book-detail-header">
            <h2 class="book-detail-title">{{ book.titre }}</h2>
            <p class="book-detail-author">{{ book.auteur }}</p>
          </div>
          
          <div class="book-detail-body">
            <div class="book-detail-img">
              <img :src="book.image" :alt="book.titre">
            </div>
            
            <div class="book-detail-info">
              <div class="book-detail-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar-alt"></i> {{ book.annee }}
                </div>
                <div class="meta-item">
                  <i class="fas fa-bookmark"></i> {{ book.categorie }}
                </div>
              </div>
              
              <div 
                class="book-detail-status" 
                :class="book.disponible ? 'available' : 'borrowed'"
              >
                <i :class="book.disponible ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ book.disponible ? 'Disponible' : 'Emprunté' }}
              </div>
              
              <div class="book-detail-resume">
                <h3>Résumé</h3>
                <p>{{ book.resume }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BookDetail',
    props: {
      book: {
        type: Object,
        required: true
      }
    },
    methods: {
      closeModal() {
        this.$emit('close')
      }
    }
  }
  </script>