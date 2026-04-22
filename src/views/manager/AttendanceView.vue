<template>
  <div class="attendance">
    <div class="header">
      <h1>الحضور والغياب</h1>
      <div class="date-filter">
        <label>تاريخ:</label>
        <input v-model="selectedDate" type="date" @change="fetchAttendance" />
      </div>
    </div>

    <!-- إحصائيات اليوم -->
    <div class="stats-grid">
      <div class="stat-card green">
        <span class="icon">✅</span>
        <div>
          <h3>{{ presentCount }}</h3>
          <p>حاضرون</p>
        </div>
      </div>
      <div class="stat-card red">
        <span class="icon">❌</span>
        <div>
          <h3>{{ absentCount }}</h3>
          <p>غائبون</p>
        </div>
      </div>
      <div class="stat-card orange">
        <span class="icon">⏰</span>
        <div>
          <h3>{{ stillInCount }}</h3>
          <p>لم يسجلوا خروج</p>
        </div>
      </div>
    </div>

    <!-- جدول الحضور -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>الموظف</th>
            <th>التاريخ</th>
            <th>وقت الدخول</th>
            <th>وقت الخروج</th>
            <th>الموقع</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in attendance" :key="record.id">
            <td>{{ record.employee?.name }}</td>
            <td>{{ record.date }}</td>
            <td>{{ record.check_in || '-' }}</td>
            <td>{{ record.check_out || '-' }}</td>
            <td>{{ record.location || '-' }}</td>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

const attendance = ref([])
const selectedDate = ref(new Date().toISOString().split('T')[0])

const presentCount = computed(() => attendance.value.filter((a: any) => a.check_in).length)
const absentCount = computed(() => attendance.value.filter((a: any) => !a.check_in).length)
const stillInCount = computed(() => attendance.value.filter((a: any) => a.check_in && !a.check_out).length)

const fetchAttendance = async () => {
  const response = await api.get('/attendance')
  attendance.value = response.data.filter((a: any) => a.date === selectedDate.value)
}

onMounted(fetchAttendance)
</script>

<style scoped>
.attendance {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 { color: #333; }

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-filter input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.stat-card .icon { font-size: 32px; }
.stat-card h3 { font-size: 28px; font-weight: bold; }
.stat-card p { color: #666; font-size: 14px; }

.stat-card.green h3 { color: #34a853; }
.stat-card.red h3 { color: #e53935; }
.stat-card.orange h3 { color: #fb8c00; }

.table-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
</style>