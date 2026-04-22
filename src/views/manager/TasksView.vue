<template>
  <div class="tasks">
    <div class="header">
      <h1>المهام</h1>
      <button class="add-btn" @click="showModal = true">+ إضافة مهمة</button>
    </div>

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

    <!-- جدول المهام -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>المهمة</th>
            <th>الموظف</th>
            <th>النوع</th>
            <th>الموعد</th>
            <th>الحالة</th>
            <th>التقرير</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>
              <strong>{{ task.title }}</strong>
              <p style="font-size:12px;color:#666">{{ task.description }}</p>
            </td>
            <td>{{ task.employee?.name }}</td>
            <td>{{ task.type || '-' }}</td>
            <td>{{ task.deadline || '-' }}</td>
            <td>
              <span :class="'badge ' + getStatusClass(task.status)">
                {{ task.status }}
              </span>
            </td>
            <td>
              <a v-if="task.report_file" :href="'http://127.0.0.1:8000/storage/' + task.report_file" target="_blank">
                📄 عرض
              </a>
              <span v-else>-</span>
            </td>
            <td>
              <button class="delete-btn" @click="deleteTask(task.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal إضافة مهمة -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <h2>إضافة مهمة جديدة</h2>

        <div class="input-group">
          <label>عنوان المهمة</label>
          <input v-model="form.title" type="text" placeholder="عنوان المهمة" />
        </div>

        <div class="input-group">
          <label>وصف المهمة</label>
          <textarea v-model="form.description" placeholder="وصف المهمة"></textarea>
        </div>

        <div class="input-group">
          <label>نوع المهمة</label>
          <input v-model="form.type" type="text" placeholder="نوع المهمة" />
        </div>

        <div class="input-group">
          <label>الموظف المسؤول</label>
          <select v-model="form.employee_id">
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.name }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>تاريخ التسليم</label>
          <input v-model="form.deadline" type="date" />
        </div>

        <div class="modal-actions">
          <button class="save-btn" @click="addTask">حفظ</button>
          <button class="cancel-btn" @click="showModal = false">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

const tasks = ref([])
const employees = ref([])
const showModal = ref(false)
const activeFilter = ref('الكل')

const filters = [
  { label: 'الكل', value: 'الكل' },
  { label: 'متبقي', value: 'متبقي' },
  { label: 'متأخر', value: 'متأخر' },
  { label: 'تم التسليم', value: 'تم التسليم' },
]

const form = ref({
  title: '',
  description: '',
  type: '',
  employee_id: '',
  deadline: '',
  status: 'متبقي',
})

const filteredTasks = computed(() => {
  if (activeFilter.value === 'الكل') return tasks.value
  return tasks.value.filter((t: any) => t.status === activeFilter.value)
})

const getStatusClass = (status: string) => {
  if (status === 'تم التسليم') return 'green'
  if (status === 'متأخر') return 'red'
  return 'orange'
}

const fetchTasks = async () => {
  const response = await api.get('/tasks')
  tasks.value = response.data
}

const fetchEmployees = async () => {
  const response = await api.get('/employees')
  employees.value = response.data
}

const addTask = async () => {
  try {
    await api.post('/tasks', form.value)
    showModal.value = false
    form.value = { title: '', description: '', type: '', employee_id: '', deadline: '', status: 'متبقي' }
    fetchTasks()
  } catch (e) {
    console.error(e)
  }
}

const deleteTask = async (id: number) => {
  if (confirm('هل أنت متأكد من الحذف؟')) {
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }
}

onMounted(() => {
  fetchTasks()
  fetchEmployees()
})
</script>

<style scoped>
.tasks {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 { color: #333; }

.add-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 8px 16px;
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

.delete-btn {
  background: #ffebee;
  color: #e53935;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 20px;
  color: #333;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  direction: rtl;
}

.input-group textarea {
  height: 80px;
  resize: none;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.save-btn {
  flex: 1;
  background: #1a73e8;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  flex: 1;
  background: #f5f5f5;
  color: #333;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>