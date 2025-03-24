<template>
    <div class="book-card" @click="$emit('click', book)">
      <div class="book-img-container">
        <img :src="book.image" :alt="book.titre" class="book-img">
        <div 
          class="book-status" 
          :class="book.disponible ? 'available' : 'borrowed'"
        >
          {{ book.disponible ? 'Disponible' : 'Emprunté' }}
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">{{ book.titre }}</h3>
        <p class="book-author">{{ book.auteur }}</p>
        <div class="book-details">
          <span class="book-year">{{ book.annee }}</span>
          <span class="book-category">{{ book.categorie }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BookCard',
    props: {
      book: {
        type: Object,
        required: true
      }
    }
  }
  </script>