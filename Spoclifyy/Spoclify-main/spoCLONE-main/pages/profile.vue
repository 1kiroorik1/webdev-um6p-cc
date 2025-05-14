<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="animate-fade-in">
      <div class="flex items-center space-x-6 mb-8">
        <div class="w-32 h-32 bg-gray-800 rounded-full animate-pulse"></div>
        <div class="flex-1">
          <div class="h-8 bg-gray-800 rounded w-48 mb-2 animate-pulse"></div>
          <div class="h-4 bg-gray-800 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div v-for="i in 3" :key="i" class="bg-gray-800/50 p-6 rounded-lg animate-pulse">
          <div class="h-6 bg-gray-700 rounded w-32 mb-4"></div>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-700 rounded-lg"></div>
            <div>
              <div class="h-6 bg-gray-700 rounded w-16 mb-2"></div>
              <div class="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="animate-fade-in">
      <div class="flex items-center space-x-6 mb-8">
        <img 
          v-if="userProfile?.images?.[0]?.url" 
          :src="userProfile.images[0].url" 
          :alt="userProfile?.display_name"
          class="w-32 h-32 rounded-full object-cover"
        />
        <div v-else class="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ userProfile?.display_name || 'User' }}</h1>
          <p class="text-gray-400">{{ userProfile?.followers?.total || 0 }} followers</p>
        </div>
      </div>

      <!-- User Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-gray-800/50 p-6 rounded-lg transform transition-all duration-300 hover:bg-gray-800">
          <h3 class="text-xl font-semibold mb-4">Liked Songs</h3>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ likedSongsCount }}</p>
              <p class="text-sm text-gray-400">Liked Songs</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/50 p-6 rounded-lg transform transition-all duration-300 hover:bg-gray-800">
          <h3 class="text-xl font-semibold mb-4">Your Playlists</h3>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ playlistsCount }}</p>
              <p class="text-sm text-gray-400">Created Playlists</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/50 p-6 rounded-lg transform transition-all duration-300 hover:bg-gray-800">
          <h3 class="text-xl font-semibold mb-4">Recently Played</h3>
          <div class="space-y-4">
            <template v-if="recentlyPlayed.length > 0">
              <div v-for="item in recentlyPlayed" :key="item.track.id" 
                class="flex items-center space-x-4 p-2 rounded-lg transition-colors hover:bg-gray-700/50">
                <div class="relative w-12 h-12 rounded overflow-hidden">
                  <img 
                    v-if="item.track.album?.images?.[0]?.url" 
                    :src="item.track.album.images[0].url" 
                    :alt="item.track.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-medium line-clamp-1">{{ item.track.name }}</p>
                  <p class="text-sm text-gray-400 line-clamp-1">
                    {{ item.track.artists.map(artist => artist.name).join(', ') }}
                  </p>
                </div>
              </div>
            </template>
            <div v-else class="text-gray-500 text-center py-2">
              No recently played tracks
            </div>
          </div>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { accessToken, logout } = useAuth()
const userProfile = ref({})
const recentlyPlayed = ref([])
const likedSongsCount = ref(0)
const playlistsCount = ref(0)
const isLoading = ref(true)

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    const data = await response.json()
    userProfile.value = data
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// Fetch liked songs count
const fetchLikedSongsCount = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/tracks', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch liked songs')
    }

    const data = await response.json()
    likedSongsCount.value = data.total
  } catch (error) {
    console.error('Error fetching liked songs count:', error)
    likedSongsCount.value = 0
  }
}

// Fetch playlists count
const fetchPlaylistsCount = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch playlists')
    }

    const data = await response.json()
    playlistsCount.value = data.total
  } catch (error) {
    console.error('Error fetching playlists count:', error)
    playlistsCount.value = 0
  }
}

// Fetch recently played tracks
const fetchRecentlyPlayed = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch recently played')
    }

    const data = await response.json()
    recentlyPlayed.value = data.items
  } catch (error) {
    console.error('Error fetching recently played tracks:', error)
    recentlyPlayed.value = []
  }
}

// Load all data
const loadProfileData = async () => {
  isLoading.value = true
  
  try {
    await Promise.all([
      fetchUserProfile(),
      fetchLikedSongsCount(),
      fetchPlaylistsCount(),
      fetchRecentlyPlayed()
    ])
  } catch (err) {
    console.error('Error loading profile data:', err)
  } finally {
    // Add a small delay before removing loading state to prevent flash
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}

onMounted(() => {
  loadProfileData()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 