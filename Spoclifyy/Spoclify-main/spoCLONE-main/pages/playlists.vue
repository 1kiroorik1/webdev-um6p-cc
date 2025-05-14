<template>
  <div class="min-h-screen p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Your Library</h1>
      <button 
        @click="showCreateForm = true"
        class="bg-green-500 hover:bg-green-400 text-black font-medium py-2 px-4 rounded-full transition flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <span>Create Playlist</span>
      </button>
    </div>

    <!-- Create Playlist Form -->
    <div v-if="showCreateForm" class="mb-8 bg-gradient-to-br from-gray-800/40 to-gray-900/80 p-6 rounded-xl border border-gray-800/50">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Create New Playlist</h2>
        <button @click="showCreateForm = false" class="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleCreatePlaylist" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium mb-2">
            Playlist Name *
          </label>
          <input
            id="name"
            v-model="newPlaylistName"
            type="text"
            required
            class="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            placeholder="Enter playlist name"
          />
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            v-model="newPlaylistDescription"
            rows="3"
            class="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
            placeholder="Enter playlist description"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showCreateForm = false"
            class="px-4 py-2 rounded-full hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isCreating || !newPlaylistName.trim()"
            class="bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 disabled:cursor-not-allowed text-black font-medium py-2 px-6 rounded-full transition flex items-center space-x-2"
          >
            <span v-if="isCreating">Creating...</span>
            <span v-else>Create</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg">
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>

    <!-- Playlists Grid -->
    <div v-else-if="playlists.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="playlist in playlists" :key="playlist.id" 
        class="bg-gradient-to-br from-gray-800/40 to-gray-900/80 p-4 rounded-lg transition-all duration-300 hover:bg-gray-700/50 cursor-pointer group"
        @click="navigateToPlaylist(playlist.id)"
      >
        <div class="relative mb-4">
          <img 
            v-if="playlist.images?.[0]?.url" 
            :src="playlist.images[0].url" 
            :alt="playlist.name"
            class="w-full aspect-square object-cover rounded-lg shadow-md"
          />
          <div v-else class="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-md flex items-center justify-center">
            <span class="text-2xl text-gray-400">{{ playlist.name?.charAt(0)?.toUpperCase() }}</span>
          </div>
          <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
            <button class="bg-green-500 rounded-full p-3 shadow-lg hover:scale-110 hover:bg-green-400 transition-all">
              <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z"/>
              </svg>
            </button>
          </div>
        </div>
        <h3 class="font-medium truncate group-hover:text-green-400 transition-colors">{{ playlist.name }}</h3>
        <p class="text-sm text-gray-400">{{ playlist.tracks?.total }} tracks</p>
      </div>
    </div>

    <!-- No Playlists -->
    <div v-else-if="!isLoading && !error" class="text-center text-gray-400 py-12">
      No playlists found. Create your first playlist!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { usePlaylistManagement } from '~/composables/usePlaylistManagement'

const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()
const { createPlaylist, fetchUserProfile, isLoading: isCreating } = usePlaylistManagement()

const playlists = ref([])
const isLoading = ref(true)
const error = ref('')
const showCreateForm = ref(false)
const newPlaylistName = ref('')
const newPlaylistDescription = ref('')
const successMessage = ref('')

// Fetch user's playlists
const fetchPlaylists = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchPlaylists()
      }
      throw new Error('Failed to fetch playlists')
    }
    
    const data = await response.json()
    playlists.value = data.items
  } catch (err) {
    console.error('Error fetching playlists:', err)
    error.value = 'Failed to load playlists'
  } finally {
    isLoading.value = false
  }
}

// Handle playlist creation
const handleCreatePlaylist = async () => {
  if (!newPlaylistName.value.trim()) return
  
  try {
    await fetchUserProfile()
    const playlist = await createPlaylist(
      newPlaylistName.value,
      newPlaylistDescription.value || undefined
    )
    
    if (playlist) {
      successMessage.value = 'Playlist created successfully!'
      newPlaylistName.value = ''
      newPlaylistDescription.value = ''
      showCreateForm.value = false
      // Refresh the playlists list
      await fetchPlaylists()
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (err) {
    error.value = 'Failed to create playlist'
    setTimeout(() => {
      error.value = ''
    }, 3000)
  }
}

// Navigation function
const navigateToPlaylist = (id) => {
  router.push(`/playlist/${id}`)
}

onMounted(async () => {
  if (!accessToken.value) {
    error.value = 'Please log in to view your playlists'
    isLoading.value = false
    return
  }

  await fetchPlaylists()
})
</script>

<style scoped>
.grid {
  scroll-margin-top: 2rem;
}
</style> 