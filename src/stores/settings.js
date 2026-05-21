import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    site_name: 'GlobalMart',
    site_description: 'Your trusted partner for high-quality industrial products and innovative solutions worldwide',
    company_intro: 'We are a leading manufacturer and supplier of high-quality industrial products. With over 20 years of experience, we serve clients across the globe with innovative solutions and exceptional customer service.',
    email: '724898928li@gmail.com',
    phone: '+86 18717376759',
    address: '123 Business St, City, Country',
    linkedin: '#',
    facebook: 'https://www.facebook.com/share/1HHrV3zUg7/',
    twitter: '#'
  })

  const isLoading = ref(false)
  const isInitialized = ref(false)

  async function loadSettings() {
    // 如果已经初始化过，直接返回
    if (isInitialized.value) {
      return
    }
    
    isLoading.value = true
    try {
      const response = await api.get('/settings')
      if (response.data.success) {
        settings.value = { ...settings.value, ...response.data.data }
      }
    } catch (error) {
      console.warn('Using default settings (API unavailable):', error.message)
      // 即使API失败，也使用默认值，不会清空页面
    } finally {
      isLoading.value = false
      isInitialized.value = true
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
    isInitialized,
    loadSettings,
    updateSettings
  }
})
