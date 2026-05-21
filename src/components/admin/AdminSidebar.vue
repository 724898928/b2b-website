<template>
  <aside :class="['sidebar', { collapsed: collapsed }]">
    <div class="sidebar-header">
      <h2 v-if="!collapsed" class="sidebar-logo">B2B Admin</h2>
      <button class="collapse-btn" @click="$emit('toggleCollapse')" :title="collapsed ? '展开侧边栏' : '折叠侧边栏'">
        <span class="collapse-icon">{{ collapsed ? '▶' : '◀' }}</span>
      </button>
    </div>
    <nav class="sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.id"
        :class="['nav-item', { active: activeTab === item.id }]"
        @click="$emit('navigate', item)"
        :title="collapsed ? t(item.key) : ''"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span v-if="!collapsed" class="nav-label">{{ t(item.key) }}</span>
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
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['navigate', 'toggleCollapse'])
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
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1.25rem 0.5rem;
}

.sidebar-logo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f59e0b;
  white-space: nowrap;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.sidebar.collapsed .collapse-btn {
  width: 32px;
  height: 32px;
}

.collapse-icon {
  font-size: 0.7rem;
  line-height: 1;
}

.sidebar-nav {
  flex: 1;
  padding: 0.5rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
  gap: 0.75rem;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem 0;
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
  flex-shrink: 0;
  width: 1.375rem;
  text-align: center;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
}

</style>