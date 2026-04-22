<template>
  <div class="tasks">
    <h1>مهامي</h1>

    <!-- فلتر الحالة -->
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter.value"
        :class="['filter-btn', activeFilter === filter.value ? 'active' : '']"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- قائمة المهام -->
    <div class="tasks-list">
      <div v-for="task in filteredTasks" :key="task.id" class="task-card">
        <div class="task-header">
          <h3>{{ task.title }}</h3>
          <span :class="'badge ' + getStatusClass(task.status)">{{ task.status }}</span>
        </div>
        <p class="description">{{ task.description }}</p>
        <div class="task-footer">
          <span class="deadline">📅 {{ task.deadline || 'لا يوجد موعد' }}</span>
          <span class="type">🏷️ {{ task.type || 'عام' }}</span>
        </div>

        <!-- رفع التقرير -->
        <div class="report-section" v-if="task.status !== 'تم التسليم'">
          <input type="file" :id="'file-' + task.id" @change="(e) => handleFileSelect(e, task.id)" />
          <label :for="'file-' + task.id" class="upload-btn">📎 رفع تقرير</label>
          <button
            v-if="selectedFiles[task.id]"
            class="submit-btn"
            @click="uploadReport(task.id)"
          >
            ✅ إرسال
          </button>
        </div>
        <div v-else class="submitted">
          ✅ تم تسليم التقرير
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

const tasks = ref([])
const activeFilter = ref('الكل')
const selectedFiles = ref<Record<number, File>>({})

const filters = [
  { label: 'الكل', value: 'الكل' },
  { label: 'متبقي', value: 'متبقي' },
  { label: 'متأخر', value: 'متأخر' },
  { label: 'تم التسليم', value: 'تم التسليم' },
]

const filteredTasks = computed(() => {
  if (activeFilter.value === 'الكل') return tasks.value
  return tasks.value.filter((t: any) => t.status === activeFilter.value)
})

const getStatusClass = (status: string) => {
  if (status === 'تم التسليم') return 'green'
  if (status === 'متأخر') return 'red'
  return 'orange'
}

const handleFileSelect = (e: Event, taskId: number) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    selectedFiles.value[taskId] = input.files[0]
  }
}

const uploadReport = async (taskId: number) => {
  const file = selectedFiles.value[taskId]
  if (!file) return

  const formData = new FormData()
  formData.append('report_file', file)

  try {
    await api.post(`/tasks/${taskId}/report`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    delete selectedFiles.value[taskId]
    fetchTasks()
  } catch (e) {
    console.error(e)
  }
}

const fetchTasks = async () => {
  const response = await api.get('/tasks')
  tasks.value = response.data
}

onMounted(fetchTasks)
</script>

<style scoped>
.tasks {
  padding: 16px;
}

h1 {
  color: #333;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 13px;
}

.filter-btn.active {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-header h3 {
  color: #333;
  font-size: 16px;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.task-footer {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.deadline, .type {
  font-size: 12px;
  color: #666;
}

.report-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-section input[type="file"] {
  display: none;
}

.upload-btn {
  background: #e3f2fd;
  color: #1a73e8;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.submit-btn {
  background: #34a853;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.submitted {
  color: #34a853;
  font-size: 13px;
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