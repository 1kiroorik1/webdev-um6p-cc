<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar -->
    <div class="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-gray-900 to-[#121212] p-6 shadow-xl z-50 transition-all duration-300">
      <div class="mb-8">
        <NuxtLink to="/" class="block animate-fadeIn">
          <svg class="w-32 hover:text-green-400 transition-all duration-300 transform hover:scale-105" viewBox="0 0 1134 340" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-32-19-76-28-141-27-42 1-48 8-54 8zm189 91c-16 0-33-7-33-20 0-12 17-20 33-20 16 0 33 8 33 20 0 13-17 20-33 20zm-111-41c-9 3-18-9-9-13 49-14 163-10 205 17 11 7-1 22-12 14-40-26-144-21-184-18z" />
          </svg>
        </NuxtLink>
      </div>
      <nav class="space-y-6">
        <NuxtLink to="/" class="nav-link group">
          <div class="absolute h-8 w-1 bg-green-500 rounded-r-full opacity-0 -left-6 transform scale-y-0 group-hover:scale-y-75 group-hover:opacity-50 transition-all duration-300" :class="{ '!opacity-100 !scale-y-100': $route.path === '/' }"></div>
          <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="font-medium">Home</span>
        </NuxtLink>
        <NuxtLink to="/search" class="nav-link group">
          <div class="absolute h-8 w-1 bg-green-500 rounded-r-full opacity-0 -left-6 transform scale-y-0 group-hover:scale-y-75 group-hover:opacity-50 transition-all duration-300" :class="{ '!opacity-100 !scale-y-100': $route.path === '/search' }"></div>
          <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span class="font-medium">Search</span>
        </NuxtLink>
        <NuxtLink to="/playlists" class="nav-link group">
          <div class="absolute h-8 w-1 bg-green-500 rounded-r-full opacity-0 -left-6 transform scale-y-0 group-hover:scale-y-75 group-hover:opacity-50 transition-all duration-300" :class="{ '!opacity-100 !scale-y-100': $route.path.includes('/playlists') }"></div>
          <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4z"/>
          </svg>
          <span class="font-medium">Your Library</span>
        </NuxtLink>
        <div class="border-t border-gray-800/50 my-4 pt-4">
          <h3 class="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wider">Your Playlists</h3>
          <div class="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
            <!-- Loading State -->
            <div v-if="isLoadingPlaylists" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="playlistError" class="text-sm text-red-400 px-2">
              {{ playlistError }}
            </div>

            <!-- Empty State -->
            <div v-else-if="userPlaylists.length === 0" class="text-sm text-gray-500 px-2">
              No playlists found
            </div>

            <!-- Playlists List -->
            <NuxtLink
              v-else
              v-for="playlist in userPlaylists"
              :key="playlist.id"
              :to="`/playlist/${playlist.id}`"
              class="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors py-1 group"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-gray-700/80 to-gray-900/80 shadow rounded overflow-hidden flex-shrink-0">
                <img
                  v-if="playlist.images?.[0]?.url"
                  :src="playlist.images[0].url"
                  :alt="playlist.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-lg text-gray-500">{{ playlist.name[0] }}</span>
                </div>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium truncate group-hover:text-green-400 transition-colors">{{ playlist.name }}</p>
                <p class="text-xs text-gray-500">{{ playlist.tracks?.total || 0 }} tracks</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Navigation Bar -->
      <div class="sticky top-0 z-10 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-xl p-4 flex items-center justify-between transition-all duration-300">
        <div class="flex items-center space-x-4">
          <button class="rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button class="rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
        <div v-if="isAuthenticated()" class="flex items-center space-x-3">
          <button class="btn-spotify text-sm py-1.5 px-5">
            <span>Upgrade</span>
          </button>
          <button @click="logout" class="flex items-center space-x-2 bg-black/50 rounded-full py-1 pl-1 pr-3 hover:bg-gray-800 transition-colors">
            <div class="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">U</div>
            <span class="text-sm font-medium">User</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Page Content -->
      <div>
        <slot />
      </div>
    </div>

    <!-- Player -->
    <div v-if="isAuthenticated()" class="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4">
      <div class="container mx-auto flex items-center justify-between">
        <!-- Now Playing -->
        <div class="flex items-center space-x-4">
          <img
            v-if="currentTrack?.album?.images?.[0]?.url"
            :src="currentTrack.album.images[0].url"
            :alt="currentTrack?.name"
            class="w-14 h-14 rounded"
          />
          <div>
            <p class="font-medium">{{ currentTrack?.name }}</p>
            <p class="text-sm text-gray-400">{{ currentTrack?.artists?.map(artist => artist.name).join(', ') }}</p>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex items-center space-x-4">
          <button @click="previousTrack" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button @click="togglePlay" class="text-white bg-white rounded-full p-2 hover:scale-110 transition-transform">
            <svg v-if="!isPlaying" class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
          <button @click="nextTrack" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <!-- Volume Control -->
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            v-model="volume"
            min="0"
            max="100"
            @input="(e) => setVolume(Number(e.target.value))"
            class="w-24"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth.js'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback.js'

const { isAuthenticated, logout, accessToken, refreshAccessToken } = useAuth()
const { 
  isPlaying, 
  currentTrack, 
  volume, 
  togglePlay, 
  nextTrack, 
  previousTrack, 
  setVolume 
} = useSpotifyPlayback()

// Playlists state
const userPlaylists = ref([])
const isLoadingPlaylists = ref(false)
const playlistError = ref('')
let playlistFetchTimeout = null

// Fetch user's playlists with stable retry
const fetchUserPlaylists = async () => {
  if (!accessToken.value) return
  
  // Clear any pending fetches
  if (playlistFetchTimeout) {
    clearTimeout(playlistFetchTimeout)
  }
  
  isLoadingPlaylists.value = true
  playlistError.value = ''
  
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        // On 401, try to refresh token and retry once
        await refreshAccessToken()
        // Add a small delay before retrying
        playlistFetchTimeout = setTimeout(() => {
          fetchUserPlaylists()
        }, 1000)
        return
      }
      throw new Error('Failed to fetch playlists')
    }

    const data = await response.json()
    // Only update if we got valid data
    if (data && Array.isArray(data.items)) {
      userPlaylists.value = data.items
    }
  } catch (err) {
    console.error('Error fetching playlists:', err)
    playlistError.value = 'Failed to load playlists'
    // Don't clear existing playlists on error
  } finally {
    isLoadingPlaylists.value = false
  }
}

// Watch for authentication changes
watch(accessToken, (newToken, oldToken) => {
  // Only fetch if we have a new valid token that's different from the old one
  if (newToken && newToken !== oldToken) {
    fetchUserPlaylists()
  } else if (!newToken) {
    userPlaylists.value = []
  }
}, { immediate: true })

onMounted(() => {
  if (accessToken.value) {
    fetchUserPlaylists()
  }
})

onUnmounted(() => {
  if (playlistFetchTimeout) {
    clearTimeout(playlistFetchTimeout)
  }
})
</script>

<style>
.router-link-active {
  @apply text-white;
}

.nav-link {
  @apply flex items-center space-x-4 text-gray-400 hover:text-white transition-colors relative py-2 px-2 rounded-md hover:bg-white/5;
}

.router-link-active {
  @apply bg-white/10 text-white font-semibold;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 