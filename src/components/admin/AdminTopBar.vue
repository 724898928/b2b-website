<template>
  <header class="top-bar">
    <div class="top-bar-left">
      <h1 class="page-title">{{ t('admin.dashboard.title') }}</h1>
      <div class="user-info">
        <span class="welcome-text">{{ t('admin.dashboard.welcomeBack') }}, Admin</span>
        <span class="admin-badge">{{ t('admin.dashboard.superAdmin') }}</span>
      </div>
    </div>
    <div class="top-bar-right">
      <button @click="$emit('preview')" class="btn btn-primary">{{ t('admin.dashboard.preview') }}</button>
      <button @click="$emit('logout')" class="btn btn-warning">{{ t('admin.dashboard.logout') }}</button>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineEmits(['preview', 'logout'])
</script>

<style scoped>
.top-bar {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.top-bar-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.welcome-text {
  font-size: 0.875rem;
  color: #64748b;
}

.admin-badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.top-bar-right {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 1rem;
  }
}
</style>