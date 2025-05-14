<template>
  <div class="min-h-screen">
    <!-- Search Input -->
    <div class="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for tracks, artists, albums, playlists, or user profiles..."
          class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
          @input="handleSearch"
        />
        <svg class="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- Message d'erreur -->
      <div v-if="error" class="mt-4 bg-red-900/70 text-white p-3 rounded-lg flex items-center">
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>

    <!-- Search Results -->
    <div v-else-if="searchQuery" class="p-8">
      <!-- User Profiles - Section cachée car l'API ne prend pas en charge la recherche d'utilisateurs -->
      <!-- 
      <div v-if="displayedUsers.length > 0" class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">User Profiles</h2>
          <button 
            v-if="users.length > displayedUsers.length"
            @click="loadMoreUsers"
            class="text-green-500 hover:text-green-400 transition-colors"
          >
            Show More
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <div v-for="user in displayedUsers" :key="user.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToUser(user.id)"
          >
            <img 
              v-if="user.images?.[0]?.url" 
              :src="user.images[0].url" 
              :alt="user.display_name"
              class="w-full aspect-square object-cover rounded mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ user.display_name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate">{{ user.display_name }}</h3>
            <p class="text-sm text-gray-400">{{ user.followers?.total }} followers</p>
          </div>
        </div>
      </div>
      -->

      <!-- Tracks -->
      <div v-if="displayedTracks.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Tracks</h2>
        <div class="space-y-4">
          <div v-for="track in displayedTracks" :key="track?.id" 
            class="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group relative"
          >
            <div class="flex-shrink-0 relative">
              <img 
                v-if="track?.album?.images?.[0]?.url" 
                :src="track.album.images[0].url" 
                :alt="track?.name"
                class="w-12 h-12 rounded shadow-md"
              />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                <button 
                  @click.stop="playTrack(track?.uri)"
                  class="text-white hover:scale-110 transition-transform"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{{ track?.name }}</p>
              <p class="text-sm text-gray-400 truncate">{{ track?.artists?.map(artist => artist?.name).filter(Boolean).join(', ') }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <button 
                @click.stop="toggleLike(track.id)"
                class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                :class="{ 'text-green-500 hover:text-green-400': trackLikeStatus[track.id] }"
              >
                <svg v-if="trackLikeStatus[track.id]" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <button 
                @click.stop="showAddToPlaylistModal(track)"
                class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                </svg>
              </button>
              <span class="text-gray-400 text-sm">{{ formatDuration(track?.duration_ms || 0) }}</span>
            </div>
          </div>
        </div>
        <button 
          v-if="tracks.length > displayedTracks.length"
          @click="loadMoreTracks"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Tracks
        </button>
      </div>

      <!-- Artists -->
      <div v-if="displayedArtists.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Artists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="artist in displayedArtists" :key="artist?.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToArtist(artist?.id)"
          >
            <img 
              v-if="artist?.images?.[0]?.url" 
              :src="artist.images[0].url" 
              :alt="artist?.name"
              class="w-full aspect-square object-cover rounded-full mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded-full mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ artist?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate text-center">{{ artist?.name }}</h3>
            <p class="text-sm text-gray-400 text-center">Artist</p>
          </div>
        </div>
        <button 
          v-if="artists.length > displayedArtists.length"
          @click="loadMoreArtists"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Artists
        </button>
      </div>

      <!-- Albums -->
      <div v-if="displayedAlbums.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="album in displayedAlbums" :key="album?.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToAlbum(album?.id)"
          >
            <img 
              v-if="album?.images?.[0]?.url" 
              :src="album.images[0].url" 
              :alt="album?.name"
              class="w-full aspect-square object-cover rounded mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ album?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate">{{ album?.name }}</h3>
            <p class="text-sm text-gray-400">{{ album?.artists?.map(artist => artist?.name).filter(Boolean).join(', ') }}</p>
          </div>
        </div>
        <button 
          v-if="albums.length > displayedAlbums.length"
          @click="loadMoreAlbums"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Albums
        </button>
      </div>

      <!-- Playlists -->
      <div v-if="displayedPlaylists.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Playlists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="playlist in displayedPlaylists" :key="playlist?.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToPlaylist(playlist?.id)"
          >
            <img 
              v-if="playlist?.images?.[0]?.url" 
              :src="playlist.images[0].url" 
              :alt="playlist?.name"
              class="w-full aspect-square object-cover rounded mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ playlist?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate">{{ playlist?.name }}</h3>
            <p class="text-sm text-gray-400">By {{ playlist?.owner?.display_name }}</p>
          </div>
        </div>
        <button 
          v-if="playlists.length > displayedPlaylists.length"
          @click="loadMorePlaylists"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Playlists
        </button>
      </div>

      <!-- No Results -->
      <div v-if="!isLoading && !displayedTracks.length && !displayedArtists.length && !displayedAlbums.length && !displayedPlaylists.length" 
        class="text-center text-gray-400 py-12"
      >
        No results found for "{{ searchQuery }}"
      </div>
    </div>

    <!-- Add to Playlist Modal -->
    <div v-if="showPlaylistModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Add to Playlist</h3>
          <button @click="closePlaylistModal" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div v-if="isLoadingPlaylists" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
        
        <div v-else-if="userPlaylists.length === 0" class="text-center py-8 text-gray-400">
          No playlists found. Create a playlist first.
        </div>
        
        <div v-else class="space-y-2 max-h-96 overflow-y-auto pr-2">
          <button
            v-for="playlist in userPlaylists"
            :key="playlist.id"
            @click="addToPlaylist(playlist.id)"
            class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
          >
            <img
              v-if="playlist.images?.[0]?.url"
              :src="playlist.images[0].url"
              :alt="playlist.name"
              class="w-12 h-12 rounded shadow-md"
            />
            <div v-else class="w-12 h-12 bg-gray-800 rounded shadow-md flex items-center justify-center">
              <span class="text-xl text-gray-500">{{ playlist.name[0] }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{{ playlist.name }}</p>
              <p class="text-sm text-gray-400 truncate">{{ playlist.tracks?.total || 0 }} tracks</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth.js'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback.js'
import { useSpotifyData } from '~/composables/useSpotifyData'

/**
 * @typedef {Object} SpotifyImage
 * @property {string} url - The URL of the image
 */

/**
 * @typedef {Object} SpotifyArtist
 * @property {string} id - The artist's Spotify ID
 * @property {string} name - The artist's name
 * @property {SpotifyImage[]} images - Array of artist images
 */

/**
 * @typedef {Object} SpotifyAlbum
 * @property {string} id - The album's Spotify ID
 * @property {string} name - The album's name
 * @property {SpotifyImage[]} images - Array of album cover images
 * @property {SpotifyArtist[]} artists - Array of album artists
 */

/**
 * @typedef {Object} SpotifyTrack
 * @property {string} id - The track's Spotify ID
 * @property {string} name - The track's name
 * @property {string} uri - The track's Spotify URI
 * @property {number} duration_ms - Track duration in milliseconds
 * @property {SpotifyAlbum} album - The track's album
 * @property {SpotifyArtist[]} artists - Array of track artists
 */

/**
 * @typedef {Object} SpotifyPlaylist
 * @property {string} id - The playlist's Spotify ID
 * @property {string} name - The playlist's name
 * @property {SpotifyImage[]} images - Array of playlist cover images
 * @property {Object} owner - Playlist owner information
 * @property {string} owner.display_name - Owner's display name
 */

/**
 * @typedef {Object} SpotifyUser
 * @property {string} id - The user's Spotify ID
 * @property {string} display_name - The user's display name
 * @property {SpotifyImage[]} images - Array of user profile images
 * @property {Object} [followers] - Follower information
 * @property {number} [followers.total] - Total number of followers
 */

const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()
const { playTrack: playSpotifyTrack } = useSpotifyPlayback()
const { checkIfTrackIsLiked, toggleLikeTrack, addTrackToPlaylist } = useSpotifyData()

const searchQuery = ref('')
const isLoading = ref(false)
const tracks = ref([])
const artists = ref([])
const albums = ref([])
const playlists = ref([])
const users = ref([])

// Display limits
const DISPLAY_LIMIT = 6
const displayedTracks = ref([])
const displayedArtists = ref([])
const displayedAlbums = ref([])
const displayedPlaylists = ref([])
const displayedUsers = ref([])

const trackLikeStatus = ref({})
const showPlaylistModal = ref(false)
const selectedTrack = ref(null)
const userPlaylists = ref([])
const isLoadingPlaylists = ref(false)

// Search for tracks, artists, albums, and playlists
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    resetResults()
    return
  }

  // Vérifier si le token est disponible
  if (!accessToken.value) {
    console.error('Pas de token d\'accès disponible')
    resetResults()
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery.value)}&type=track,artist,album,playlist&limit=20`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Tenter de rafraîchir le token
        const success = await refreshAccessToken()
        if (success) {
          return handleSearch()
        } else {
          throw new Error('Impossible de rafraîchir le token d\'accès')
        }
      }
      
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error?.message || `La recherche a échoué avec le statut: ${response.status}`)
    }

    const data = await response.json()
    
    // Update results
    tracks.value = data.tracks?.items || []
    artists.value = data.artists?.items || []
    albums.value = data.albums?.items || []
    playlists.value = data.playlists?.items || []
    // L'API Spotify ne prend pas en charge la recherche d'utilisateurs
    users.value = []

    // Update displayed items
    updateDisplayedItems()

    // After updating results
    await checkTracksLikeStatus(displayedTracks.value)
  } catch (error) {
    console.error('Erreur de recherche:', error)
    resetResults()
    // Ne pas propager l'erreur pour éviter les avertissements non gérés
    error.value = error.message
  } finally {
    isLoading.value = false
  }
}

// Reset all results
const resetResults = () => {
  tracks.value = []
  artists.value = []
  albums.value = []
  playlists.value = []
  users.value = []
  updateDisplayedItems()
}

// Update displayed items based on limits
const updateDisplayedItems = () => {
  displayedTracks.value = tracks.value.slice(0, DISPLAY_LIMIT)
  displayedArtists.value = artists.value.slice(0, DISPLAY_LIMIT)
  displayedAlbums.value = albums.value.slice(0, DISPLAY_LIMIT)
  displayedPlaylists.value = playlists.value.slice(0, DISPLAY_LIMIT)
  displayedUsers.value = users.value.slice(0, DISPLAY_LIMIT)
}

// Load more functions
const loadMoreTracks = async () => {
  const currentLength = displayedTracks.value.length
  displayedTracks.value = tracks.value.slice(0, currentLength + DISPLAY_LIMIT)
  await checkTracksLikeStatus(displayedTracks.value.slice(currentLength))
}

const loadMoreArtists = () => {
  const currentLength = displayedArtists.value.length
  displayedArtists.value = artists.value.slice(0, currentLength + DISPLAY_LIMIT)
}

const loadMoreAlbums = () => {
  const currentLength = displayedAlbums.value.length
  displayedAlbums.value = albums.value.slice(0, currentLength + DISPLAY_LIMIT)
}

const loadMorePlaylists = () => {
  const currentLength = displayedPlaylists.value.length
  displayedPlaylists.value = playlists.value.slice(0, currentLength + DISPLAY_LIMIT)
}

const loadMoreUsers = () => {
  const currentLength = displayedUsers.value.length
  displayedUsers.value = users.value.slice(0, currentLength + DISPLAY_LIMIT)
}

// Navigation functions
const navigateToArtist = (id) => {
  router.push(`/artist/${id}`)
}

const navigateToAlbum = (id) => {
  router.push(`/album/${id}`)
}

const navigateToPlaylist = (id) => {
  router.push(`/playlist/${id}`)
}

const navigateToUser = (id) => {
  router.push(`/user/${id}`)
}

// Format track duration
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Check like status for displayed tracks
const checkTracksLikeStatus = async (tracks) => {
  for (const track of tracks) {
    if (track?.id && !trackLikeStatus.value.hasOwnProperty(track.id)) {
      trackLikeStatus.value[track.id] = await checkIfTrackIsLiked(track.id)
    }
  }
}

// Toggle like status
const toggleLike = async (trackId) => {
  const currentStatus = trackLikeStatus.value[trackId] || false
  const success = await toggleLikeTrack(trackId, currentStatus)
  if (success) {
    trackLikeStatus.value[trackId] = !currentStatus
  }
}

// Fetch user's playlists
const fetchUserPlaylists = async () => {
  if (!accessToken.value) return
  
  isLoadingPlaylists.value = true
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchUserPlaylists()
      }
      throw new Error('Failed to fetch playlists')
    }

    const data = await response.json()
    userPlaylists.value = data.items
  } catch (err) {
    console.error('Error fetching playlists:', err)
  } finally {
    isLoadingPlaylists.value = false
  }
}

// Show add to playlist modal
const showAddToPlaylistModal = async (track) => {
  selectedTrack.value = track
  showPlaylistModal.value = true
  await fetchUserPlaylists()
}

// Close playlist modal
const closePlaylistModal = () => {
  showPlaylistModal.value = false
  selectedTrack.value = null
}

// Add track to playlist
const addToPlaylist = async (playlistId) => {
  if (!selectedTrack.value?.uri) return
  
  const success = await addTrackToPlaylist(playlistId, selectedTrack.value.uri)
  if (success) {
    closePlaylistModal()
    // Show success message or notification here if desired
  }
}

// Clear any existing search results
onMounted(() => {
  resetResults()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 