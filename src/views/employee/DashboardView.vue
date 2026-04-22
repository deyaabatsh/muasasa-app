<template>
  <div class="dashboard">
    <div class="welcome">
      <h1>أهلاً، {{ employee?.name }} 👋</h1>
      <p>{{ today }}</p>
    </div>

    <!-- بطاقات سريعة -->
    <div class="stats-grid">
      <div class="stat-card blue">
        <span class="icon">✅</span>
        <div>
          <h3>{{ myTasks.length }}</h3>
          <p>مهامي</p>
        </div>
      </div>
      <div class="stat-card orange">
        <span class="icon">⏳</span>
        <div>
          <h3>{{ pendingTasks }}</h3>
          <p>متبقية</p>
        </div>
      </div>
      <div class="stat-card green">
        <span class="icon">📋</span>
        <div>
          <h3>{{ doneTasks }}</h3>
          <p>منجزة</p>
        </div>
      </div>
    </div>

    <!-- حالة الحضور اليوم -->
    <div class="attendance-card">
      <h2>حضوري اليوم</h2>
      <div v-if="todayAttendance" class="attendance-info">
        <div class="time-item">
          <span class="label">وقت الدخول</span>
          <span class="value green">{{ todayAttendance.check_in || '-' }}</span>
        </div>
        <div class="time-item">
          <span class="label">وقت الخروج</span>
          <span class="value red">{{ todayAttendance.check_out || 'لم يسجل بعد' }}</span>
        </div>
      </div>
      <div v-else class="no-attendance">
        <p>لم تسجل حضورك اليوم</p>
      </div>
    </div>

    <!-- آخر المهام -->
    <div class="tasks-card">
      <h2>آخر مهامي</h2>
      <div v-for="task in myTasks.slice(0, 3)" :key="task.id" class="task-item">
        <div class="task-info">
          <strong>{{ task.title }}</strong>
          <p>{{ task.deadline }}</p>
        </div>
        <span :class="'badge ' + getStatusClass(task.status)">{{ task.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const employee = authStore.employee

const myTasks = ref([])
const todayAttendance = ref(null)
const today = new Date().toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const pendingTasks = computed(() => myTasks.value.filter((t: any) => t.status === 'متبقي').length)
const doneTasks = computed(() => myTasks.value.filter((t: any) => t.status === 'تم التسليم').length)

const getStatusClass = (status: string) => {
  if (status === 'تم التسليم') return 'green'
  if (status === 'متأخر') return 'red'
  return 'orange'
}

onMounted(async () => {
  const [tasks, attendance] = await Promise.all([
    api.get('/tasks'),
    api.get('/attendance'),
  ])
  myTasks.value = tasks.data
  const today = new Date().toISOString().split('T')[0]
  todayAttendance.value = attendance.data.find((a: any) => a.date === today) || null
})
</script>

<style scoped>
.dashboard {
  padding: 16px;
}

.welcome {
  margin-bottom: 20px;
}

.welcome h1 {
  color: #333;
  font-size: 22px;
}

.welcome p {
  color: #666;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.stat-card .icon { font-size: 28px; }
.stat-card h3 { font-size: 24px; font-weight: bold; }
.stat-card p { color: #666; font-size: 12px; }

.stat-card.blue h3 { color: #1a73e8; }
.stat-card.green h3 { color: #34a853; }
.stat-card.orange h3 { color: #fb8c00; }

.attendance-card,
.tasks-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.attendance-card h2,
.tasks-card h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 16px;
}

.attendance-info {
  display: flex;
  gap: 20px;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #666;
}

.value {
  font-size: 18px;
  font-weight: bold;
}

.value.green { color: #34a853; }
.value.red { color: #e53935; }

.no-attendance p {
  color: #666;
  font-size: 14px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.task-info strong {
  display: block;
  color: #333;
  font-size: 14px;
}

.task-info p {
  color: #666;
  font-size: 12px;
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