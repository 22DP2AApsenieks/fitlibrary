<template>
    <div class="flex min-h-screen items-center justify-center bg-black text-white">
      <div class="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center">Reģistrējies, lai sāktu klausīties</h2>
        <form @submit.prevent="login">
          <label class="block text-sm font-medium">E-pasta adrese</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full p-3 mt-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            class="w-full mt-4 p-3 bg-green-500 rounded text-black font-bold hover:bg-green-600"
          >
            Nākamais
          </button>
        </form>
        <div class="flex items-center justify-center space-x-2 mt-4">
          <div class="h-px w-full bg-gray-600"></div>
          <span class="text-gray-400">vai</span>
          <div class="h-px w-full bg-gray-600"></div>
        </div>
        <div class="space-y-3">
          <button class="w-full flex items-center justify-center p-3 bg-gray-700 rounded hover:bg-gray-600">
            <span class="mr-2">🔵</span> Reģistrēties ar Google
          </button>
          <button class="w-full flex items-center justify-center p-3 bg-gray-700 rounded hover:bg-gray-600">
            <span class="mr-2">🔵</span> Reģistrēties ar Facebook
          </button>
          <button class="w-full flex items-center justify-center p-3 bg-gray-700 rounded hover:bg-gray-600">
            <span class="mr-2">🍏</span> Reģistrēties ar Apple
          </button>
        </div>
        <p class="text-center text-gray-400">
          Vai tev jau ir konts? <a href="#" class="text-green-400 hover:underline">Piesakies šeit.</a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: ""
      };
    },
    methods: {
      login() {
        alert(`Logging in with ${this.email}`);
      }
    }
  };
  </script>
  
  <style scoped>
  </style>