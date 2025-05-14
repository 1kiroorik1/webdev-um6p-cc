<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Login Section for unauthenticated users -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
      <!-- Spotify Logo with animation -->
      <div class="mb-12 animate-fadeIn">
        <svg class="w-64 hover:scale-105 transition-transform duration-300" viewBox="0 0 1134 340" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-32-19-76-28-141-27-42 1-48 8-54 8zm189 91c-16 0-33-7-33-20 0-12 17-20 33-20 16 0 33 8 33 20 0 13-17 20-33 20zm-111-41c-9 3-18-9-9-13 49-14 163-10 205 17 11 7-1 22-12 14-40-26-144-21-184-18z" />
        </svg>
      </div>

      <div class="text-center max-w-md animate-fadeIn animation-delay-300">
        <h1 class="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">Welcome to Spotify Clone</h1>
        <p class="text-gray-400 mb-8">Connect with Spotify to access your music library, playlists and more.</p>
        <button
          @click="login"
          class="bg-gradient-to-r from-green-500 to-green-400 text-white px-8 py-4 rounded-full hover:from-green-400 hover:to-green-500 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-green-500/20"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span>Connect with Spotify</span>
        </button>
      </div>
    </div>

    <!-- Content for authenticated users -->
    <div v-else class="pb-32 bg-gradient-to-b from-gray-900 via-black to-black min-h-screen">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>

      <div v-else>
        <!-- Liked Songs Section -->
        <section class="px-6 pt-8 mb-10">
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-2xl font-bold">Liked Songs</h2>
          </div>
          
          <div v-if="likedSongs.length === 0" class="text-gray-400 text-center py-8">
            No liked songs found
          </div>
          
          <div v-else class="grid grid-flow-col auto-cols-max gap-6 overflow-x-auto pb-6 scrollbar-hide">
            <div v-for="item in likedSongs" :key="item.track.id" 
              class="w-48 transition-transform duration-300 hover:translate-y-[-8px]">
              <div class="bg-gradient-to-br from-gray-800/40 to-gray-900/80 p-4 rounded-lg transition-all duration-300 cursor-pointer group relative shadow-lg hover:shadow-xl border border-gray-800/50"
                @click="playTrack(item.track.uri)">
                <div class="relative mb-4 overflow-hidden rounded-lg">
                  <img 
                    v-if="item.track.album?.images?.[0]?.url" 
                    :src="item.track.album.images[0].url" 
                    :alt="item.track.name"
                    class="w-full aspect-square object-cover rounded-lg shadow-md transition-transform duration-500 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                    <button class="bg-green-500 rounded-full p-3 shadow-lg hover:scale-110 hover:bg-green-400 transition-all">
                      <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5.14v14l11-7-11-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 class="font-bold text-base truncate group-hover:text-green-400 transition-colors duration-300">{{ item.track.name }}</h3>
                <p class="text-sm text-gray-400 truncate mt-1">{{ item.track.artists.map(artist => artist.name).join(', ') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Recently Played Section -->
        <section class="px-6 mb-10">
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-2xl font-bold">Recently Played</h2>
          </div>
          
          <div v-if="recentlyPlayed.length === 0" class="text-gray-400 text-center py-8">
            No recently played tracks found
          </div>
          
          <div v-else class="grid grid-flow-col auto-cols-max gap-6 overflow-x-auto pb-6 scrollbar-hide">
            <div v-for="item in recentlyPlayed" :key="item.track.id" 
              class="w-48 transition-transform duration-300 hover:translate-y-[-8px]">
              <div class="bg-gradient-to-br from-gray-800/40 to-gray-900/80 p-4 rounded-lg transition-all duration-300 cursor-pointer group relative shadow-lg hover:shadow-xl border border-gray-800/50"
                @click="playTrack(item.track.uri)">
                <div class="relative mb-4 overflow-hidden rounded-lg">
                  <img 
                    v-if="item.track.album?.images?.[0]?.url" 
                    :src="item.track.album.images[0].url" 
                    :alt="item.track.name"
                    class="w-full aspect-square object-cover rounded-lg shadow-md transition-transform duration-500 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                    <button class="bg-green-500 rounded-full p-3 shadow-lg hover:scale-110 hover:bg-green-400 transition-all">
                      <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5.14v14l11-7-11-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 class="font-bold text-base truncate group-hover:text-green-400 transition-colors duration-300">{{ item.track.name }}</h3>
                <p class="text-sm text-gray-400 truncate mt-1">{{ item.track.artists.map(artist => artist.name).join(', ') }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    
    <!-- Player Control Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800/50 backdrop-blur-lg p-4 flex items-center justify-between shadow-2xl z-50">
      <div class="flex items-center space-x-4 w-1/3">
        <div class="relative group">
          <img v-if="currentTrack?.album?.images?.[0]?.url" :src="currentTrack.album.images[0].url" alt="Cover" class="w-14 h-14 rounded-md shadow-md transition-transform duration-300 group-hover:scale-105">
          <div v-else class="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center shadow-md">
            <svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium truncate hover:text-green-400 transition-colors duration-300 cursor-pointer">{{ currentTrack?.name || 'Not playing' }}</p>
          <p class="text-sm text-gray-400 truncate hover:text-gray-300 transition-colors duration-300 cursor-pointer">{{ currentTrack?.artists?.map(a => a.name).join(', ') || 'Select a track' }}</p>
        </div>
      </div>
      
      <div class="flex flex-col items-center w-1/3">
        <div class="flex items-center space-x-6 mb-2">
          <button class="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6.94a1 1 0 00-1.5.86v8.4a1 1 0 001.5.86l7-4.2a1 1 0 000-1.72l-7-4.2z" transform="rotate(180, 12, 12)"/>
            </svg>
          </button>
          <button class="bg-white rounded-full p-2 hover:bg-green-400 hover:scale-110 transition-all duration-300 shadow-md">
            <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z"/>
            </svg>
          </button>
          <button class="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6.94a1 1 0 00-1.5.86v8.4a1 1 0 001.5.86l7-4.2a1 1 0 000-1.72l-7-4.2z"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center w-full space-x-2">
          <span class="text-xs text-gray-400">0:00</span>
          <div class="h-1 bg-gray-700 rounded-full flex-1 overflow-hidden group cursor-pointer relative">
            <div class="bg-gray-400 h-full w-0 group-hover:bg-green-500 transition-colors"></div>
            <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span class="text-xs text-gray-400">0:00</span>
        </div>
      </div>
      
      <div class="flex items-center justify-end space-x-3 w-1/3">
        <button class="text-gray-400 hover:text-green-400 transition-colors hover:scale-110 duration-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>
        <div class="w-24 group cursor-pointer">
          <div class="h-1 bg-gray-700 rounded-full overflow-hidden relative">
            <div class="bg-white h-full w-1/2 group-hover:bg-green-500 transition-colors"></div>
            <div class="absolute right-[50%] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback'
import { useSpotifyData } from '~/composables/useSpotifyData'

const { login, accessToken } = useAuth()
const { playTrack, currentTrack, isPlaying } = useSpotifyPlayback()
const { likedSongs, recentlyPlayed, isLoading, fetchLikedSongs, fetchRecentlyPlayed } = useSpotifyData()
const isAuthenticated = ref(false)

// Check authentication status and fetch data
const checkAuthAndFetchData = async () => {
  isAuthenticated.value = !!accessToken.value
  if (isAuthenticated.value) {
    await Promise.all([
      fetchLikedSongs(),
      fetchRecentlyPlayed()
    ])
  }
}

// Watch for auth token changes
watch(accessToken, () => {
  checkAuthAndFetchData()
})

// Initial load
onMounted(() => {
  checkAuthAndFetchData()
})
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style> 