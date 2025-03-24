<template>
    <div>
        <h1>Home Page</h1>
        <!-- run with tag in case it exists if not without-->
        <div class="main">
            <div id="Postlive"><PostLive/></div>
            <div id="TagCloud"><TagCloud/></div>
        </div>
    </div>
</template>

<script>
    import PostLive from '@/components/PostLive.vue';
    import TagCloud from '@/components/TagCloud.vue';

    export default {
        name: 'HomeView',
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