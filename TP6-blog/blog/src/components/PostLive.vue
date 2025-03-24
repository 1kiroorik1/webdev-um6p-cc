<template>
    <SinglePost v-for="post in filteredPosts" :key="post.id" :post="post" :edit="edit || null" />
</template>

<script>
import SinglePost from './SinglePost.vue';
import getPosts from '../composables/getPosts';

export default {
    name: 'PostLive',
    components: { SinglePost },
    props: ['edit'],
    data(){
        return {
            keyword: this.$route.query.keyword || '',
            tags: this.$route.params.tags ? this.$route.params.tags.split(',') : [],
        }
    },
    computed: {
        filteredPosts() {
            const { posts , error } = getPosts(this.keyword, this.tags);
            if (error.value) {
                    console.error(error.value);
                    return [];
            }
            return posts.value;
        }
    },
    watch: {
        $route() {
            this.keyword = this.$route.query.keyword || '';
            this.tags = this.$route.query.tags ? this.$route.query.tags.split(',') : [];
        }
    }
}
</script>