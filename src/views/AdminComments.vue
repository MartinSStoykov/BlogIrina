<template>
  <div>
    <h2 class="admin-page-title">Коментари</h2>

    <div v-if="loading" style="color:var(--admin-muted);padding:2rem 0;">Зарежда...</div>

    <template v-else>
      <!-- Чакащи одобрение -->
      <div class="comments-group" v-if="pending.length">
        <h3 class="group-title">⏳ Чакат одобрение <span class="badge pending">{{ pending.length }}</span></h3>
        <div class="comment-card" v-for="c in pending" :key="c.id">
          <div class="comment-card-header">
            <div class="comment-meta">
              <span class="comment-name">{{ c.name }}</span>
              <span class="comment-post">към „{{ c.post_title }}"</span>
              <span class="comment-date">{{ formatDate(c.created_at) }}</span>
            </div>
            <div class="comment-actions">
              <button class="action-btn approve" @click="approve(c.id)" title="Одобри">✓ Одобри</button>
              <button class="action-btn reject" @click="remove(c.id)" title="Изтрий">✕ Изтрий</button>
            </div>
          </div>
          <p class="comment-text">{{ c.content }}</p>
        </div>
      </div>
      <div v-else class="empty-state">Няма чакащи коментари 🎉</div>

      <!-- Одобрени -->
      <div class="comments-group" v-if="approved.length" style="margin-top:2.5rem">
        <h3 class="group-title">✓ Одобрени <span class="badge approved">{{ approved.length }}</span></h3>
        <div class="comment-card approved-card" v-for="c in approved" :key="c.id">
          <div class="comment-card-header">
            <div class="comment-meta">
              <span class="comment-name">{{ c.name }}</span>
              <span class="comment-post">към „{{ c.post_title }}"</span>
              <span class="comment-date">{{ formatDate(c.created_at) }}</span>
            </div>
            <div class="comment-actions">
              <button class="action-btn reject" @click="remove(c.id)" title="Изтрий">✕ Изтрий</button>
            </div>
          </div>
          <p class="comment-text">{{ c.content }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '../composables/useApi.js'

const comments = ref([])
const loading = ref(true)

const pending  = computed(() => comments.value.filter(c => !c.approved))
const approved = computed(() => comments.value.filter(c => c.approved))

onMounted(load)

async function load() {
  loading.value = true
  comments.value = await apiFetch('/admin/comments')
  loading.value = false
}

async function approve(id) {
  await apiFetch(`/admin/comments/${id}/approve`, { method: 'PUT' })
  await load()
}

async function remove(id) {
  if (!confirm('Сигурна ли си, че искаш да изтриеш коментара?')) return
  await apiFetch(`/admin/comments/${id}`, { method: 'DELETE' })
  await load()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.admin-page-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; margin-bottom: 1.5rem; }
.group-title {
  font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--admin-muted); margin-bottom: 1rem;
  display: flex; align-items: center; gap: 0.5rem;
}
.badge {
  font-size: 0.72rem; border-radius: 20px; padding: 1px 8px;
  font-weight: 700; color: #fff;
}
.badge.pending  { background: #e0853a; }
.badge.approved { background: #3aaa6e; }

.comment-card {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 10px;
  padding: 1rem 1.2rem;
  margin-bottom: 0.75rem;
  border-left: 3px solid #e0853a;
}
.approved-card { border-left-color: #3aaa6e; opacity: 0.8; }

.comment-card-header {
  display: flex; justify-content: space-between;
  align-items: flex-start; gap: 1rem; margin-bottom: 0.6rem;
  flex-wrap: wrap;
}
.comment-meta { display: flex; flex-direction: column; gap: 0.15rem; }
.comment-name { font-weight: 700; font-size: 0.9rem; color: var(--admin-text); }
.comment-post { font-size: 0.78rem; color: var(--admin-accent); }
.comment-date { font-size: 0.72rem; color: var(--admin-muted); }
.comment-text { font-size: 0.9rem; line-height: 1.6; color: var(--admin-text); margin: 0; }

.comment-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.action-btn {
  border: none; border-radius: 6px; padding: 0.35rem 0.8rem;
  font-size: 0.78rem; font-weight: 600; cursor: pointer;
  font-family: 'Lato', sans-serif; transition: opacity 0.15s;
}
.action-btn:hover { opacity: 0.8; }
.action-btn.approve { background: #3aaa6e; color: #fff; }
.action-btn.reject  { background: #e05555; color: #fff; }

.empty-state {
  color: var(--admin-muted); font-size: 0.9rem;
  padding: 2rem; text-align: center;
  border: 1px dashed var(--admin-border); border-radius: 10px;
}
</style>
