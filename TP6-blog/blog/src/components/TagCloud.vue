<template>
    <div class="container">
        <h2>filter:</h2>
        <!-- first the search bar -->
        <div class="selected_tags">
            <div v-for="tag in selectedTags" :key="tag" @click="selectedTags = [...selectedTags]; removeTag(tag)">{{ tag }}</div>
        </div>
        <label for="search">Search the titles:</label>
        <input type="text" v-model="keyword" placeholder="search the titles">
        
        <label for="search">Search the tags:</label>
        <input type="text" v-model="tagFilter" placeholder="search the tags">
        <!-- then the tag cloud -->
        <div class="tag-cloud">
            <div v-for="tag in filteredTags" :key="tag" @click="selectedTags = [...selectedTags]; addTag(tag)">{{ tag }}</div>
        </div>
    </div>

</template>
<script>
    import data from '@/assets/posts.json';

    export default {
        name: 'TagCloud',
        data() {
            return {
                selectedTags: [],
                keyword: '',
                tags: [],
                tagFilter: ''
            }
        },
        mounted(){
            // getting the tags
            this.tags = [...data.tags];
        },
        watch: {
            selectedTags () {
                this.$router.replace({
                    path: this.$route.path,
                    query: {...this.$route.query, tags : this.selectedTags.join(',')}
                });
            },
            keyword() {
                this.$router.replace({
                    path: this.$route.path,
                    query: {...this.$route.query, keyword :this.keyword}
                });
            }
        },
        methods: {
            removeTag(tag) {
                this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
            },
            addTag(tag) {
                if (!this.selectedTags.includes(tag)) {
                    this.selectedTags.push(tag);
                }
            }
        },
        computed: {
            filteredTags() {
                return this.tags.filter(tag =>
                    tag.toLowerCase().includes(this.tagFilter.toLowerCase()))
            }
        }
    }
</script>
<style scoped>
.container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #1e1e1e; /* Dark mode background */
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(255, 136, 0, 0.2);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    color: white;
    font-family: 'Arial', sans-serif;
}

.container:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(255, 136, 0, 0.4);
}

/* Headers */
h2 {
    color: #ff8800;
    text-align: center;
}

/* Inputs */
input {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ff8800;
    border-radius: 6px;
    background: #2c2c2c;
    color: white;
    outline: none;
}

input::placeholder {
    color: #aaa;
}

/* Selected Tags */
.selected_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0;
}

.selected_tags div {
    background: #ff8800;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.selected_tags div:hover {
    background: #cc6e00;
}

/* Tag Cloud */
.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.tag-cloud div {
    background: #444;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.tag-cloud div:hover {
    background: #666;
}

/* Mobile Responsive */
@media (max-width: 600px) {
    .container {
        width: 90%;
    }

    .selected_tags, .tag-cloud {
        justify-content: center;
    }
}
</style>
