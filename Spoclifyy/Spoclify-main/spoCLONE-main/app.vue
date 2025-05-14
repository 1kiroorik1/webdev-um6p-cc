<template>
  <div>
    <NuxtLayout v-if="isAuthenticated">
      <NuxtPage />
    </NuxtLayout>
    <NuxtPage v-else />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const { isAuthenticated } = useAuth()
const route = useRoute()
const router = useRouter()

// Redirect to login if not authenticated and not on login/callback page
watch(() => route.path, (path) => {
  if (!isAuthenticated && path !== '/' && path !== '/callback') {
    navigateTo('/')
  }
}, { immediate: true })

// Handle Chrome DevTools warning
router.beforeEach((to, from, next) => {
  if (to.path === '/.well-known/appspecific/com.chrome.devtools.json') {
    next('/')
  } else {
    next()
  }
})
</script>
