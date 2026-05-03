<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <span>★ Блог Панел</span>
        <small>Администрация</small>
      </div>
      <ul class="sidebar-nav">
        <li>
          <RouterLink to="/admin" end>
            <span class="icon">⊞</span> Табло
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/admin/posts">
            <span class="icon">▤</span> Статии
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/admin/posts/new">
            <span class="icon">✚</span> Нова статия
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/admin/categories">
            <span class="icon">◈</span> Категории
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/admin/settings">
            <span class="icon">⚙</span> Настройки
          </RouterLink>
        </li>
      </ul>
      <div class="sidebar-exit">
        <button class="exit-btn" @click="doLogout">← Изход</button>
        <RouterLink to="/" class="exit-btn" style="display:block;margin-top:0.5rem;text-align:center;text-decoration:none;">← Към блога</RouterLink>
      </div>
    </aside>

    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { api } from '../composables/useApi.js'

const router = useRouter()

async function doLogout() {
  await api.logout()
  router.push('/')
}
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: var(--admin-bg); font-family: 'Lato', sans-serif; }
.admin-sidebar {
  width: 240px;
  background: var(--admin-surface);
  border-right: 1px solid var(--admin-border);
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
}
.admin-logo { padding: 0 1.5rem 1.5rem; border-bottom: 1px solid var(--admin-border); margin-bottom: 1rem; }
.admin-logo span { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--admin-text); display: block; }
.admin-logo small { font-size: 0.7rem; color: var(--admin-muted); letter-spacing: 0.1em; text-transform: uppercase; }
.sidebar-nav { list-style: none; padding: 0 0.75rem; }
.sidebar-nav li { margin-bottom: 2px; }
.sidebar-nav a {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.75rem;
  color: var(--admin-muted);
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.15s;
}
.sidebar-nav a:hover { background: rgba(193,123,74,0.1); color: var(--admin-text); }
.sidebar-nav a.router-link-active { background: rgba(193,123,74,0.2); color: var(--admin-accent); }
.icon { font-size: 1rem; width: 20px; text-align: center; }
.sidebar-exit { padding: 1.5rem 1.25rem 0; border-top: 1px solid var(--admin-border); margin-top: 1rem; }
.exit-btn {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: none;
  border: 1px solid var(--admin-border);
  color: var(--admin-muted);
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  transition: all 0.2s;
  font-family: 'Lato', sans-serif;
  letter-spacing: 0.05em;
}
.exit-btn:hover { border-color: var(--admin-accent); color: var(--admin-accent); }
.admin-main { flex: 1; padding: 2rem; overflow-y: auto; color: var(--admin-text); }

@media (max-width: 700px) { .admin-sidebar { display: none; } }
</style>
