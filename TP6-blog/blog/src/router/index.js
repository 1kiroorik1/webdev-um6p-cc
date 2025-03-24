import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/search"
  },
  {
    path: "/search",
    name: "search",
    component: HomeView
  },
  {
    path: "/create",
    name: "create",
    component: () =>
      import("../views/CreatePostView.vue"),
  },
  {
    path: "/edits",
    name: "editAll",
    component: () =>
      import("../views/EditPosts.vue"),
  },
  {
    path: "/edit/:id",
    name: "edit",
    component: () =>
      import("../views/EditPostView.vue"),
  },
  {
    path: "/post/:id",
    name: "post",
    component: () =>
      import("../views/PostDetailView.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: () =>
      import("../views/NotFoundView.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
