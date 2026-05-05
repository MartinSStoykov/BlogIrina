import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import { api } from './composables/useApi'

import BlogHome from './views/BlogHome.vue'
import PostView from './views/PostView.vue'
import LoginView from './views/LoginView.vue'
import AdminLayout from './views/AdminLayout.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import AdminPosts from './views/AdminPosts.vue'
import AdminPostForm from './views/AdminPostForm.vue'
import AdminCategories from './views/AdminCategories.vue'
import AdminSettings from './views/AdminSettings.vue'
import AdminComments from './views/AdminComments.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: BlogHome },
    { path: '/post/:id', component: PostView },
    { path: '/login', component: LoginView },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', component: AdminDashboard },
        { path: 'posts', component: AdminPosts },
        { path: 'posts/new', component: AdminPostForm },
        { path: 'posts/:id/edit', component: AdminPostForm },
        { path: 'categories', component: AdminCategories },
        { path: 'comments', component: AdminComments },
        { path: 'settings', component: AdminSettings },
      ]
    }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  if (to.path.startsWith('/admin')) {
    try {
      const data = await api.me()
      if (!data.loggedIn) return '/login'
    } catch {
      return '/login'
    }
  }
})

createApp(App).use(router).mount('#app')
