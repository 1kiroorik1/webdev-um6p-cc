// get the post using the passed id
import { ref } from 'vue';
import doc from '@/assets/posts.json'

// this is not working

const getPost = (id) => {
    const post = ref([]);
    const error = ref(null);

    try {
        post.value = doc.posts.find(post => post.id == id);
    } catch (err) {
        error.value = err.message;
    }

    return { post, error};
};

export default getPost;