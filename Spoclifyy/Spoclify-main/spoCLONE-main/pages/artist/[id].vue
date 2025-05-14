<template>
  <div class="min-h-screen">
    <!-- Artist Header -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
      <div class="relative flex items-end space-x-8 p-8">
        <img 
          v-if="artist.images?.[0]?.url" 
          :src="artist.images[0].url" 
          :alt="artist.name"
          class="w-48 h-48 rounded-full object-cover shadow-2xl"
        />
        <div class="flex-1">
          <h1 class="text-5xl font-bold mb-4">{{ artist.name }}</h1>
          <p class="text-gray-400">{{ artist.followers?.total.toLocaleString() }} followers</p>
        </div>
      </div>
    </div>

    <!-- Top Tracks -->
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-6">Popular Tracks</h2>
      <div class="space-y-4">
        <div v-for="(track, index) in topTracks" :key="track.id" 
          class="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          @click="playTrack(track.uri)"
        >
          <span class="text-gray-400 w-8">{{ index + 1 }}</span>
          <img 
            v-if="track.album?.images?.[0]?.url" 
            :src="track.album.images[0].url" 
            :alt="track.name"
            class="w-12 h-12 rounded"
          />
          <div class="flex-1">
            <p class="font-medium">{{ track.name }}</p>
            <p class="text-sm text-gray-400">{{ track.album?.name }}</p>
          </div>
          <span class="text-gray-400">{{ formatDuration(track.duration_ms) }}</span>
        </div>
      </div>
    </div>

    <!-- Albums -->
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-6">Albums</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="album in albums" :key="album.id" 
          class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          @click="navigateToAlbum(album.id)"
        >
          <img 
            v-if="album.images?.[0]?.url" 
            :src="album.images[0].url" 
            :alt="album.name"
            class="w-full aspect-square object-cover rounded mb-4"
          />
          <h3 class="font-medium truncate">{{ album.name }}</h3>
          <p class="text-sm text-gray-400">{{ album.release_date?.split('-')[0] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth.js'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback.js'

/**
 * @typedef {Object} SpotifyImage
 * @property {string} url - The URL of the image
 */

/**
 * @typedef {Object} SpotifyArtist
 * @property {string} id - The artist's Spotify ID
 * @property {string} name - The artist's name
 * @property {SpotifyImage[]} images - Array of artist images
 * @property {Object} followers - Follower information
 * @property {number} followers.total - Total number of followers
 */

/**
 * @typedef {Object} SpotifyAlbum
 * @property {string} id - The album's Spotify ID
 * @property {string} name - The album's name
 * @property {SpotifyImage[]} images - Array of album cover images
 * @property {string} release_date - The album's release date
 */

/**
 * @typedef {Object} SpotifyTrack
 * @property {string} id - The track's Spotify ID
 * @property {string} name - The track's name
 * @property {string} uri - The track's Spotify URI
 * @property {number} duration_ms - Track duration in milliseconds
 * @property {SpotifyAlbum} album - The track's album
 */

const route = useRoute()
const { accessToken, refreshAccessToken } = useAuth()
const { playTrack: playSpotifyTrack } = useSpotifyPlayback()

const artist = ref({})
const topTracks = ref([])
const albums = ref([])

// Format duration from milliseconds to MM:SS
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Fetch artist details
const fetchArtist = async () => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchArtist()
      }
      throw new Error('Failed to fetch artist')
    }
    
    artist.value = await response.json()
  } catch (error) {
    console.error('Error fetching artist:', error)
  }
}

// Fetch top tracks
const fetchTopTracks = async () => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${route.params.id}/top-tracks?market=US`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchTopTracks()
      }
      throw new Error('Failed to fetch top tracks')
    }
    
    const data = await response.json()
    topTracks.value = data.tracks
  } catch (error) {
    console.error('Error fetching top tracks:', error)
  }
}

// Fetch albums
const fetchAlbums = async () => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${route.params.id}/albums?limit=20&include_groups=album,single`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchAlbums()
      }
      throw new Error('Failed to fetch albums')
    }
    
    const data = await response.json()
    albums.value = data.items
  } catch (error) {
    console.error('Error fetching albums:', error)
  }
}

// Play track
const playTrack = (uri) => {
  playSpotifyTrack(uri)
}

// Navigate to album
const navigateToAlbum = (albumId) => {
  navigateTo(`/album/${albumId}`)
}

onMounted(async () => {
  await Promise.all([
    fetchArtist(),
    fetchTopTracks(),
    fetchAlbums()
  ])
})
</script> 