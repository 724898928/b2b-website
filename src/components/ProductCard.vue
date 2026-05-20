<template>
  <div class="product-card card">
    <div class="product-image-wrapper">
      <img
        :src="product.image_url || '/images/placeholder.jpg'"
        :alt="product.name"
        class="card-image"
        @error="handleImageError"
      >
      <div v-if="product.is_featured" class="featured-badge">
        <span>⭐ Featured</span>
      </div>
      <div v-if="product.category" class="category-overlay">
        <span class="badge badge-primary">{{ product.category }}</span>
      </div>
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ product.name }}</h3>
      <p class="card-description">{{ product.description || 'No description available' }}</p>

      <div class="card-footer">
        <slot name="actions">
          <router-link :to="`/products/${product.id}`" class="btn btn-primary btn-full">
            View Details
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/600x400?text=Product+Image'
}
</script>

<style scoped>
.product-card {
  position: relative;
  overflow: hidden;
}

.product-image-wrapper {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
}

.card-image {
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .card-image {
  transform: scale(1.08);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  z-index: 2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.category-overlay {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 2;
}

.card-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 1.375rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.card-description {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
}

.card-footer {
  margin-top: auto;
}

.btn-full {
  width: 100%;
  justify-content: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .card-image {
    height: 220px;
  }

  .card-content {
    padding: 1.5rem;
  }
}
</style>
