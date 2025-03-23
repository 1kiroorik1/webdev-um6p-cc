import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import JobDetailsView from '../views/JobDetailsView.vue';
import JobFormView from '../views/JobFormView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/job/:id',
    name: 'job-details',
    component: JobDetailsView,
    props: true
  },
  {
    path: '/job/add',
    name: 'job-add',
    component: JobFormView
  },
  {
    path: '/job/edit/:id',
    name: 'job-edit',
    component: JobFormView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;