import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import PlaniView from '@/views/PlaniView.vue'
import LoginView from '@/views/LoginView.vue'
import BasicView from '@/views/BasicView.vue'
import ProplanView from '@/views/ProplanView.vue'
import ProplusView from '@/views/ProplusView.vue'
import ProgrammView from '@/views/ProgrammView.vue'
import WorkoutView from '@/views/WorkoutView.vue'
import DipWorkoutView from '@/views/DipWorkoutView.vue'
import SquatView from '@/views/SquatView.vue'
import AdminView from '../views/AdminView.vue';
import BodyweightExercisesView from '../views/BodyweightExercisesView.vue'  


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
      path: '/programm',
      name: 'programm',
      component: ProgrammView,
    },
    {
      path: '/workout',
      name: 'WorkoutView',
      component: WorkoutView,
    },
    {
      path: '/dipworkout',
      name: 'DipWorkoutView',
      component: DipWorkoutView,
    },
    {
      path: '/squatview',
      name: 'SquatView',
      component: SquatView
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView
    },
    {
      path: '/bexercises',
      name: 'BodyweightExercises',
      component: BodyweightExercisesView
    }
  ],
})




export default router