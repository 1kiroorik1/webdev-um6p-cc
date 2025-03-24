import { ref } from 'vue';
import data from '@/assets/posts.json';

const getPosts = (keyword = '', tags = []) => {
    let posts = ref([]);
    const error = ref(null);

    if(data) {
        posts = data.posts;
    }else{
        error.value = 'No posts found';
    }

    // Watch for route changes to update filtered posts
    try {    
        // Filter posts based on keyword and tags
        posts.value = data.posts.filter(post => {
            const matchesKeyword = post.title.toLowerCase().includes(keyword.toLowerCase());
            const matchesTags = tags.length === 0 || tags.every(tag => post.tags.includes(tag));
            
            return matchesKeyword && matchesTags;
        });

    } catch (err) {
        error.value = err.message;
    }    
        
    return { posts, error };
};

export default getPosts;
