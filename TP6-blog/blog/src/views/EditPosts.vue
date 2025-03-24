<template>
    <div>
        <h1>Edit Posts</h1>
        <div class="main">
            <div id="Postlive"><PostLive :edit=true /></div>
            <div id="TagCloud"><TagCloud/></div>
        </div>
    </div>  
</template>
<script>
    import PostLive from '@/components/PostLive.vue';
    import TagCloud from '@/components/TagCloud.vue';

    export default {
        name: 'EditPosts',
        components: {
           PostLive,
           TagCloud
        }
    }
</script>
<style scoped>
    .main {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;   
    }
    #Postlive {
        grid-column: 1/4;
        grid-row: 1;
        height: 100%;
    }
    #TagCloud {
        grid-column: 4;
        grid-row: 1;
    }
    TagCloud {
        height: 100%;
    }
</style>