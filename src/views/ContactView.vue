<template>
  <div>
    <!-- Page Header -->
    <section class="hero" style="padding: 3rem 2rem;">
      <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch with our team</p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto;">
        <!-- Contact Information -->
        <div>
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--primary-color);">Contact Information</h2>
          
          <div style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 1.5rem; margin-right: 1rem;">📧</span>
              <div>
                <strong>Email</strong>
                <p style="color: var(--text-light);">{{ settingsStore.settings.email }}</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 1.5rem; margin-right: 1rem;">📞</span>
              <div>
                <strong>Phone</strong>
                <p style="color: var(--text-light);">{{ settingsStore.settings.phone }}</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center;">
              <span style="font-size: 1.5rem; margin-right: 1rem;">📍</span>
              <div>
                <strong>Address</strong>
                <p style="color: var(--text-light);">{{ settingsStore.settings.address }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--primary-color);">Business Hours</h3>
            <p style="color: var(--text-light);">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p style="color: var(--text-light);">Saturday: 10:00 AM - 4:00 PM</p>
            <p style="color: var(--text-light);">Sunday: Closed</p>
          </div>
        </div>
        
        <!-- Contact Form -->
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--primary-color);">Send us a Message</h2>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input 
                v-model="formData.name"
                type="text" 
                class="form-input" 
                required
                placeholder="Your name"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input 
                v-model="formData.email"
                type="email" 
                class="form-input" 
                required
                placeholder="your@email.com"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input 
                v-model="formData.phone"
                type="tel" 
                class="form-input" 
                placeholder="Your phone number"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Subject *</label>
              <input 
                v-model="formData.subject"
                type="text" 
                class="form-input" 
                required
                placeholder="Message subject"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">Message *</label>
              <textarea 
                v-model="formData.message"
                class="form-textarea" 
                required
                rows="5"
                placeholder="Your message..."
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
          
          <div v-if="submitStatus" :class="['notification', submitStatus.type]" style="margin-top: 1rem;">
            {{ submitStatus.message }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import api from '../utils/api'

const settingsStore = useSettingsStore()
const isSubmitting = ref(false)
const submitStatus = ref(null)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

const handleSubmit = async () => {
  // Validate email
  if (!validateEmail(formData.email)) {
    submitStatus.value = {
      type: 'error',
      message: 'Please enter a valid email address'
    }
    return
  }
  
  isSubmitting.value = true
  submitStatus.value = null
  
  try {
    const response = await api.post('/inquiries', formData)
    
    if (response.data.success) {
      submitStatus.value = {
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We will get back to you soon.'
      }
      
      // Reset form
      formData.name = ''
      formData.email = ''
      formData.phone = ''
      formData.subject = ''
      formData.message = ''
      
      // Clear status after 5 seconds
      setTimeout(() => {
        submitStatus.value = null
      }, 5000)
    }
  } catch (error) {
    console.error('Error sending inquiry:', error)
    submitStatus.value = {
      type: 'error',
      message: 'Sorry, there was an error sending your message. Please try again later.'
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<style scoped>
.notification {
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.notification.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.notification.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

@media (max-width: 768px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
</style>
