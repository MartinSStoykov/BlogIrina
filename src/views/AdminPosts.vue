<template>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:0.75rem;">
    <h2 class="admin-page-title" style="margin:0">Всички статии</h2>
    <RouterLink to="/admin/posts/new" class="btn-primary">+ Нова статия</RouterLink>
  </div>

  <!-- Десктоп таблица -->
  <div class="admin-table-wrap desktop-only" v-if="posts.length">
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

  <!-- Мобилни карти -->
  <div class="mobile-only" v-if="posts.length">
    <div class="post-card" v-for="p in posts" :key="p.id">
      <div class="post-card-info">
        <div class="post-card-title">{{ p.title }}</div>
        <div class="post-card-meta">
          <span class="tbl-cat">{{ p.category }}</span>
          <span style="color:var(--admin-muted);font-size:0.75rem;">{{ p.date }}</span>
        </div>
      </div>
      <div class="post-card-actions">
        <RouterLink :to="`/admin/posts/${p.id}/edit`" class="tbl-btn">✏ Редактирай</RouterLink>
        <button class="tbl-btn danger" @click="remove(p.id)">✕ Изтрий</button>
      </div>
    </div>
  </div>

  <div v-if="!posts.length" style="color:var(--admin-muted);padding:2rem 0;">Все още няма статии.</div>
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

<style scoped>
.desktop-only { display: block; }
.mobile-only  { display: none; }

.post-card {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}
.post-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--admin-text);
  margin-bottom: 0.4rem;
  line-height: 1.3;
}
.post-card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
.post-card-actions {
  display: flex;
  gap: 0.5rem;
}
.post-card-actions .tbl-btn {
  flex: 1;
  text-align: center;
  padding: 0.55rem 0.5rem;
  font-size: 0.82rem;
}

@media (max-width: 700px) {
  .desktop-only { display: none; }
  .mobile-only  { display: block; }
}
</style>
