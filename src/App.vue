<template>
  <RouterView />
  <Teleport to="body">
    <div v-if="toast.show" class="toast" :class="{ error: toast.type === 'error' }">
      {{ toast.msg }}
    </div>
  </Teleport>
</template>

<script setup>
import { provide } from 'vue'
import { useToast } from './composables/useToast.js'

const toast = useToast()
provide('toast', toast)
</script>

<style>
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--success);
  color: #fff;
  padding: 0.8rem 1.4rem;
  border-radius: 6px;
  font-size: 0.88rem;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.toast.error { background: var(--danger); }
</style>
