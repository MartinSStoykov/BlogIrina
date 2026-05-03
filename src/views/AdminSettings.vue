<template>
  <h2 class="admin-page-title">Настройки на блога</h2>
  <div class="admin-form" style="max-width:600px;">
    <div class="settings-section">
      <h3>Общи</h3>
      <div class="form-row">
        <label>Название на блога</label>
        <input v-model="settings.blogName" type="text" />
      </div>
      <div class="form-row">
        <label>Описание / Tagline</label>
        <input v-model="settings.tagline" type="text" />
      </div>
      <div class="form-row">
        <label>Автор</label>
        <input v-model="settings.author" type="text" />
      </div>
      <div class="form-row">
        <label>Описание на блога</label>
        <input v-model="settings.description" type="text" />
      </div>
    </div>
    <div class="settings-section">
      <h3>Акаунт</h3>
      <div class="form-row">
        <label>Ново потребителско ime</label>
        <input v-model="newUsername" type="text" placeholder="Остави празно за без промяна" />
      </div>
      <div class="form-row">
        <label>Нова парола</label>
        <input v-model="newPassword" type="password" placeholder="Остави празно за без промяна" />
      </div>
    </div>
    <div class="form-actions">
      <button class="btn-primary" :disabled="saving" @click="save">
        {{ saving ? 'Запазва...' : 'Запази настройките' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue'
import { api } from '../composables/useApi.js'

const { showToast } = inject('toast')
const settings = reactive({ blogName: '', tagline: '', author: '', description: '' })
const newUsername = ref('')
const newPassword = ref('')
const saving = ref(false)

onMounted(async () => {
  const data = await api.getSettings()
  Object.assign(settings, data)
})

async function save() {
  saving.value = true
  try {
    await api.updateSettings({ ...settings })
    if (newUsername.value || newPassword.value) {
      await api.changeCredentials({ username: newUsername.value, password: newPassword.value })
      newUsername.value = ''
      newPassword.value = ''
    }
    showToast('Настройките са запазени!')
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    saving.value = false
  }
}
</script>
