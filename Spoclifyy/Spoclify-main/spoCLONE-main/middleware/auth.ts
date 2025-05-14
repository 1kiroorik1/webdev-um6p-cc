export default defineNuxtRouteMiddleware((to) => {
  // Utiliser un cache pour éviter de vérifier l'authentification trop souvent
  if (process.client) {
    const lastCheckTime = parseInt(sessionStorage.getItem('auth_last_check') || '0')
    const now = Date.now()
    
    // Si on a vérifié l'authentification récemment (moins de 5 secondes), utiliser le résultat précédent
    if (now - lastCheckTime < 5000) {
      const wasAuthenticated = sessionStorage.getItem('auth_status') === 'true'
      
      // Liste des routes protégées
      const protectedRoutes = ['/search', '/playlist', '/profile']
      
      // Vérifier si la route actuelle est protégée
      const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
      
      if (isProtectedRoute && !wasAuthenticated) {
        // Rediriger vers la page d'accueil si on essaie d'accéder à une route protégée sans être authentifié
        return navigateTo('/')
      }
      
      return
    }
    
    // Si on n'a pas vérifié récemment, faire la vérification
    const { isAuthenticated } = useAuth()
    const authenticated = isAuthenticated()
    
    // Stocker le résultat pour les prochaines vérifications
    sessionStorage.setItem('auth_last_check', now.toString())
    sessionStorage.setItem('auth_status', authenticated.toString())
    
    // Liste des routes protégées
    const protectedRoutes = ['/search', '/playlist', '/profile']
    
    // Vérifier si la route actuelle est protégée
    const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
    
    if (isProtectedRoute && !authenticated) {
      // Rediriger vers la page d'accueil si on essaie d'accéder à une route protégée sans être authentifié
      return navigateTo('/')
    }
  } else {
    const { isAuthenticated } = useAuth()
    const authenticated = isAuthenticated()
    
    // Liste des routes protégées
    const protectedRoutes = ['/search', '/playlist', '/profile']
    
    // Vérifier si la route actuelle est protégée
    const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
    
    if (isProtectedRoute && !authenticated) {
      // Rediriger vers la page d'accueil si on essaie d'accéder à une route protégée sans être authentifié
      return navigateTo('/')
    }
  }
}) 