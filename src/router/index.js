import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import PlaniView from '@/views/PlaniView.vue'
import LoginView from '@/views/LoginView.vue'
import BasicView from '@/views/BasicView.vue'
import ProplanView from '@/views/ProplanView.vue'
import ProplusView from '@/views/ProplusView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import ProgrammView from '@/views/ProgrammView.vue'
// Lazy loading for better performance
import AdminView from '@/views/AdminView.vue';
import BodyweightExercisesView from '@/views/BodyweightExercisesView.vue';
import GymExercisesView from '@/views/GymExercisesView.vue';
import RunningView from '@/views/RunningView.vue';
import TablesView from '@/views/TablesView.vue';
import AboutView from '@/views/AboutView.vue';


import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:5000'

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
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/plans',
      name: 'plans',
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
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/programm',
      name: 'programm',
      component: ProgrammView,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/bexercises',
      name: 'BodyweightExercises',
      component: () => import('@/views/BodyweightExercisesView.vue')
    },
    {
      path: '/g',
      name: 'GymExercises',
      component: () => import('@/views/GymExercisesView.vue')
    },
    {
      path: '/running',
      name: 'Running',
      component: () => import('@/views/RunningView.vue')
    },
    {
      path: '/tables',
      name: 'Tables',
      component: () => import('@/views/TablesView.vue')
    },
    {
      path: '/code-overview',
      name: 'CodeOverview',
      component: () => import('@/views/CodeOverviewView.vue')
    }
  ],
})




export default router