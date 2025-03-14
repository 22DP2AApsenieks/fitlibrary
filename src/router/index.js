import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import PlaniView from '@/views/PlaniView.vue'
import LoginView from '@/views/LoginView.vue'
import BasicView from '@/views/BasicView.vue'
import ProplanView from '@/views/ProplanView.vue'
import ProplusView from '@/views/ProplusView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'index sadoasidad',
      component: SignupView,
    },
    {

      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/plans',
      name: 'Plans',
      component: PlaniView,

    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,

    },
    {
      path: '/basic',
      name: 'basic',
      component: BasicView,
    },
    {
      path: '/pro',
      name: 'pro',
      component: ProplanView,
    },
    {
      path: '/proplus',
      name: 'proplus',
      component: ProplusView,
    }
  ],
})

export default router