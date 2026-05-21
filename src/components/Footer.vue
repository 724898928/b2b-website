<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>{{ settingsStore.settings.site_description }}</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>Email: {{ settingsStore.settings.email }}</li>
            <li>Phone: {{ settingsStore.settings.phone }}</li>
            <li>Address: {{ settingsStore.settings.address }}</li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <ul>
            <li v-if="settingsStore.settings.linkedin !== '#'">
              <a :href="settingsStore.settings.linkedin" target="_blank">LinkedIn</a>
            </li>
            <li v-if="settingsStore.settings.facebook !== '#'">
              <a :href="settingsStore.settings.facebook" target="_blank">Facebook</a>
            </li>
            <li v-if="settingsStore.settings.twitter !== '#'">
              <a :href="settingsStore.settings.twitter" target="_blank">Twitter</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">&copy; {{ currentYear }} {{ settingsStore.settings.site_name }}. All rights reserved.</p>
        <router-link to="/admin" class="admin-link">Admin Login</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<style scoped>
.footer {
  background: var(--text-dark);
  color: white;
  padding: 4rem 0 2rem;
  margin-top: 5rem;
}

@media (min-width: 1920px) {
  .footer {
    padding: 5rem 0 2.5rem;
    margin-top: 6rem;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

@media (min-width: 1920px) {
  .footer-grid {
    gap: 4rem;
  }
}

.footer-section h3 {
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.footer-section p {
  color: #9ca3af;
  line-height: 1.7;
  font-size: 0.95rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.875rem;
  color: #9ca3af;
  font-size: 0.95rem;
}

.footer-section a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.copyright {
  color: #9ca3af;
  font-size: 0.95rem;
  margin: 0;
  flex: 1;
  text-align: center;
}

.admin-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
  position: absolute;
  right: 0;
}

.admin-link:hover {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
    margin-top: 4rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    position: relative;
  }

  .admin-link {
    position: static;
    margin-top: 1rem;
  }
}
</style>
