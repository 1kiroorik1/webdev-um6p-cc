<template>
  <div id="app">
    <div class="header">
      <div class="container">
        <h1>Bibliothèque Littéraire</h1>
        <p>Explorez un univers riche en connaissances et découvertes</p>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>