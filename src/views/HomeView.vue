<template>
  <div>
    <!-- Hero Section - Modern & Bold -->
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in">
          <h1>{{ settingsStore.settings.site_name }}</h1>
          <p>{{ settingsStore.settings.site_description }}</p>
          <div class="hero-actions">
            <router-link to="/products" class="btn btn-secondary">
              <span>Explore Products</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
            <router-link to="/contact" class="btn btn-primary">
              Get in Touch
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Introduction -->
    <section class="section">
      <div class="container">
        <div class="intro-content">
          <h2 class="section-title">About Our Company</h2>
          <p class="section-subtitle">
            {{ settingsStore.settings.company_intro || 'We are a leading manufacturer and supplier of high-quality industrial products.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section" style="background: var(--gray-50);">
      <div class="container">
        <h2 class="section-title">Why Choose Us</h2>
        <p class="section-subtitle">Delivering excellence through innovation, quality, and customer-focused solutions</p>

        <div class="grid grid-4 features-grid">
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>Premium Quality</h3>
            <p>All products undergo strict quality control and meet international standards including ISO 9001 certification.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Global Reach</h3>
            <p>Serving customers in over 50 countries with reliable logistics, local support, and multilingual service teams.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💼</div>
            <h3>Expert Service</h3>
            <p>Professional team with decades of industry experience ready to provide customized solutions for your needs.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Efficient supply chain management ensures quick turnaround times and guaranteed on-time delivery worldwide.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <p class="section-subtitle">Discover our most popular and innovative solutions trusted by industry leaders</p>

        <div v-if="productStore.isLoading" class="spinner"></div>

        <div v-else-if="featuredProducts.length === 0" class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>No featured products available</h3>
          <p>Check back soon for our latest innovations</p>
        </div>

        <div v-else class="grid grid-3">
          <ProductCard
            v-for="product in featuredProducts.slice(0, 6)"
            :key="product.id"
            :product="product"
          />
        </div>

        <div class="view-all-container">
          <router-link to="/products" class="btn btn-primary btn-large">
            View All Products
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Transform Your Business?</h2>
          <p>Let's discuss how our solutions can help you achieve your goals</p>
          <div class="cta-actions">
            <router-link to="/contact" class="btn btn-secondary">Request a Quote</router-link>
            <router-link to="/about" class="btn btn-primary">Learn More</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const settingsStore = useSettingsStore()
const productStore = useProductStore()
const featuredProducts = ref([])

onMounted(async () => {
  await settingsStore.loadSettings()
  
  try {
    await productStore.loadFeaturedProducts()
    featuredProducts.value = productStore.featuredProducts
  } catch (error) {
    console.error('Error loading featured products:', error)
  }
})
</script>

<style scoped>
.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-content {
  max-width: 900px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.hero-actions .btn {
  min-width: 180px;
}

.intro-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.features-grid {
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: var(--radius-xl);
  text-align: center;
  transition: all var(--transition-slow);
  border: 2px solid transparent;
  box-shadow: var(--shadow-sm);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-200);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  filter: grayscale(0.2);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.feature-card p {
  color: var(--gray-600);
  line-height: 1.7;
  font-size: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-500);
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.view-all-container {
  text-align: center;
  margin-top: 3rem;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-700), var(--primary-600));
  color: white;
  padding: 5rem 2rem;
  margin-top: 4rem;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.cta-content p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero {
    min-height: 60vh;
    padding: 3rem 1.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-actions .btn {
    width: 100%;
  }
}
</style>
