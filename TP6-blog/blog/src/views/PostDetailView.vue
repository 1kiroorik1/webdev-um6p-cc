<template>
    <div class="container">
      <article v-if="Mypost" class="post-article">
        <h1 class="post-title">{{ Mypost.title }}</h1>
        <div class="separator"></div>
        <div class="post-content">
          <p v-html="Mypost.content"></p>
        </div>
      </article>
  
      <div v-else-if="error" class="error-message">
        <p>Error: {{ error }}</p>
      </div>
  
      <div v-else class="loading-message">
        <p>Loading article...</p>
      </div>
    </div>
  </template>
  
  <script>
  import getPost from '../composables/getPost';
  
  export default {
    data() {
      return {
        Mypost: null,
        error: null,
      };
    },
    created() {
      const postId = this.$route.params.id;
      const { post, error } = getPost(postId);
  
      if (error.value) {
        this.error = error.value;
      } else {
        this.Mypost = post.value;
        console.log(this.Mypost);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 🌙 Dark Theme */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #ffffff;
    font-family: 'Arial', sans-serif;
    padding: 40px;
  }
  
  /* 📖 Article Styling */
  .post-article {
    background: #2c2c2c;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(255, 136, 0, 0.3);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    height: 100%;
    width: 100%;
  }
  
  .post-article:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(255, 136, 0, 0.4);
  }
  
  /* 🏷 Big Title */
  .post-title {
    color: #ff8800;
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
  }
  
  /* ➖ Separator */
  .separator {
    width: 100%;
    height: 5px;
    background: #ff8800;
    border-radius: 3px;
    margin-bottom: 30px;
  }
  
  /* 📝 Content */
  .post-content {
    font-size: 22px;
    line-height: 1.8;
    color: #e0e0e0;
    text-align: justify;
  }
  
  /* ⚠️ Error & Loading States */
  .error-message, .loading-message {
    background: #222;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;
    max-width: 500px;
  }
  
  .error-message {
    border-left: 5px solid red;
  }
  
  .loading-message {
    border-left: 5px solid #ff8800;
    font-style: italic;
  }
  </style>
  