<template>
  <div class="layout">
    <main class="content">
      <router-view />
    </main>

    <nav class="bottom-nav">
      <router-link to="/employee/dashboard">
        <span>🏠</span>
        <p>الرئيسية</p>
      </router-link>
      <router-link to="/employee/tasks">
        <span>✅</span>
        <p>مهامي</p>
      </router-link>
      <router-link to="/employee/attendance">
        <span>📍</span>
        <p>الحضور</p>
      </router-link>
      <router-link to="/employee/chat">
        <span>💬</span>
        <p>المحادثة</p>
      </router-link>
      <router-link to="/employee/settings">
        <span>⚙️</span>
        <p>الإعدادات</p>
      </router-link>
      <button class="logout-nav" @click="handleLogout">
        <span>🚪</span>
        <p>خروج</p>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  direction: rtl;
  background: #f5f5f5;
}

.content {
  flex: 1;
  padding: 16px;
  padding-bottom: 80px;
}
.logout-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: #e53935;
  font-size: 12px;
  gap: 4px;
  cursor: pointer;
}

.logout-nav span {
  font-size: 22px;
}

.logout-nav p {
  margin: 0;
  font-size: 11px;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 100;
}

.bottom-nav a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  gap: 4px;
}

.bottom-nav a span {
  font-size: 22px;
}

.bottom-nav a p {
  margin: 0;
  font-size: 11px;
}

.bottom-nav a.router-link-active {
  color: #1a73e8;
}
</style>