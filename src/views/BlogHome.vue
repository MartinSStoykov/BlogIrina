<template>
  <SiteHeader />

  <!-- Hero -->
  <div v-if="!activeCategory" class="hero">
    <div class="hero-eyebrow">Добре дошли в</div>
    <h1>{{ settings.blogName || 'Моят блог' }}<br><em>{{ settings.tagline || 'Истории от живота ми' }}</em></h1>
    <p class="hero-desc">{{ settings.description || 'Лични истории, рецепти, пътувания и всичко, което ни прави по-живи.' }}</p>
  </div>

  <!-- Category bar -->
  <div class="category-bar">
    <div class="category-bar-inner">
      <button class="cat-tab" :class="{ active: !activeCategory }" @click="setCategory('')">Всички</button>
      <button
        v-for="c in categories" :key="c"
        class="cat-tab"
        :class="{ active: activeCategory === c }"
        @click="setCategory(c)"
      >{{ c }}</button>
    </div>
  </div>

  <!-- Grid -->
  <div class="blog-grid">
    <div v-if="loading" class="empty-state">
      <div class="empty-state-icon">★</div>
      <p>Зарежда...</p>
    </div>
    <div v-else-if="!posts.length" class="empty-state">
      <div class="empty-state-icon">★</div>
      <h3>Все още няма статии</h3>
      <p>Влез в администрацията и добави първата си статия.</p>
    </div>
    <PostCard v-for="p in posts" :key="p.id" :post="p" />
  </div>

  <!-- Author block -->
  <section v-if="settings.author" style="max-width:1100px;margin:1rem auto 0;padding:0 2rem;">
    <div class="author-box">
      <img v-if="settings.authorImage" :src="settings.authorImage" alt="author" class="author-img" />
      <div>
        <h3>За автора</h3>
       <img 
  src="/iri.jpeg" 
  style="width: 170px; height: 260px; border-radius: 12px; object-fit: cover; object-position: center top;">
        <p><strong style="color:hotpink;">{{ settings.author }}</strong> споделя лични истории, красиви моменти и вдъхновения от ежедневието.</p>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <p>© {{ new Date().getFullYear() }} {{ settings.blogName || 'Моят блог' }} · Всички права запазени</p>
    <p style="margin-top:0.3rem"><RouterLink to="/login" style="color:var(--accent);text-decoration:none;">Администрация</RouterLink></p>
  </footer>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import PostCard from '../components/PostCard.vue'
import { api } from '../composables/useApi.js'

const route = useRoute()
const router = useRouter()
const posts = ref([])
const categories = ref([])
const settings = ref({})
const loading = ref(true)
const activeCategory = ref(route.query.category || '')

async function load() {
  loading.value = true
  ;[posts.value, categories.value, settings.value] = await Promise.all([
    api.getPosts(activeCategory.value),
    api.getCategories(),
    api.getSettings()
  ])
  loading.value = false
}

function setCategory(c) {
  activeCategory.value = c
  router.replace(c ? `/?category=${encodeURIComponent(c)}` : '/')
}

watch(() => route.query.category, (c) => {
  activeCategory.value = c || ''
  load()
})

onMounted(load)
</script>

<style scoped>
.hero {
  background: var(--warm-white);
  border-bottom: 1px solid var(--border);
  padding: 5rem 2rem 4rem;
  text-align: center;
}
.hero-eyebrow {
   font-family: 'Playfair Display', serif;
  font-size: 0.90rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
}
.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.1;
  color: var(--text-dark);
  margin-bottom: 1.2rem;
  letter-spacing: -0.03em;
}
.hero h1 em { font-style: italic; color: var(--accent); }
.hero-desc {
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-muted);
  font-size: 1.05rem;
  font-weight: 300;
}
.category-bar {
  background: var(--warm-white);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  position: sticky;
  top: 64px;
  z-index: 90;
}
.category-bar-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}
.category-bar-inner::-webkit-scrollbar { display: none; }
.cat-tab {
  padding: 1rem 1.2rem;
  font-size: 0.8rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  background: none;
  font-family: 'Lato', sans-serif;
  transition: all 0.2s;
}
.cat-tab:hover { color: var(--text-dark); }
.cat-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

.blog-grid {
  max-width: 1100px;
  margin: 3rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 5rem 2rem;
  color: var(--text-muted);
}
.empty-state-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; margin-bottom: 0.5rem; color: var(--text-mid); }

.author-box {
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.author-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid var(--accent-light); }
.author-box h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 0.5rem; }

.site-footer {
  border-top: 1px solid var(--border);
  padding: 2.5rem 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
  margin-top: 5rem;
}
</style>
