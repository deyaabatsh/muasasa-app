<template>
  <div class="settings">
    <h1>الإعدادات</h1>

    <!-- بيانات الحساب -->
    <div class="card">
      <h2>بيانات الحساب</h2>
      <div class="avatar-section">
        <img :src="avatarPreview || '/default-avatar.png'" class="avatar" />
        <div>
          <input type="file" id="avatar" accept="image/*" @change="handleAvatarChange" />
          <label for="avatar" class="upload-btn">📷 تغيير الصورة</label>
        </div>
      </div>

      <div class="input-group">
        <label>الاسم</label>
        <input v-model="form.name" type="text" />
      </div>

      <div class="input-group">
        <label>الإيميل</label>
        <input v-model="form.email" type="email" disabled />
      </div>

      <div class="input-group">
        <label>القسم</label>
        <input v-model="form.department" type="text" />
      </div>

      <div class="input-group">
        <label>الهاتف</label>
        <input v-model="form.phone" type="text" />
      </div>

      <button class="save-btn" @click="updateProfile">💾 حفظ التغييرات</button>
    </div>

    <!-- تغيير كلمة المرور -->
    <div class="card">
      <h2>تغيير كلمة المرور</h2>

      <div class="input-group">
        <label>كلمة المرور الجديدة</label>
        <input v-model="passwordForm.password" type="password" placeholder="كلمة المرور الجديدة" />
      </div>

      <div class="input-group">
        <label>تأكيد كلمة المرور</label>
        <input v-model="passwordForm.password_confirmation" type="password" placeholder="تأكيد كلمة المرور" />
      </div>

      <button class="save-btn" @click="updatePassword">🔒 تغيير كلمة المرور</button>
    </div>

    <!-- رسالة النجاح -->
    <div v-if="successMessage" class="success-toast">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api/axios'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const successMessage = ref('')
const avatarPreview = ref('')

const form = ref({
  name: '',
  email: '',
  department: '',
  phone: '',
  photo: '',
})

const passwordForm = ref({
  password: '',
  password_confirmation: '',
})

const showSuccess = (message: string) => {
  successMessage.value = message
  setTimeout(() => successMessage.value = '', 3000)
}

const handleAvatarChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    const file = input.files[0]
    avatarPreview.value = URL.createObjectURL(file)
  }
}

const updateProfile = async () => {
  try {
    await api.put(`/employees/${authStore.employee?.id}`, form.value)
    showSuccess('✅ تم حفظ التغييرات بنجاح')
  } catch (e) {
    console.error(e)
  }
}

const updatePassword = async () => {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    alert('كلمة المرور غير متطابقة')
    return
  }
  try {
    await api.put(`/employees/${authStore.employee?.id}`, {
      password: passwordForm.value.password
    })
    showSuccess('✅ تم تغيير كلمة المرور بنجاح')
    passwordForm.value = { password: '', password_confirmation: '' }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  const employee = authStore.employee
  if (employee) {
    form.value.name = employee.name
    form.value.email = employee.email
    form.value.department = employee.department || ''
    form.value.phone = employee.phone || ''
  }
})
</script>

<style scoped>
.settings {
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 16px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #1a73e8;
}

.upload-btn {
  background: #e3f2fd;
  color: #1a73e8;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

input[type="file"] {
  display: none;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  direction: rtl;
}

.input-group input:disabled {
  background: #f5f5f5;
  color: #999;
}

.save-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;
}

.success-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #34a853;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
}
</style>