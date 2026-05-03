<template>
  <div class="login-wrap">
    <div class="login-box">
    <p style="font-size:2rem; margin-bottom:0.5rem; color:#ff69b4;">★</p>
      <h1 class="login-title">Администрация</h1>
      <p class="login-sub">Влез, за да управляваш блога си</p>
      <p v-if="error" class="login-error">{{ error }}</p>
      <input v-model="username" type="text" placeholder="Потребителско име" @keyup.enter="doLogin" />
      <input v-model="password" type="password" placeholder="Парола" @keyup.enter="doLogin" />
      <button class="btn-primary" :disabled="loading" @click="doLogin">
        {{ loading ? 'Влизане...' : 'Вход' }}
      </button>
      <p class="login-hint" style="margin-top:0.5rem">
        <RouterLink to="/" style="color:var(--admin-accent)">← Обратно към блога</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../composables/useApi.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function doLogin() {
  if (!username.value || !password.value) { error.value = 'Попълни всички полета.'; return }
  loading.value = true
  try {
    await api.login(username.value, password.value)
    router.push('/admin')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root, .login-wrap {
  --admin-accent: #ff69b4; /* лилав */
}

.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--admin-bg); }
.login-box { width: 380px; background: var(--admin-surface); border: 1px solid var(--admin-border); border-radius: 12px; padding: 2.5rem 2rem; text-align: center; }
.login-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--admin-text); margin-bottom: 0.3rem; }
.login-sub { font-size: 0.82rem; color: var(--admin-muted); margin-bottom: 2rem; }
.login-box input {
  width: 100%; background: var(--admin-bg); border: 1px solid var(--admin-border);
  border-radius: 6px; padding: 0.7rem 1rem; color: var(--admin-text);
  font-size: 0.9rem; font-family: 'Lato', sans-serif; outline: none;
  margin-bottom: 0.8rem; display: block; transition: border-color 0.2s;
}
.login-box input:focus { border-color: var(--admin-accent); }
.login-box .btn-primary { width: 100%; padding: 0.75rem; font-size: 0.95rem; }
.login-error { color: #E07070; font-size: 0.82rem; margin-bottom: 1rem; }
.login-hint { font-size: 0.75rem; color: var(--admin-muted); margin-top: 1.2rem; }
</style>