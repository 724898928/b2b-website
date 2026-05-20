<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">{{ settingsStore.settings.site_name }}</router-link>
      <div class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul class="nav-menu" :class="{ active: isMenuOpen }">
        <li><router-link to="/" class="nav-link" @click="closeMenu">Home</router-link></li>
        <li><router-link to="/products" class="nav-link" @click="closeMenu">Products</router-link></li>
        <li><router-link to="/about" class="nav-link" @click="closeMenu">About</router-link></li>
        <li><router-link to="/contact" class="nav-link" @click="closeMenu">Contact</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', (event) => {
    const menuToggle = document.querySelector('.menu-toggle')
    const navMenu = document.querySelector('.nav-menu')
    
    if (menuToggle && navMenu && 
        !menuToggle.contains(event.target) && 
        !navMenu.contains(event.target)) {
      isMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (min-width: 1920px) {
  .nav-container {
    max-width: 1600px;
    padding: 1.5rem 3rem;
  }
}

@media (min-width: 2560px) {
  .nav-container {
    max-width: 1800px;
    padding: 1.75rem 4rem;
  }
}

.logo {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.02);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  font-size: 1.05rem;
  transition: color 0.3s;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
}

.menu-toggle span {
  width: 28px;
  height: 3px;
  background: var(--text-dark);
  border-radius: 2px;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem 1.5rem;
  }

  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background-color: white;
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0,0,0,0.1);
    padding: 2rem 0;
    gap: 1.5rem;
  }

  .nav-menu.active {
    left: 0;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
