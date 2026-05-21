<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2 class="modal-title">{{ editingProduct ? t('admin.productForm.editTitle') : t('admin.productForm.addTitle') }}</h2>

      <form @submit.prevent="saveProduct">
        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.productName') }} *</label>
          <input v-model="productForm.name" type="text" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.category') }}</label>
          <input v-model="productForm.category" type="text" class="form-input" :placeholder="t('admin.productForm.categoryPlaceholder')">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.description') }}</label>
          <textarea v-model="productForm.description" class="form-textarea" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.detailedDescription') }}</label>
          <textarea v-model="productForm.detailed_description" class="form-textarea" rows="5"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.specifications') }}</label>
          <textarea v-model="productForm.specifications" class="form-textarea" rows="5"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.imageUrl') }}</label>
          <input v-model="productForm.image_url" type="url" class="form-input" :placeholder="t('admin.productForm.imageUrlPlaceholder')">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.galleryImages') }}</label>
          <textarea v-model="galleryImagesText" class="form-textarea" rows="3" :placeholder="t('admin.productForm.galleryPlaceholder')"></textarea>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input v-model="productForm.is_featured" type="checkbox">
            <span>{{ t('admin.productForm.featuredProduct') }}</span>
          </label>
          <label class="checkbox-label">
            <input v-model="productForm.is_active" type="checkbox">
            <span>{{ t('admin.productForm.active') }}</span>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" @click="close" class="btn btn-secondary">{{ t('admin.productForm.cancel') }}</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            {{ isSaving ? t('admin.productForm.saving') : t('admin.productForm.save') }}
          </button>
        </div>

        <div v-if="status" :class="['notification', status.type]">
          {{ status.message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../../stores/products'

const { t } = useI18n()
const productStore = useProductStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const editingProduct = ref(null)
const isSaving = ref(false)
const status = ref(null)

const productForm = reactive({
  name: '',
  category: '',
  description: '',
  detailed_description: '',
  specifications: '',
  image_url: '',
  gallery_images: [],
  is_featured: false,
  is_active: true
})

const galleryImagesText = ref('')

// Watch for modal open/close and product changes
watch(() => props.modelValue, (visible) => {
  if (visible) {
    openModal(props.product)
  }
})

const openModal = (product = null) => {
  if (product) {
    editingProduct.value = product
    Object.assign(productForm, {
      name: product.name,
      category: product.category || '',
      description: product.description || '',
      detailed_description: product.detailed_description || '',
      specifications: product.specifications || '',
      image_url: product.image_url || '',
      gallery_images: product.gallery_images || [],
      is_featured: !!product.is_featured,
      is_active: !!product.is_active
    })

    try {
      galleryImagesText.value = typeof product.gallery_images === 'string'
        ? product.gallery_images
        : JSON.stringify(product.gallery_images || [])
    } catch {
      galleryImagesText.value = '[]'
    }
  } else {
    editingProduct.value = null
    Object.assign(productForm, {
      name: '',
      category: '',
      description: '',
      detailed_description: '',
      specifications: '',
      image_url: '',
      gallery_images: [],
      is_featured: false,
      is_active: true
    })
    galleryImagesText.value = ''
  }

  status.value = null
}

const close = () => {
  emit('update:modelValue', false)
}

const saveProduct = async () => {
  isSaving.value = true
  status.value = null

  try {
    try {
      productForm.gallery_images = galleryImagesText.value.trim()
        ? JSON.parse(galleryImagesText.value)
        : []
    } catch {
      status.value = {
        type: 'error',
        message: t('admin.productForm.invalidGalleryFormat')
      }
      isSaving.value = false
      return
    }

    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, productForm)
    } else {
      await productStore.createProduct(productForm)
    }

    status.value = {
      type: 'success',
      message: t('admin.productForm.success')
    }

    setTimeout(() => {
      close()
      emit('saved')
    }, 1500)
  } catch (error) {
    console.error('Error saving product:', error)
    status.value = {
      type: 'error',
      message: t('admin.productForm.error')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.checkbox-group {
  display: flex;
  gap: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1e293b;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}
</style>