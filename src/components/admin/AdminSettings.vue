<template>
  <div class="tab-content">
    <h2 class="section-title">{{ t('admin.settings.websiteSettings') }}</h2>

    <div class="settings-container">
      <!-- Basic Information -->
      <div class="settings-section">
        <h3 class="settings-section-title">{{ t('admin.settings.basicInfo') }}</h3>
        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.websiteName') }}</label>
          <input v-model="settingsForm.site_name" type="text" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.websiteDescription') }}</label>
          <textarea v-model="settingsForm.site_description" class="form-textarea" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.companyIntro') }}</label>
          <textarea v-model="settingsForm.company_intro" class="form-textarea" rows="5"></textarea>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="settings-section">
        <h3 class="settings-section-title">{{ t('admin.settings.contactInfo') }}</h3>
        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.email') }}</label>
          <input v-model="settingsForm.email" type="email" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.phone') }}</label>
          <input v-model="settingsForm.phone" type="tel" class="form-input">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.address') }}</label>
          <input v-model="settingsForm.address" type="text" class="form-input">
        </div>
      </div>

      <!-- Social Media Links -->
      <div class="settings-section">
        <h3 class="settings-section-title">{{ t('admin.settings.socialMedia') }}</h3>
        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.linkedinUrl') }}</label>
          <input v-model="settingsForm.linkedin" type="url" class="form-input" placeholder="https://linkedin.com/company/yourcompany">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.facebookUrl') }}</label>
          <input v-model="settingsForm.facebook" type="url" class="form-input" placeholder="https://facebook.com/yourcompany">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.settings.twitterUrl') }}</label>
          <input v-model="settingsForm.twitter" type="url" class="form-input" placeholder="https://twitter.com/yourcompany">
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="settings-actions">
        <button @click="saveSettings" class="btn btn-primary" :disabled="isSaving">
          {{ isSaving ? t('admin.settings.saving') : t('admin.settings.saveSettings') }}
        </button>
        <button @click="resetSettings" class="btn btn-warning">{{ t('admin.settings.reset') }}</button>
      </div>

      <div v-if="settingsStatus" :class="['notification', settingsStatus.type]">
        {{ settingsStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../../stores/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const isSaving = ref(false)
const settingsStatus = ref(null)

const settingsForm = reactive({
  site_name: '',
  site_description: '',
  company_intro: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  facebook: '',
  twitter: ''
})

onMounted(() => {
  Object.assign(settingsForm, settingsStore.settings)
})

const saveSettings = async () => {
  isSaving.value = true
  settingsStatus.value = null

  try {
    await settingsStore.updateSettings(settingsForm)
    settingsStatus.value = {
      type: 'success',
      message: t('admin.settings.saveSuccess')
    }

    setTimeout(() => {
      settingsStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Error saving settings:', error)
    settingsStatus.value = {
      type: 'error',
      message: t('admin.settings.saveError')
    }
  } finally {
    isSaving.value = false
  }
}

const resetSettings = () => {
  Object.assign(settingsForm, settingsStore.settings)
  settingsStatus.value = {
    type: 'success',
    message: t('admin.settings.resetSuccess')
  }
  setTimeout(() => {
    settingsStatus.value = null
  }, 2000)
}
</script>

<style scoped>
.tab-content {
  width: 100%;
  max-width: 100%;
}

.section-title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.settings-container {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.settings-section:last-of-type {
  border-bottom: none;
}

.settings-section-title {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}
</style>