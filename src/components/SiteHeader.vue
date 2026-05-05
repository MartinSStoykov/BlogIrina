<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        {{ settings.blogName || 'Блогът на Ирина Андре' }} <span>★</span>
      </RouterLink>

      <!-- Десктоп навигация -->
      <nav class="desktop-nav">
        <ul class="nav-links">
          <li><RouterLink to="/" exact-active-class="active">Начало</RouterLink></li>
          <li v-for="c in categories.slice(0, 4)" :key="c">
            <RouterLink :to="`/?category=${encodeURIComponent(c)}`" active-class="">{{ c }}</RouterLink>
          </li>
          <li>
            <a :href="settings.instagramUrl || 'https://www.instagram.com/irinaaandre/'" target="_blank" class="social-btn" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@andre_i.a?_r=1&_t=ZN-966GD005Jhq" target="_blank" class="social-btn" title="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="https://www.pinterest.com/chavushyan28/" target="_blank" class="social-btn" title="Pinterest">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </a>
          </li>
          <li><RouterLink to="/login" class="admin-btn">Вход</RouterLink></li>
        </ul>
      </nav>

      <!-- Мобилни икони вдясно -->
      <div class="mobile-right">
        <a :href="settings.instagramUrl || 'https://www.instagram.com/irinaaandre/'" target="_blank" class="social-btn" title="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <a href="https://www.tiktok.com/@andre_i.a?_r=1&_t=ZN-966GD005Jhq" target="_blank" class="social-btn" title="TikTok">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z"/>
          </svg>
        </a>
        <a href="https://www.pinterest.com/chavushyan28/" target="_blank" class="social-btn" title="Pinterest">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        </a>
        <!-- Хамбургер -->
        <button class="hamburger" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Мобилно меню -->
    <div class="mobile-menu" :class="{ open: menuOpen }" @click.self="menuOpen = false">
      <ul>
        <li><RouterLink to="/" exact-active-class="active" @click="menuOpen = false">Начало</RouterLink></li>
        <li v-for="c in categories.slice(0, 4)" :key="c">
          <RouterLink :to="`/?category=${encodeURIComponent(c)}`" active-class="" @click="menuOpen = false">{{ c }}</RouterLink>
        </li>
        <li><RouterLink to="/login" @click="menuOpen = false" class="menu-login">Вход</RouterLink></li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../composables/useApi.js'

const categories = ref([])
const settings = ref({})
const menuOpen = ref(false)

onMounted(async () => {
  ;[categories.value, settings.value] = await Promise.all([api.getCategories(), api.getSettings()])
})
</script>

<style scoped>
.social-btn {
  display: flex;
  align-items: center;
  color: var(--text-mid);
  transition: color 0.2s;
}
.social-btn:hover { color: hotpink; }

.site-header {
  background: var(--warm-white);
  border-bottom: 1px solid var(--border);
  padding: 0 1.5rem;
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
  font-size: 1.3rem;
  color: var(--text-dark);
  text-decoration: none;
  letter-spacing: -0.02em;
  white-space: nowrap;
  flex-shrink: 0;
}
.logo span { color: var(--accent); }

/* Десктоп навигация */
.desktop-nav { display: flex; }
.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  align-items: center;
  margin: 0; padding: 0;
}
.nav-links a {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-mid);
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}
.nav-links a:hover, .nav-links a.active { color: var(--accent); }
.admin-btn {
  background: var(--admin-bg, #f5f0eb) !important;
  color: var(--admin-text, #333) !important;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s;
}
.admin-btn:hover { opacity: 0.8; }

/* Мобилни икони */
.mobile-right {
  display: none;
  align-items: center;
  gap: 0.75rem;
}

/* Хамбургер */
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  touch-action: manipulation;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-dark, #333);
  border-radius: 2px;
  transition: all 0.2s;
}

/* Мобилно меню */
.mobile-menu {
  display: none;
  background: var(--warm-white);
  border-top: 1px solid var(--border);
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.mobile-menu.open {
  max-height: 400px;
}
.mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0 1rem;
}
.mobile-menu li a {
  display: block;
  padding: 0.9rem 1.5rem;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-mid);
  text-decoration: none;
  transition: color 0.2s;
}
.mobile-menu li a:hover,
.mobile-menu li a.active { color: var(--accent); }
.menu-login {
  color: var(--accent) !important;
  font-weight: 600;
}

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .mobile-right { display: flex; }
  .mobile-menu { display: block; }
}
</style>
