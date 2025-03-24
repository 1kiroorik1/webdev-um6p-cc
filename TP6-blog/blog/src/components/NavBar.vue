<template>
    <!-- Navigation bar to : Home, addPost, EditPost -->
    <div class="navbar">
        <div class="navbar-left">
            <div><router-link to="/search">Home</router-link></div>
            <div><router-link to="/create">Add Post</router-link></div>
            <div><router-link to="/edits">Edit Posts</router-link></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NavBar',
        data() {
            return {
            }
        },
        methods: {
        }
    }
</script>

<style>
/* General Navbar Styling */
.navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1e1e1e; /* Dark mode background */
    padding: 15px 30px;
    box-shadow: 0 4px 8px rgba(255, 136, 0, 0.2);
    position: sticky;
    top: 0;
    width: 95%;
    border-radius: 5px;
}

/* Left Section */
.navbar-left {
    display: flex;
    align-items: center;
    gap: 25px;
}

/* Links Styling */
.navbar a {
    text-decoration: none;
    color: #ff8800;
    font-size: 16px;
    font-weight: 600;
    padding: 10px 15px;
    border-radius: 8px;
    transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
}

/* Hover Effect */
.navbar a:hover {
    background: #ff8800;
    color: #1e1e1e;
    box-shadow: 0 2px 8px rgba(255, 136, 0, 0.5);
}

/* Active Link Styling */
.router-link-active {
    background: #ffffff;
    color: #1e1e1e;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(255, 136, 0, 0.5);
}

</style>