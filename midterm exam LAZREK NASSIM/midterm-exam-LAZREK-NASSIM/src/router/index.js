import { createRouter, createWebHistory } from 'vue-router'
import Library from '../views/Library.vue'

const routes = [
  {
    path: '/',
    name: 'Library',
    component: Library
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router