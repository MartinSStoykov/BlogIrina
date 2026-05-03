<template>
  <article class="post-card" @click="$router.push(`/post/${post.id}`)">
    <img v-if="post.image" :src="imageUrl(post.image)" class="post-card-img" :alt="post.title" />
    <div v-else class="post-card-img-placeholder">★</div>
    <div class="post-card-body">
      <div class="post-card-category">{{ post.category }}</div>
      <h2 class="post-card-title">{{ post.title }}</h2>
      <p class="post-card-excerpt">{{ post.excerpt || post.content }}</p>
      <div class="post-card-meta">
        <span class="post-card-date">{{ post.date }}</span>
        <span class="read-more">Прочети →</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { imageUrl } from '../composables/useApi'
defineProps({ post: Object })
</script>

<style scoped>
.post-card {
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}
.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
}
.post-card-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}
.post-card-img-placeholder {
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, var(--accent-light) 0%, var(--border) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}
.post-card-body { padding: 1.4rem; }
.post-card-category {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
}
.post-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  line-height: 1.3;
  color: var(--text-dark);
  margin-bottom: 0.6rem;
}
.post-card-excerpt {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 300;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-card-meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.post-card-date { font-size: 0.75rem; color: var(--text-muted); }
.read-more { font-size: 0.75rem; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase; }
</style>
