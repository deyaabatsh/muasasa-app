<template>
  <div class="register-container">
    <div class="register-box">
      <h1>تطبيق المؤسسة</h1>
      <p>إنشاء حساب جديد</p>

      <div class="input-group">
        <label>الاسم الكامل</label>
        <input v-model="form.name" type="text" placeholder="أدخل اسمك الكامل" />
      </div>

      <div class="input-group">
        <label>الإيميل</label>
        <input v-model="form.email" type="email" placeholder="أدخل إيميلك" />
      </div>

      <div class="input-group">
        <label>كلمة المرور</label>
        <input v-model="form.password" type="password" placeholder="أدخل كلمة المرور" />
      </div>

      <div class="input-group">
        <label>القسم</label>
        <input v-model="form.department" type="text" placeholder="القسم (اختياري)" />
      </div>

      <div class="input-group">
        <label>رقم الهاتف</label>
        <input v-model="form.phone" type="text" placeholder="رقم الهاتف (اختياري)" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <button @click="handleRegister" :disabled="loading">
        {{ loading ? 'جاري التسجيل...' : 'تسجيل' }}
      </button>

      <p class="login-link">
        عندك حساب؟ <router-link to="/login">سجّل دخولك</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api/axios'

const form = ref({
  name: '',
  email: '',
  password: '',
  department: '',
  phone: '',
})

const error = ref('')
const success = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await api.post('/register', form.value)
    success.value = '✅ تم التسجيل بنجاح! يرجى انتظار موافقة المدير'
    form.value = { name: '', email: '', password: '', department: '', phone: '' }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'حدث خطأ في التسجيل'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
}

.register-box {
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

.success {
  color: #34a853;
  font-size: 14px;
  margin-bottom: 8px;
}

.login-link {
  margin-top: 16px;
  font-size: 14px;
}

.login-link a {
  color: #1a73e8;
  text-decoration: none;
}
</style>