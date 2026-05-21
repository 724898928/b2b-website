<template>
  <div>
    <!-- Page Header -->
    <section class="hero" style="padding: 3rem 2rem;">
      <div class="container">
        <h1>{{ t('contact.title') }}</h1>
        <p>{{ t('contact.subtitle') }}</p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto;">
        <!-- Contact Information -->
        <div>
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--primary-color);">{{ t('contact.contactInfo') }}</h2>
          
          <div style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 1.5rem; margin-right: 1rem;">📧</span>
              <div>
                <strong>{{ t('contact.yourEmail') }}</strong>
                <p style="color: var(--text-light);">{{ settingsStore.settings.email }}</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 1.5rem; margin-right: 1rem;">📞</span>
              <div>
                <strong>{{ t('contact.yourPhone') }}</strong>
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
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--primary-color);">{{ t('contact.businessHours') }}</h3>
            <p style="color: var(--text-light);">{{ t('contact.hoursWeekday') }}</p>
            <p style="color: var(--text-light);">{{ t('contact.hoursSaturday') }}</p>
            <p style="color: var(--text-light);">{{ t('contact.hoursSunday') }}</p>
          </div>
        </div>
        
        <!-- Contact Form -->
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--primary-color);">{{ t('contact.sendMessage') }}</h2>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label">{{ t('contact.yourName') }} *</label>
              <input 
                v-model="formData.name"
                type="text" 
                class="form-input" 
                required
                :placeholder="t('contact.namePlaceholder')"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ t('contact.yourEmail') }} *</label>
              <input 
                v-model="formData.email"
                type="email" 
                class="form-input" 
                required
                placeholder="your@email.com"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ t('contact.yourPhone') }}</label>
              <input 
                v-model="formData.phone"
                type="tel" 
                class="form-input" 
                :placeholder="t('contact.phonePlaceholder')"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ t('contact.subject') }} *</label>
              <input 
                v-model="formData.subject"
                type="text" 
                class="form-input" 
                required
                :placeholder="t('contact.subjectPlaceholder')"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ t('contact.yourMessage') }} *</label>
              <textarea 
                v-model="formData.message"
                class="form-textarea" 
                required
                rows="5"
                :placeholder="t('contact.messagePlaceholder')"
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isSubmitting">
              {{ isSubmitting ? t('contact.sending') : t('contact.submit') }}
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
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'
import api from '../utils/api'

const { t } = useI18n()
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
      message: t('contact.invalidEmail')
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
        message: t('contact.successMessage')
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
      message: t('contact.errorMessage')
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
