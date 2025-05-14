import { ref } from 'vue'
import { useAuth } from './useAuth'

export const usePlaylistManagement = () => {
  const { accessToken, refreshAccessToken } = useAuth()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const userProfile = ref<any>(null)

  const handleApiError = async (response: Response, retryFn: () => Promise<any>) => {
    if (response.status === 401) {
      try {
        await refreshAccessToken()
        return retryFn()
      } catch (err) {
        error.value = 'Session expired. Please login again.'
        throw err
      }
    }
    
    const errorData = await response.json()
    error.value = errorData.error?.message || 'An error occurred'
    throw new Error(error.value)
  }

  const fetchUserProfile = async () => {
    if (!accessToken.value) {
      error.value = 'No access token available'
      return null
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })

      if (!response.ok) {
        return handleApiError(response, fetchUserProfile)
      }

      const data = await response.json()
      userProfile.value = data
      return data
    } catch (err) {
      console.error('Error fetching user profile:', err)
      error.value = 'Failed to fetch user profile'
      return null
    }
  }

  const createPlaylist = async (name: string, description?: string) => {
    if (!accessToken.value || !userProfile.value?.id) {
      error.value = 'No access token or user profile available'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${userProfile.value.id}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          public: false
        })
      })

      if (!response.ok) {
        return handleApiError(response, () => createPlaylist(name, description))
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error creating playlist:', err)
      error.value = 'Failed to create playlist'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    createPlaylist,
    fetchUserProfile,
    userProfile,
    isLoading,
    error
  }
} 