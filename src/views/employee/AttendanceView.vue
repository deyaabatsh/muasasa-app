<template>
  <div class="attendance">
    <h1>الحضور</h1>

    <!-- بطاقة الحضور اليوم -->
    <div class="today-card">
      <h2>اليوم - {{ today }}</h2>

      <div v-if="!todayAttendance" class="check-in-section">
        <p>لم تسجل حضورك بعد</p>
        <button class="check-in-btn" @click="checkIn">
          🟢 تسجيل الدخول
        </button>
      </div>

      <div v-else class="attendance-status">
        <div class="time-row">
          <div class="time-box green">
            <span class="label">وقت الدخول</span>
            <span class="time">{{ todayAttendance.check_in }}</span>
          </div>
          <div class="time-box red" v-if="todayAttendance.check_out">
            <span class="label">وقت الخروج</span>
            <span class="time">{{ todayAttendance.check_out }}</span>
          </div>
        </div>

        <button
          v-if="!todayAttendance.check_out"
          class="check-out-btn"
          @click="checkOut"
        >
          🔴 تسجيل الخروج
        </button>

        <div v-else class="completed">
          ✅ تم تسجيل حضورك اليوم بالكامل
        </div>
      </div>
    </div>

    <!-- سجل الحضور -->
    <div class="history-card">
      <h2>سجل حضوري</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>وقت الدخول</th>
              <th>وقت الخروج</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in attendance" :key="record.id">
              <td>{{ record.date }}</td>
              <td>{{ record.check_in || '-' }}</td>
              <td>{{ record.check_out || '-' }}</td>
              <td>
                <span v-if="record.check_in && record.check_out" class="badge green">مكتمل</span>
                <span v-else-if="record.check_in" class="badge orange">لم يخرج</span>
                <span v-else class="badge red">غائب</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

const attendance = ref([])
const todayAttendance = ref<any>(null)
const successMessage = ref('')
const today = new Date().toLocaleDateString('ar', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const showSuccess = (message: string) => {
  successMessage.value = message
  setTimeout(() => successMessage.value = '', 3000)
}

const fetchAttendance = async () => {
  const response = await api.get('/attendance')
  attendance.value = response.data
  const todayDate = new Date().toISOString().split('T')[0]
  todayAttendance.value = response.data.find((a: any) => a.date === todayDate) || null
}

const checkIn = async () => {
  try {
    await api.post('/attendance/checkin', {
      location: 'المكتب'
    })
    showSuccess('✅ تم تسجيل دخولك بنجاح!')
    fetchAttendance()
  } catch (e: any) {
    alert(e.response?.data?.message || 'حدث خطأ')
  }
}

const checkOut = async () => {
  try {
    await api.post('/attendance/checkout')
    showSuccess('✅ تم تسجيل خروجك بنجاح!')
    fetchAttendance()
  } catch (e: any) {
    alert(e.response?.data?.message || 'حدث خطأ')
  }
}

onMounted(fetchAttendance)
</script>

<style scoped>
.attendance {
  padding: 16px;
}

h1 {
  color: #333;
  margin-bottom: 16px;
}

.today-card,
.history-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.today-card h2,
.history-card h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 16px;
}

.check-in-section {
  text-align: center;
  padding: 20px 0;
}

.check-in-section p {
  color: #666;
  margin-bottom: 16px;
}

.check-in-btn {
  background: #34a853;
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
}

.time-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.time-box {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.time-box.green {
  background: #e8f5e9;
}

.time-box.red {
  background: #ffebee;
}

.label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.check-out-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
}

.completed {
  text-align: center;
  color: #34a853;
  font-size: 16px;
  padding: 16px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: bold;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.badge.green { background: #e8f5e9; color: #34a853; }
.badge.orange { background: #fff3e0; color: #fb8c00; }
.badge.red { background: #ffebee; color: #e53935; }

.success-toast {
  position: fixed;
  bottom: 100px;
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