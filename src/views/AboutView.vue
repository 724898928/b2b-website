<template>
  <div>
    <!-- Page Header -->
    <section class="hero" style="padding: 3rem 2rem;">
      <div class="container">
        <h1>About Us</h1>
      </div>
    </section>

    <!-- About Content -->
    <section class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 2rem; margin-bottom: 1.5rem; color: var(--primary-color); text-align: center;">
          Our Story
        </h2>
        
        <div style="line-height: 1.8; color: var(--text-light); font-size: 1.1rem;">
          <p style="margin-bottom: 1.5rem;">
            {{ settingsStore.settings.company_intro || 'We are a leading manufacturer and supplier of high-quality industrial products.' }}
          </p>
          
          <p style="margin-bottom: 1.5rem;">
            With over 20 years of experience in the industry, we have built a reputation for excellence, 
            reliability, and innovation. Our commitment to quality and customer satisfaction has made us 
            a trusted partner for businesses worldwide.
          </p>
          
          <h3 style="font-size: 1.5rem; margin: 2rem 0 1rem; color: var(--primary-color);">Our Mission</h3>
          <p style="margin-bottom: 1.5rem;">
            To provide high-quality products and exceptional service that help our clients achieve their 
            business goals. We believe in building long-term partnerships based on trust, transparency, 
            and mutual success.
          </p>
          
          <h3 style="font-size: 1.5rem; margin: 2rem 0 1rem; color: var(--primary-color);">Our Values</h3>
          <ul style="list-style: disc; padding-left: 2rem; margin-bottom: 1.5rem;">
            <li style="margin-bottom: 0.5rem;">Quality Excellence</li>
            <li style="margin-bottom: 0.5rem;">Customer Focus</li>
            <li style="margin-bottom: 0.5rem;">Innovation & Continuous Improvement</li>
            <li style="margin-bottom: 0.5rem;">Integrity & Transparency</li>
            <li style="margin-bottom: 0.5rem;">Sustainability</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.loadSettings()
})
</script>
