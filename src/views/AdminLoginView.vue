<template>
  <div>
    <!-- Page Header -->
    <section class="hero" style="padding: 3rem 2rem;">
      <div class="container">
        <h1>Admin Login</h1>
        <p>Please sign in to access the admin dashboard</p>
      </div>
    </section>

    <!-- Login Form -->
    <section class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <div style="max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              v-model="loginForm.username"
              type="text" 
              class="form-input" 
              required
              placeholder="Enter your username"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              v-model="loginForm.password"
              type="password" 
              class="form-input" 
              required
              placeholder="Enter your password"
            >
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isLoggingIn">
            {{ isLoggingIn ? 'Signing in...' : 'Sign In' }}
          </button>
          
          <div v-if="loginError" class="notification error" style="margin-top: 1rem;">
            {{ loginError }}
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

const router = useRouter()
const isLoggingIn = ref(false)
const loginError = ref('')

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  isLoggingIn.value = true
  loginError.value = ''
  
  try {
    const response = await api.post('/admin/login', loginForm)
    
    if (response.data.success && response.data.token) {
      // Store token
      localStorage.setItem('admin_token', response.data.token)
      
      // Redirect to dashboard
      router.push('/admin/dashboard')
    } else {
      loginError.value = 'Invalid username or password'
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = error.response?.data?.error || 'Login failed. Please try again.'
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<style scoped>
.notification {
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.notification.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}
</style>
