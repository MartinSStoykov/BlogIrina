<template>
  <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
    <RouterLink to="/admin/posts" class="btn-secondary" style="padding:0.4rem 0.8rem;">←</RouterLink>
    <h2 class="admin-page-title" style="margin:0">{{ isEdit ? 'Редактирай статия' : 'Нова статия' }}</h2>
  </div>

  <div class="admin-form">
    <div class="form-row">
      <label>Заглавие *</label>
      <input v-model="form.title" type="text" placeholder="Въведи заглавие..." />
    </div>

    <div class="form-2col">
      <div class="form-row">
        <label>Категория *</label>
        <select v-model="form.category">
          <option value="">Избери категория</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="form-row">
        <label>Дата</label>
        <input v-model="form.date" type="date" />
      </div>
    </div>

    <div class="form-row">
      <label>Кратко описание (excerpt)</label>
      <input v-model="form.excerpt" type="text" placeholder="Кратко описание за листата..." />
    </div>

    <!-- ── Снимки ── -->
    <div class="form-row">
      <label>Снимки <span style="font-weight:400;color:#aaa;font-size:0.82rem">(може да добавиш няколко)</span></label>

      <div class="img-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          style="display:none"
          @change="handleImages"
        />
        <div class="img-upload-placeholder">
          <span class="upload-icon">🖼</span>
          <span v-if="!uploading">Кликни или пусни снимки тук</span>
          <span v-else>Качва се... ({{ uploadProgress }}/{{ uploadTotal }})</span>
        </div>
      </div>

      <!-- Превю на качените снимки -->
      <div v-if="form.images.length > 0" class="img-thumbs">
        <div
          v-for="(img, idx) in form.images"
          :key="img"
          class="img-thumb-wrap"
          :class="{ 'is-main': idx === 0 }"
        >
          <img :src="imageUrl(img)" class="img-thumb" :alt="`Снимка ${idx+1}`" />
          <div class="img-thumb-actions">
            <button v-if="idx > 0" class="thumb-btn" title="Направи главна" @click="makeMain(idx)">★</button>
            <button class="thumb-btn danger" title="Премахни" @click="removeImage(idx)">✕</button>
          </div>
          <div v-if="idx === 0" class="main-badge">Главна</div>
        </div>
      </div>
    </div>

    <div class="form-row">
      <label>Съдържание *</label>
      <textarea v-model="form.content" placeholder="Напиши статията тук..."></textarea>
    </div>

    <div class="form-actions">
      <button class="btn-primary" :disabled="saving || uploading" @click="save">
        {{ saving ? 'Запазва...' : (isEdit ? 'Запази промените' : 'Публикувай статията') }}
      </button>
      <RouterLink to="/admin/posts" class="btn-secondary">Откажи</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, imageUrl } from '../composables/useApi.js'

const route = useRoute()
const router = useRouter()
const { showToast } = inject('toast')

const isEdit = computed(() => !!route.params.id)
const categories = ref([])
const saving = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadTotal = ref(0)
const fileInputRef = ref(null)

const form = reactive({
  title: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  content: '',
  images: [],   // масив от URL-и
  image: '',    // главната (първата)
})

onMounted(async () => {
  categories.value = await api.getCategories()
  if (isEdit.value) {
    const post = await api.getPost(route.params.id)
    form.title    = post.title
    form.category = post.category
    form.date     = post.date
    form.excerpt  = post.excerpt || ''
    form.content  = post.content
    // Поддържаме и стария формат (само 1 снимка) и новия (масив)
    if (post.images && post.images.length > 0) {
      form.images = post.images
    } else if (post.image) {
      form.images = [post.image]
    } else {
      form.images = []
    }
    form.image = form.images[0] || ''
  }
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function handleImages(e) {
  const files = Array.from(e.target.files)
  if (!files.length) return
  await uploadFiles(files)
  e.target.value = '' // reset за да може да се качват същите файлове пак
}

function handleDrop(e) {
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (files.length) uploadFiles(files)
}

async function uploadFiles(files) {
  uploading.value = true
  uploadProgress.value = 0
  uploadTotal.value = files.length
  for (const file of files) {
    try {
      const data = await api.uploadImage(file)
      form.images.push(data.url)
      form.image = form.images[0]
    } catch {
      showToast(`Грешка при качване на ${file.name}`, 'error')
    }
    uploadProgress.value++
  }
  uploading.value = false
}

function removeImage(idx) {
  form.images.splice(idx, 1)
  form.image = form.images[0] || ''
}

function makeMain(idx) {
  const [img] = form.images.splice(idx, 1)
  form.images.unshift(img)
  form.image = form.images[0]
}

async function save() {
  if (!form.title.trim() || !form.category || !form.content.trim()) {
    showToast('Попълни заглавие, категория и съдържание!', 'error')
    return
  }
  saving.value = true
  try {
    const payload = { ...form, image: form.images[0] || '', images: form.images }
    if (isEdit.value) {
      await api.updatePost(route.params.id, payload)
      showToast('Статията е обновена!')
    } else {
      await api.createPost(payload)
      showToast('Статията е публикувана!')
    }
    router.push('/admin/posts')
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ── Upload area ── */
.img-upload-area {
  border: 2px dashed #f0a0c0;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  margin-bottom: 1rem;
}
.img-upload-area:hover {
  background: #fff0f5;
  border-color: #e0559a;
}
.img-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: #c06080;
  font-size: 0.9rem;
}
.upload-icon { font-size: 1.8rem; }

/* ── Thumbs grid ── */
.img-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.img-thumb-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #eee;
  transition: border-color 0.2s;
}
.img-thumb-wrap.is-main {
  border-color: #e0559a;
}
.img-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.img-thumb-actions {
  position: absolute;
  top: 0; right: 0;
  display: flex;
  gap: 2px;
  padding: 3px;
  opacity: 0;
  transition: opacity 0.15s;
}
.img-thumb-wrap:hover .img-thumb-actions {
  opacity: 1;
}
.thumb-btn {
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.thumb-btn:hover { background: #fff; }
.thumb-btn.danger:hover { background: #ffe0e8; color: #c00; }
.main-badge {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(224,85,154,0.85);
  color: #fff;
  font-size: 0.65rem;
  text-align: center;
  padding: 2px 0;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
