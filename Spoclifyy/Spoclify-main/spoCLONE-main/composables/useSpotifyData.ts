import { ref } from 'vue'
import { useAuth } from './useAuth'

export const useSpotifyData = () => {
  const { accessToken, refreshAccessToken } = useAuth()
  const likedSongs = ref([])
  const recentlyPlayed = ref([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastRefreshAttempt = ref(0)

  const handleApiError = async (response: Response, retryFn: () => Promise<any>) => {
    if (response.status === 401) {
      const now = Date.now()
      const timeSinceLastRefresh = now - lastRefreshAttempt.value
      
      if (timeSinceLastRefresh < 10000) {
        console.log(`Refresh attempt too soon (${timeSinceLastRefresh}ms since last attempt). Waiting...`)
        await new Promise(resolve => setTimeout(resolve, 10000 - timeSinceLastRefresh))
      }
      
      try {
        lastRefreshAttempt.value = Date.now()
        await refreshAccessToken()
        await new Promise(resolve => setTimeout(resolve, 500))
        return retryFn()
      } catch (err) {
        error.value = 'Session expired. Please login again.'
        throw err
      }
    }
    
    try {
      const errorData = await response.json()
      error.value = errorData.error?.message || 'An error occurred'
    } catch (e) {
      error.value = `HTTP error ${response.status}`
    }
    throw new Error(error.value)
  }

  const fetchLikedSongs = async () => {
    if (!accessToken.value) {
      error.value = 'No access token available'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })

      if (!response.ok) {
        return handleApiError(response, fetchLikedSongs)
      }

      const data = await response.json()
      likedSongs.value = data.items
    } catch (err) {
      console.error('Error fetching liked songs:', err)
      error.value = 'Failed to fetch liked songs'
      likedSongs.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchRecentlyPlayed = async () => {
    if (!accessToken.value) {
      error.value = 'No access token available'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })

      if (!response.ok) {
        return handleApiError(response, fetchRecentlyPlayed)
      }

      const data = await response.json()
      recentlyPlayed.value = data.items
    } catch (err) {
      console.error('Error fetching recently played:', err)
      error.value = 'Failed to fetch recently played tracks'
      recentlyPlayed.value = []
    } finally {
      isLoading.value = false
    }
  }

  const checkIfTrackIsLiked = async (trackId: string) => {
    if (!accessToken.value) return false

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })

      if (!response.ok) {
        return handleApiError(response, () => checkIfTrackIsLiked(trackId))
      }

      const data = await response.json()
      return data[0] || false
    } catch (err) {
      console.error('Error checking if track is liked:', err)
      return false
    }
  }

  const toggleLikeTrack = async (trackId: string, isCurrentlyLiked: boolean) => {
    if (!accessToken.value) {
      error.value = 'No access token available'
      return false
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: isCurrentlyLiked ? 'DELETE' : 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })

      if (!response.ok) {
        return handleApiError(response, () => toggleLikeTrack(trackId, isCurrentlyLiked))
      }

      return true
    } catch (err) {
      console.error('Error toggling track like:', err)
      error.value = 'Failed to update track like status'
      return false
    }
  }

  const addTrackToPlaylist = async (playlistId: string, trackUri: string) => {
    if (!accessToken.value) {
      error.value = 'No access token available'
      return false
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      })

      if (!response.ok) {
        return handleApiError(response, () => addTrackToPlaylist(playlistId, trackUri))
      }

      return true
    } catch (err) {
      console.error('Error adding track to playlist:', err)
      error.value = 'Failed to add track to playlist'
      return false
    }
  }

  return {
    likedSongs,
    recentlyPlayed,
    isLoading,
    error,
    fetchLikedSongs,
    fetchRecentlyPlayed,
    checkIfTrackIsLiked,
    toggleLikeTrack,
    addTrackToPlaylist
  }
} 