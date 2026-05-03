<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        {{ settings.blogName || 'Блогът на Ирина Андре' }} <span>★</span>
      </RouterLink>
      <nav>
        <ul class="nav-links">
          <li><RouterLink to="/" exact-active-class="active">Начало</RouterLink></li>
          <li v-for="c in categories.slice(0, 4)" :key="c">
            <RouterLink :to="`/?category=${encodeURIComponent(c)}`" active-class="">
              {{ c }}
            </RouterLink>
          </li>
          <li>
            <a :href="settings.instagramUrl || 'https://www.instagram.com/irinaaandre/'" target="_blank" class="instagram-btn" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </li>
          <li><RouterLink to="/login" class="admin-btn">Вход</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../composables/useApi.js'

const categories = ref([])
const settings = ref({})

onMounted(async () => {
  ;[categories.value, settings.value] = await Promise.all([api.getCategories(), api.getSettings()])
})
</script>

<style scoped>
.instagram-btn {
  display: flex;
  align-items: center;
  color: var(--text-mid);
  transition: color 0.2s;
}
.instagram-btn:hover { color: hotpink; }
.site-header {
  background: var(--warm-white);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--text-dark);
  text-decoration: none;
  letter-spacing: -0.02em;
}
.logo span { color: var(--accent); }
.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  align-items: center;
}
.nav-links a {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-mid);
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.active { color: var(--accent); }
.admin-btn {
  background: var(--admin-bg) !important;
  color: var(--admin-text) !important;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s;
}
.admin-btn:hover { background: var(--accent-dark) !important; }
@media (max-width: 700px) {
  .nav-links { gap: 1rem; }
}
</style>
