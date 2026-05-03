<template>
  <h2 class="admin-page-title">Категории</h2>
  <div class="admin-form" style="max-width:500px;">
    <div class="form-row">
      <label>Добави нова категория</label>
      <div style="display:flex;gap:0.75rem;">
        <input v-model="newCat" type="text" placeholder="Например: Рецепти..." @keyup.enter="add" style="flex:1;" />
        <button class="btn-primary" @click="add">Добави</button>
      </div>
    </div>
    <div v-if="categories.length" style="margin-top:1.2rem;">
      <div style="font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--admin-muted);margin-bottom:0.75rem;">Текущи категории</div>
      <div
        v-for="c in categories" :key="c"
        style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0.8rem;background:var(--admin-bg);border:1px solid var(--admin-border);border-radius:6px;margin-bottom:0.5rem;"
      >
        <span style="font-size:0.88rem;">{{ c }}</span>
        <button class="tbl-btn danger" style="padding:0.2rem 0.6rem;font-size:0.72rem;" @click="remove(c)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { api } from '../composables/useApi.js'

const { showToast } = inject('toast')
const categories = ref([])
const newCat = ref('')

onMounted(async () => { categories.value = await api.getCategories() })

async function add() {
  const c = newCat.value.trim()
  if (!c) return
  await api.createCategory(c)
  categories.value = await api.getCategories()
  newCat.value = ''
  showToast('Категорията е добавена!')
}

async function remove(name) {
  if (!confirm(`Изтрий категорията "${name}"?`)) return
  await api.deleteCategory(name)
  categories.value = categories.value.filter(c => c !== name)
  showToast('Категорията е изтрита.')
}
</script>
