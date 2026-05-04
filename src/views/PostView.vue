<template>
  <SiteHeader />
  <div class="single-post" v-if="post">
    <button class="back-btn" @click="$router.back()">← Обратно</button>
    <div class="post-header">
      <div class="post-category-tag">{{ post.category }}</div>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span>{{ settings.author || 'Автор' }}</span>
        <span>{{ post.date }}</span>
      </div>
    </div>

    <!-- Слайдер (поддържа и стари статии с 1 снимка) -->
    <ImageSlider :images="post.images?.length ? post.images : (post.image ? [post.image] : [])" />

    <div class="post-content">{{ post.content }}</div>
  </div>
  <div v-else-if="loading" class="single-post" style="text-align:center;padding-top:5rem;color:var(--text-muted);">Зарежда...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import ImageSlider from '../components/ImageSlider.vue'
import { api, imageUrl } from '../composables/useApi.js'

const route = useRoute()
const post = ref(null)
const settings = ref({})
const loading = ref(true)

onMounted(async () => {
  ;[post.value, settings.value] = await Promise.all([
    api.getPost(route.params.id),
    api.getSettings()
  ])
  loading.value = false
})
</script>

<style scoped>
.single-post { max-width: 720px; margin: 3rem auto; padding: 0 2rem; }
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  cursor: pointer;
  margin-bottom: 2rem;
  background: none;
  border: none;
  font-family: 'Lato', sans-serif;
  transition: color 0.2s;
}
.back-btn:hover { color: var(--accent); }
.post-category-tag { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.8rem; }
.post-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.15;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}
.post-meta { display: flex; gap: 1.5rem; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 2rem; }
.post-content { font-size: 1.05rem; line-height: 1.85; color: var(--text-mid); font-weight: 300; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
</style>