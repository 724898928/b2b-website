import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    site_name: 'B2B Product Exhibition',
    site_description: 'Your trusted partner for high-quality industrial products and innovative solutions worldwide',
    company_intro: '',
    email: 'info@example.com',
    phone: '+1 234 567 8900',
    address: '123 Business St, City, Country',
    linkedin: '#',
    facebook: '#',
    twitter: '#'
  })

  const isLoading = ref(false)

  async function loadSettings() {
    isLoading.value = true
    try {
      const response = await api.get('/settings')
      if (response.data.success) {
        settings.value = { ...settings.value, ...response.data.data }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function updateSettings(newSettings) {
    try {
      const response = await api.put('/settings', newSettings)
      if (response.data.success) {
        settings.value = { ...settings.value, ...newSettings }
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  return {
    settings,
    isLoading,
    loadSettings,
    updateSettings
  }
})
