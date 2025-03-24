<template>
    <div v-if="post" class="post">
        <h2>{{ post.title }}</h2>
        <!-- Tags -->
        <div class="tags" v-if="post.tags && post.tags.length">
            <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
        </div>
        <!-- Snippet -->
        <p>{{ post.content?.substring(0, 50) || "No content available" }}...</p>
        <!-- Router Link -->
        <router-link v-if="post.id && !edit" :to="{ name: 'post', params: { id: post.id } }">Go to the article...</router-link>
        <router-link v-if="post.id && edit" :to="{ name: 'edit', params: { id: post.id } }">Edit...</router-link>
        <!-- and a delete button -->
        <a @click="deletePost(post.id)" v-if="post.id && edit" >!! Delete !!</a>
    </div>
</template>

<script>
import data from '@/assets/posts.json';

export default {
    name: 'SinglePost',
    props: ['post','edit'],
    methods: {
        deletePost(id) {
            // first give a warning
            if (confirm("Are you sure you want to delete this post?")) {
                data.posts = data.posts.filter(post => post.id !== id);
                this.$router.push('/');
            }
        }
    }
}
</script>

<style>
.post {
    margin: 20px auto;
    padding: 20px;
    background: #1e1e1e; /* Dark mode background */
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(255, 136, 0, 0.2);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.post:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(255, 136, 0, 0.4);
}

.post h2 {
    font-size: 24px;
    color: #fad4a8;
    margin-bottom: 10px;
    position: relative;
}

.post h2::before {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: #654723;
    position: absolute;
    bottom: -5px;
    left: 0;
    border-radius: 4px;
}

.post .tags {
    margin: 12px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.post .tags span {
    background: #ff8800ab;
    color: #fff;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: 600;
}

.post p {
    color: #ccc;
    line-height: 1.6;
    margin-bottom: 10px;
}

.post a {
    display: inline-block;
    text-decoration: none;
    background: #ff880061;
    color: #fff;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 600;
    transition: background 0.3s ease-in-out;
    margin-right:  10px;
}

.post a:hover {
    background: #e67300d9;
}
</style>
