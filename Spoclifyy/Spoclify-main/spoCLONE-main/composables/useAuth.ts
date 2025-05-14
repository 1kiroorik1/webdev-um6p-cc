import { ref, watch } from 'vue'

// Create singleton state
const accessToken = ref('')
const refreshToken = ref('')
const isInitialized = ref(false)
const isRefreshing = ref(false)

export const useAuth = () => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  // Initialize tokens from localStorage if available
  const initializeTokens = () => {
    if (!isInitialized.value && process.client) {
      const storedAccessToken = localStorage.getItem('spotify_access_token')
      const storedRefreshToken = localStorage.getItem('spotify_refresh_token')
      console.log('Initializing tokens from localStorage:', {
        hasAccessToken: !!storedAccessToken,
        hasRefreshToken: !!storedRefreshToken
      })
      if (storedAccessToken) accessToken.value = storedAccessToken
      if (storedRefreshToken) refreshToken.value = storedRefreshToken
      isInitialized.value = true
    }
  }

  // Call initialization
  initializeTokens()

  // Watch for token changes and update localStorage
  watch(accessToken, (newToken) => {
    if (process.client && newToken) {
      console.log('Access token changed, updating localStorage')
      localStorage.setItem('spotify_access_token', newToken)
    } else if (process.client && !newToken) {
      localStorage.removeItem('spotify_access_token')
    }
  })

  watch(refreshToken, (newToken) => {
    if (process.client && newToken) {
      console.log('Refresh token changed, updating localStorage')
      localStorage.setItem('spotify_refresh_token', newToken)
    } else if (process.client && !newToken) {
      localStorage.removeItem('spotify_refresh_token')
    }
  })
  

  const refreshAccessToken = async () => {
    if (isRefreshing.value) {
      console.log('Token refresh already in progress, waiting...')
      return new Promise((resolve) => {
        const checkComplete = setInterval(() => {
          if (!isRefreshing.value) {
            clearInterval(checkComplete)
            resolve(accessToken.value)
          }
        }, 100)
      })
    }

    try {
      isRefreshing.value = true
      console.log('Attempting to refresh token...')
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken.value,
        client_id: config.public.spotifyClientId,
        client_secret: config.public.spotifyClientSecret
      })

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Token refresh failed:', {
          status: response.status,
          error: errorData
        })
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      console.log('Token refresh successful')
      
      // Update tokens
      accessToken.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }

      return data.access_token
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      throw error
    } finally {
      isRefreshing.value = false
    }
  }

  const login = () => {
    try {
      const scope = 'user-read-private user-read-email user-library-read user-library-modify playlist-read-private user-top-read user-follow-read user-follow-modify playlist-modify-public playlist-modify-private user-read-recently-played'

      // Ensure the redirect URI is properly formatted
      const redirectUri = 'http://127.0.0.1:3000/callback'

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.public.spotifyClientId,
        scope: scope,
        redirect_uri: redirectUri,
      })

      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
    } catch (err) {
      console.error('Failed to initiate login:', err)
    }
  }

  const handleCallback = async (code: string) => {
    try {
      console.log('Starting callback handling')
      const redirectUri = 'http://127.0.0.1:3000/callback'

      if (!config.public.spotifyClientId || !config.public.spotifyClientSecret) {
        throw new Error('Spotify credentials are not properly configured')
      }

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: config.public.spotifyClientId,
        client_secret: config.public.spotifyClientSecret
      })

      console.log('Token request params:', {
        redirect_uri: redirectUri,
        client_id: config.public.spotifyClientId,
      })

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      const data = await response.json()
      
      console.log('Token response status:', response.status)
      if (!response.ok) {
        console.error('Token request failed:', data)
        throw new Error(`Authentication failed: ${data.error_description || data.error || 'Unknown error'}`)
      }

      if (!data.access_token) {
        throw new Error('No access token received')
      }

      console.log('Setting tokens...')
      // Update tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token

      console.log('Authentication successful, token set:', {
        hasAccessToken: !!accessToken.value,
        hasRefreshToken: !!refreshToken.value
      })

      // Navigate to home page after successful authentication
      navigateTo('/')
    } catch (error) {
      console.error('Error during authentication:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('Logging out...')
    accessToken.value = ''
    refreshToken.value = ''
    if (process.client) {
      localStorage.removeItem('spotify_access_token')
      localStorage.removeItem('spotify_refresh_token')
    }
    navigateTo('/')
  }

  const isAuthenticated = () => {
    initializeTokens() // Ensure tokens are initialized
    const authenticated = !!accessToken.value
    console.log('Checking authentication:', { 
      authenticated,
      hasAccessToken: !!accessToken.value,
      tokenLength: accessToken.value.length
    })
    return authenticated
  }

  return {
    login,
    handleCallback,
    logout,
    isAuthenticated,
    accessToken,
    refreshToken,
    refreshAccessToken
  }
}