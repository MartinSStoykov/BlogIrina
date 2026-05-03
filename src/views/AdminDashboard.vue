<template>
  <h2 class="admin-page-title">Добре дошла!</h2>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Статии</div>
      <div class="stat-value">{{ stats.posts }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Категории</div>
      <div class="stat-value">{{ stats.categories }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Снимки</div>
      <div class="stat-value">{{ stats.images }}</div>
    </div>
  </div>
  <div v-if="recentPosts.length" style="background:var(--admin-surface);border:1px solid var(--admin-border);border-radius:8px;padding:1.4rem;">
    <div style="font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--admin-muted);margin-bottom:1rem;">Последни статии</div>
    <div
      v-for="p in recentPosts" :key="p.id"
      style="display:flex;justify-content:space-between;align-items:center;padding:0.7rem 0;border-bottom:1px solid var(--admin-border);"
    >
      <span style="font-size:0.9rem;color:var(--admin-text);">{{ p.title }}</span>
      <span style="font-size:0.75rem;color:var(--admin-muted);">{{ p.date }}</span>
    </div>
  </div>
  <div v-else style="color:var(--admin-muted);font-size:0.9rem;margin-top:1rem;">
    Все още няма статии.
    <RouterLink to="/admin/posts/new" style="color:var(--admin-accent);">Създай първата!</RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../composables/useApi.js'

const stats = ref({ posts: 0, categories: 0, images: 0 })
const recentPosts = ref([])

onMounted(async () => {
  const [posts, categories] = await Promise.all([api.getPosts(), api.getCategories()])
  stats.value = { posts: posts.length, categories: categories.length, images: posts.filter(p => p.image).length }
  recentPosts.value = posts.slice(0, 5)
})
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 8px; padding: 1.2rem; }
.stat-label { font-size: 0.7rem; color: var(--admin-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
.stat-value { font-size: 2rem; font-weight: 700; color: var(--admin-accent); }
</style>
