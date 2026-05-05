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

    <ImageSlider :images="post.images?.length ? post.images : (post.image ? [post.image] : [])" />

    <div class="post-content">{{ post.content }}</div>

    <!-- ── Коментари ── -->
    <section class="comments-section">
      <h3 class="comments-title">Коментари <span v-if="comments.length" class="comments-count">{{ comments.length }}</span></h3>

      <!-- Одобрени коментари -->
      <div v-if="comments.length" class="comments-list">
        <div v-for="c in comments" :key="c.id" class="comment">
          <div class="comment-header">
            <span class="comment-avatar">{{ c.name.charAt(0).toUpperCase() }}</span>
            <div>
              <span class="comment-name">{{ c.name }}</span>
              <span class="comment-date">{{ formatDate(c.created_at) }}</span>
            </div>
          </div>
          <p class="comment-text">{{ c.content }}</p>
        </div>
      </div>
      <p v-else class="no-comments">Все още няма коментари. Бъди първи!</p>

      <!-- Форма за нов коментар -->
      <div class="comment-form">
        <h4 class="comment-form-title">Остави коментар</h4>
        <div v-if="commentSent" class="comment-success">
          ✓ Коментарът ти е изпратен и ще се появи след одобрение.
        </div>
        <template v-else>
          <input
            v-model="newComment.name"
            type="text"
            placeholder="Твоето име *"
            class="comment-input"
            maxlength="60"
          />
          <textarea
            v-model="newComment.content"
            placeholder="Напиши коментар... *"
            class="comment-textarea"
            maxlength="1000"
          />
          <div class="comment-form-footer">
            <span class="comment-chars">{{ newComment.content.length }}/1000</span>
            <button class="comment-submit" :disabled="submitting" @click="submitComment">
              {{ submitting ? 'Изпраща...' : 'Изпрати' }}
            </button>
          </div>
          <p v-if="commentError" class="comment-error">{{ commentError }}</p>
        </template>
      </div>
    </section>
  </div>
  <div v-else-if="loading" class="single-post" style="text-align:center;padding-top:5rem;color:var(--text-muted);">Зарежда...</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import ImageSlider from '../components/ImageSlider.vue'
import { api, apiBase } from '../composables/useApi.js'

const route = useRoute()
const post = ref(null)
const settings = ref({})
const loading = ref(true)
const comments = ref([])
const commentSent = ref(false)
const submitting = ref(false)
const commentError = ref('')
const newComment = reactive({ name: '', content: '' })

onMounted(async () => {
  ;[post.value, settings.value] = await Promise.all([
    api.getPost(route.params.id),
    api.getSettings()
  ])
  loading.value = false
  loadComments()
})

async function loadComments() {
  try {
    const res = await fetch(`${apiBase}/api/posts/${route.params.id}/comments`)
    comments.value = await res.json()
  } catch (_) {}
}

async function submitComment() {
  commentError.value = ''
  if (!newComment.name.trim() || !newComment.content.trim()) {
    commentError.value = 'Попълни ime и коментар.'
    return
  }
  submitting.value = true
  try {
    const res = await fetch(`${apiBase}/api/posts/${route.params.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newComment.name, content: newComment.content })
    })
    const data = await res.json()
    if (!res.ok) { commentError.value = data.error; return }
    commentSent.value = true
  } catch (_) {
    commentError.value = 'Грешка при изпращане. Опитай пак.'
  } finally {
    submitting.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.single-post { max-width: 720px; margin: 3rem auto; padding: 0 2rem; }
.back-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-muted); cursor: pointer; margin-bottom: 2rem;
  background: none; border: none; font-family: 'Lato', sans-serif; transition: color 0.2s;
}
.back-btn:hover { color: var(--accent); }
.post-category-tag { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.8rem; }
.post-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.15; margin-bottom: 1rem; letter-spacing: -0.02em;
}
.post-meta { display: flex; gap: 1.5rem; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 2rem; }
.post-content { font-size: 1.05rem; line-height: 1.85; color: var(--text-mid); font-weight: 300; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }

/* ── Comments ── */
.comments-section {
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid #f0e0e8;
}
.comments-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.comments-count {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  background: var(--accent, #e0559a);
  color: #fff;
  border-radius: 20px;
  padding: 1px 9px;
  font-weight: 600;
}
.comments-list { display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2.5rem; }
.comment {
  background: #fdf5f8;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  border: 1px solid #f5dde8;
}
.comment-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
.comment-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent, #e0559a);
  color: #fff; font-weight: 700; font-size: 0.95rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.comment-name { font-weight: 600; font-size: 0.9rem; display: block; }
.comment-date { font-size: 0.75rem; color: var(--text-muted, #aaa); }
.comment-text { font-size: 0.95rem; line-height: 1.6; color: var(--text-mid, #555); margin: 0; }
.no-comments { color: var(--text-muted, #aaa); font-size: 0.9rem; margin-bottom: 2rem; }

/* Form */
.comment-form {
  background: #fdf5f8;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #f5dde8;
}
.comment-form-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin: 0 0 1rem; }
.comment-input, .comment-textarea {
  width: 100%; box-sizing: border-box;
  border: 1px solid #f0d0de;
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  background: #fff;
  color: var(--text, #333);
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;
  outline: none;
}
.comment-input:focus, .comment-textarea:focus { border-color: var(--accent, #e0559a); }
.comment-textarea { height: 110px; resize: vertical; }
.comment-form-footer { display: flex; justify-content: space-between; align-items: center; }
.comment-chars { font-size: 0.75rem; color: var(--text-muted, #aaa); }
.comment-submit {
  background: var(--accent, #e0559a);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.4rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.comment-submit:hover { opacity: 0.88; }
.comment-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.comment-error { color: #c0394a; font-size: 0.82rem; margin-top: 0.5rem; }
.comment-success {
  background: #e8f8f0; border: 1px solid #a8e0c0;
  color: #2a7a50; border-radius: 8px;
  padding: 0.9rem 1rem; font-size: 0.9rem;
}
</style>
