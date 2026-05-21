<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-logo">B2B Admin</h2>
    </div>
    <nav class="sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.id"
        :class="['nav-item', { active: activeTab === item.id }]"
        @click="$emit('navigate', item)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ t(item.key) }}</span>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  navItems: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['navigate'])
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f59e0b;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
  gap: 0.75rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid #3b82f6;
}

.nav-icon {
  font-size: 1.125rem;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}
</style>