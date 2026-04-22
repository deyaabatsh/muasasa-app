<template>
  <div class="login-container">
    <div class="login-box">
      <h1>تطبيق المؤسسة</h1>
      <p>سجّل دخولك للمتابعة</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>الإيميل</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="أدخل إيميلك"
            required 
          />
        </div>

        <div class="input-group">
          <label>كلمة المرور</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="أدخل كلمة المرور"
            required 
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'جاري الدخول...' : 'تسجيل الدخول' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    if (authStore.isManager) {
      router.push('/manager/dashboard')
    } else {
      router.push('/employee/dashboard')
    }
  } catch (e) {
    error.value = 'بيانات الدخول غير صحيحة'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
}

h1 {
  color: #1a73e8;
  margin-bottom: 8px;
}

p {
  color: #666;
  margin-bottom: 24px;
}

.input-group {
  text-align: right;
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  direction: rtl;
}

button {
  width: 100%;
  padding: 14px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}

button:disabled {
  background: #ccc;
}

.error {
  color: red;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>