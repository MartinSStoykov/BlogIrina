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
    <div class="form-row">
      <label>Главна снимка</label>
      <input type="file" accept="image/*" @change="handleImage" />
      <div v-if="form.image" class="img-preview-wrap">
        <img :src="imageUrl(form.image)" class="img-preview" alt="preview" />
        <div style="margin-top:0.4rem">
          <button class="tbl-btn danger" style="font-size:0.72rem" @click="form.image=''">Премахни снимката</button>
        </div>
      </div>
    </div>
    <div class="form-row">
      <label>Съдържание *</label>
      <textarea v-model="form.content" placeholder="Напиши статията тук..."></textarea>
    </div>
    <div class="form-actions">
      <button class="btn-primary" :disabled="saving" @click="save">
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

const form = reactive({
  title: '', category: '', date: new Date().toISOString().slice(0, 10),
  excerpt: '', content: '', image: ''
})

onMounted(async () => {
  categories.value = await api.getCategories()
  if (isEdit.value) {
    const post = await api.getPost(route.params.id)
    Object.assign(form, { title: post.title, category: post.category, date: post.date, excerpt: post.excerpt || '', content: post.content, image: post.image || '' })
  }
})

async function handleImage(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    const data = await api.uploadImage(file)
    form.image = data.url
  } catch {
    // fallback to base64 if upload fails
    const reader = new FileReader()
    reader.onload = ev => { form.image = ev.target.result }
    reader.readAsDataURL(file)
  }
}

async function save() {
  if (!form.title.trim() || !form.category || !form.content.trim()) {
    showToast('Попълни заглавие, категория и съдържание!', 'error'); return
  }
  saving.value = true
  try {
    if (isEdit.value) {
      await api.updatePost(route.params.id, { ...form })
      showToast('Статията е обновена!')
    } else {
      await api.createPost({ ...form })
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
