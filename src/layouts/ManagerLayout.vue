<template>
  <div class="layout">
    <!-- الشريط الجانبي -->
    <aside class="sidebar">
      <div class="logo">
        <h2>🏢 تطبيق المؤسسة</h2>
        <p>{{ employee?.name }}</p>
        <span class="badge">مدير</span>
      </div>

      <nav>
        <router-link to="/manager/dashboard">
          <span>📊</span> لوحة التحكم
        </router-link>
        <router-link to="/manager/employees">
          <span>👥</span> الموظفون
        </router-link>
        <router-link to="/manager/tasks">
          <span>✅</span> المهام
        </router-link>
        <router-link to="/manager/attendance">
          <span>📍</span> الحضور والغياب
        </router-link>
        <router-link to="/manager/chat">
          <span>💬</span> المحادثة
        </router-link>
        <router-link to="/manager/settings">
            <span>⚙️</span> الإعدادات
        </router-link>
      </nav>

      <button class="logout-btn" @click="handleLogout">
        🚪 تسجيل الخروج
      </button>
    </aside>

    <!-- المحتوى الرئيسي -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const employee = computed(() => authStore.employee)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  direction: rtl;
}

.sidebar {
  width: 250px;
  background: #1a73e8;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  height: 100vh;
  right: 0;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

.logo h2 {
  font-size: 16px;
  margin-bottom: 8px;
}

.logo p {
  font-size: 14px;
  opacity: 0.9;
}

.badge {
  background: white;
  color: #1a73e8;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
}

nav a:hover,
nav a.router-link-active {
  background: rgba(255,255,255,0.2);
}

.logout-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

.content {
  flex: 1;
  margin-right: 250px;
  padding: 24px;
  background: #f5f5f5;
}
</style>