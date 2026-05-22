<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="handleBackdropClick">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ editingProduct ? t('admin.productForm.editTitle') : t('admin.productForm.addTitle') }}</h2>
        <button type="button" @click="handleClose" class="modal-close" title="Close">&times;</button>
      </div>

      <form @submit.prevent="saveProduct">
        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.productName') }} *</label>
          <input v-model="productForm.name" type="text" class="form-input" required @input="markFormDirty">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.category') }}</label>
          <input v-model="productForm.category" type="text" class="form-input" :placeholder="t('admin.productForm.categoryPlaceholder')" @input="markFormDirty">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.description') }}</label>
          <textarea v-model="productForm.description" class="form-textarea" rows="3" @input="markFormDirty"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.detailedDescription') }}</label>
          <textarea v-model="productForm.detailed_description" class="form-textarea" rows="5" @input="markFormDirty"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.specifications') }}</label>
          <textarea v-model="productForm.specifications" class="form-textarea" rows="5" @input="markFormDirty"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.imageUrl') }}</label>
          <input v-model="productForm.image_url" type="url" class="form-input" :placeholder="t('admin.productForm.imageUrlPlaceholder')" @input="markFormDirty">
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('admin.productForm.galleryImages') }}</label>
          <textarea v-model="galleryImagesText" class="form-textarea" rows="3" :placeholder="t('admin.productForm.galleryPlaceholder')" @input="markFormDirty"></textarea>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input v-model="productForm.is_featured" type="checkbox" @change="markFormDirty">
            <span>{{ t('admin.productForm.featuredProduct') }}</span>
          </label>
          <label class="checkbox-label">
            <input v-model="productForm.is_active" type="checkbox" @change="markFormDirty">
            <span>{{ t('admin.productForm.active') }}</span>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" @click="handleClose" class="btn btn-secondary">{{ t('admin.productForm.cancel') }}</button>
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

  <!-- Unsaved changes confirmation dialog -->
  <div v-if="showConfirmDialog" class="confirm-overlay">
    <div class="confirm-dialog">
      <h3>{{ t('admin.productForm.unsavedChanges') || 'Unsaved Changes' }}</h3>
      <p>{{ t('admin.productForm.unsavedMessage') || 'You have unsaved changes. Do you want to discard them?' }}</p>
      <div class="confirm-actions">
        <button @click="cancelClose" class="btn btn-secondary">{{ t('admin.productForm.keepEditing') || 'Keep Editing' }}</button>
        <button @click="confirmClose" class="btn btn-danger">{{ t('admin.productForm.discardChanges') || 'Discard Changes' }}</button>
      </div>
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
const isFormDirty = ref(false)
const showConfirmDialog = ref(false)
const originalFormState = ref(null)

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

  // Save original state for dirty checking
  originalFormState.value = JSON.stringify({
    ...productForm,
    galleryImagesText: galleryImagesText.value
  })
  
  isFormDirty.value = false
  status.value = null
}

const markFormDirty = () => {
  if (!isFormDirty.value && originalFormState.value) {
    const currentState = JSON.stringify({
      ...productForm,
      galleryImagesText: galleryImagesText.value
    })
    isFormDirty.value = currentState !== originalFormState.value
  }
}

const handleBackdropClick = () => {
  // Only close on backdrop click if form has no changes
  if (!isFormDirty.value) {
    close()
  }
}

const handleClose = () => {
  if (isFormDirty.value) {
    showConfirmDialog.value = true
  } else {
    close()
  }
}

const cancelClose = () => {
  showConfirmDialog.value = false
}

const confirmClose = () => {
  showConfirmDialog.value = false
  close()
}

const close = () => {
  isFormDirty.value = false
  showConfirmDialog.value = false
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

    isFormDirty.value = false

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
  overflow-y: auto;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  color: #1e293b;
  transform: scale(1.1);
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

/* Form Styles */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 2.5rem;
}

.notification {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.notification.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}

.notification.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Confirm Dialog Styles */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirm-dialog {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.confirm-dialog h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.confirm-dialog p {
  margin: 0 0 1.5rem;
  color: #64748b;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>