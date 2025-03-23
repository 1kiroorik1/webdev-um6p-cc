<template>
  <div id="app">
    <header>
      <h1>Gestion des Emplois</h1>
      <nav>
        <router-link to="/">Accueil</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 - Application de Gestion des Emplois</p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #4a69bd;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  font-size: 1.5rem;
}

nav a {
  color: #fff;
  text-decoration: none;
  margin-left: 1rem;
  padding: 0.5rem;
}

nav a:hover {
  text-decoration: underline;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

.btn {
  display: inline-block;
  background: #4a69bd;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:hover {
  background: #3a5a9e;
}

.btn.delete {
  background: #e74c3c;
}

.btn.delete:hover {
  background: #c0392b;
}

.btn.secondary {
  background: #95a5a6;
}

.btn.secondary:hover {
  background: #7f8c8d;
}

.form-control {
  margin: 20px 0;
}

.form-control label {
  display: block;
  margin-bottom: 5px;
}

.form-control input,
.form-control textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.container {
  background: #fff;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>