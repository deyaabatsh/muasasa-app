<template>
  <div class="dashboard">
    <h1>لوحة التحكم</h1>
    <!-- إشعار طلبات الانضمام -->
    <div v-if="pendingCount > 0" class="pending-alert" @click="$router.push('/manager/employees')">
        <span>⏳</span>
            <p>يوجد <strong>{{ pendingCount }}</strong> طلب انضمام بانتظار موافقتك</p>
        <span>←</span>
    </div>
    <!-- الإحصائيات -->
    <div class="stats-grid">
      <div class="stat-card blue">
        <span class="icon">👥</span>
        <div>
          <h3>{{ stats.employees }}</h3>
          <p>الموظفون</p>
        </div>
      </div>
      <div class="stat-card green">
        <span class="icon">✅</span>
        <div>
          <h3>{{ stats.tasks }}</h3>
          <p>المهام الكلية</p>
        </div>
      </div>
      <div class="stat-card orange">
        <span class="icon">⏳</span>
        <div>
          <h3>{{ stats.pendingTasks }}</h3>
          <p>مهام متبقية</p>
        </div>
      </div>
      <div class="stat-card red">
        <span class="icon">📍</span>
        <div>
          <h3>{{ stats.presentToday }}</h3>
          <p>حاضرون اليوم</p>
        </div>
      </div>
    </div>

    <!-- آخر المهام -->
    <div class="section">
      <h2>آخر المهام</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>المهمة</th>
              <th>الموظف</th>
              <th>الموعد</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in recentTasks" :key="task.id">
              <td>{{ task.title }}</td>
              <td>{{ task.employee?.name }}</td>
              <td>{{ task.deadline }}</td>
              <td>
                <span :class="'badge ' + getStatusClass(task.status)">
                  {{ task.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

const stats = ref({
  employees: 0,
  tasks: 0,
  pendingTasks: 0,
  presentToday: 0,
})

const recentTasks = ref([])

const getStatusClass = (status: string) => {
  if (status === 'تم التسليم') return 'green'
  if (status === 'متأخر') return 'red'
  return 'orange'
}
const pendingCount = ref(0)
onMounted(async () => {
  try {
    const [employees, tasks, attendance, pending] = await Promise.all([
      api.get('/employees'),
      api.get('/tasks'),
      api.get('/attendance'),
      api.get('/employees/pending'),
    ])

    stats.value.employees = employees.data.length
    stats.value.tasks = tasks.data.length
    stats.value.pendingTasks = tasks.data.filter((t: any) => t.status === 'متبقي').length
    stats.value.presentToday = attendance.data.filter((a: any) => a.date === new Date().toISOString().split('T')[0]).length
    recentTasks.value = tasks.data.slice(0, 5)
    pendingCount.value = pending.data.length
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1 {
  margin-bottom: 24px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
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

.stat-card .icon {
  font-size: 32px;
}

.stat-card h3 {
  font-size: 28px;
  font-weight: bold;
}

.stat-card p {
  color: #666;
  font-size: 14px;
}

.stat-card.blue h3 { color: #1a73e8; }
.stat-card.green h3 { color: #34a853; }
.stat-card.orange h3 { color: #fb8c00; }
.stat-card.red h3 { color: #e53935; }

.section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section h2 {
  margin-bottom: 16px;
  color: #333;
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
  color: #333;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.badge.green { background: #e8f5e9; color: #34a853; }
.badge.orange { background: #fff3e0; color: #fb8c00; }
.badge.red { background: #ffebee; color: #e53935; }
.pending-alert {
  background: #fff3e0;
  border: 1px solid #fb8c00;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  cursor: pointer;
}

.pending-alert span {
  font-size: 24px;
}

.pending-alert p {
  flex: 1;
  color: #333;
  margin: 0;
}

.pending-alert strong {
  color: #fb8c00;
}
</style>