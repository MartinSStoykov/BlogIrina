<template>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <h2 class="admin-page-title" style="margin:0">Всички статии</h2>
    <RouterLink to="/admin/posts/new" class="btn-primary">+ Нова статия</RouterLink>
  </div>
  <div class="admin-table-wrap" v-if="posts.length">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Заглавие</th>
          <th>Категория</th>
          <th>Дата</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id">
          <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ p.title }}</td>
          <td><span class="tbl-cat">{{ p.category }}</span></td>
          <td style="color:var(--admin-muted);font-size:0.8rem;">{{ p.date }}</td>
          <td>
            <div class="tbl-actions">
              <RouterLink :to="`/admin/posts/${p.id}/edit`" class="tbl-btn">Редактирай</RouterLink>
              <button class="tbl-btn danger" @click="remove(p.id)">Изтрий</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else style="color:var(--admin-muted);padding:2rem 0;">Все още няма статии.</div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { api } from '../composables/useApi.js'

const { showToast } = inject('toast')
const posts = ref([])

onMounted(async () => { posts.value = await api.getPosts() })

async function remove(id) {
  if (!confirm('Изтрий тази статия?')) return
  await api.deletePost(id)
  posts.value = posts.value.filter(p => p.id !== id)
  showToast('Статията е изтрита.')
}
</script>
