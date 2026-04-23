<template>
  <div class="employees">
    <div class="header">
      <h1>الموظفون</h1>
      <button class="add-btn" @click="showModal = true">+ إضافة موظف</button>
    </div>
    <!-- طلبات الانضمام المعلقة -->
    <div class="pending-section" v-if="pendingEmployees.length > 0">
        <h2>⏳ طلبات الانضمام ({{ pendingEmployees.length }})</h2>
        <div class="table-container">
            <table>
            <thead>
                <tr>
                <th>الاسم</th>
                <th>الإيميل</th>
                <th>القسم</th>
                <th>الهاتف</th>
                <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in pendingEmployees" :key="employee.id">
                <td>{{ employee.name }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.department || '-' }}</td>
                <td>{{ employee.phone || '-' }}</td>
                <td class="actions">
                    <button class="approve-btn" @click="approveEmployee(employee.id)">✅ موافقة</button>
                    <button class="reject-btn" @click="rejectEmployee(employee.id)">❌ رفض</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    <!-- جدول الموظفين -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الإيميل</th>
            <th>الدور</th>
            <th>القسم</th>
            <th>الهاتف</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.name }}</td>
            <td>{{ employee.email }}</td>
            <td>
              <span :class="'badge ' + (employee.role === 'مدير' ? 'blue' : 'green')">
                {{ employee.role }}
              </span>
            </td>
            <td>{{ employee.department || '-' }}</td>
            <td>{{ employee.phone || '-' }}</td>
            <td>
              <button class="delete-btn" @click="deleteEmployee(employee.id)">🗑️ حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal إضافة موظف -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <h2>إضافة موظف جديد</h2>

        <div class="input-group">
          <label>الاسم</label>
          <input v-model="form.name" type="text" placeholder="اسم الموظف" />
        </div>

        <div class="input-group">
          <label>الإيميل</label>
          <input v-model="form.email" type="email" placeholder="إيميل الموظف" />
        </div>

        <div class="input-group">
          <label>كلمة المرور</label>
          <input v-model="form.password" type="password" placeholder="كلمة المرور" />
        </div>

        <div class="input-group">
          <label>الدور</label>
          <select v-model="form.role">
            <option value="موظف">موظف</option>
            <option value="مدير">مدير</option>
          </select>
        </div>

        <div class="input-group">
          <label>القسم</label>
          <input v-model="form.department" type="text" placeholder="القسم" />
        </div>

        <div class="input-group">
          <label>الهاتف</label>
          <input v-model="form.phone" type="text" placeholder="رقم الهاتف" />
        </div>

        <div class="modal-actions">
          <button class="save-btn" @click="addEmployee">حفظ</button>
          <button class="cancel-btn" @click="showModal = false">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

const employees = ref([])
const showModal = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'موظف',
  department: '',
  phone: '',
})

const fetchEmployees = async () => {
  const response = await api.get('/employees')
  employees.value = response.data
}

const addEmployee = async () => {
  try {
    await api.post('/employees', form.value)
    showModal.value = false
    form.value = { name: '', email: '', password: '', role: 'موظف', department: '', phone: '' }
    fetchEmployees()
  } catch (e) {
    console.error(e)
  }
}

const deleteEmployee = async (id: number) => {
  if (confirm('هل أنت متأكد من الحذف؟')) {
    await api.delete(`/employees/${id}`)
    fetchEmployees()
  }
}

const pendingEmployees = ref([])

const fetchPendingEmployees = async () => {
  const response = await api.get('/employees/pending')
  pendingEmployees.value = response.data
}

const approveEmployee = async (id: number) => {
  await api.post(`/employees/${id}/approve`)
  fetchPendingEmployees()
  fetchEmployees()
}

const rejectEmployee = async (id: number) => {
  if (confirm('هل أنت متأكد من رفض الطلب؟')) {
    await api.post(`/employees/${id}/reject`)
    fetchPendingEmployees()
  }
}

onMounted(() => {
  fetchEmployees()
  fetchPendingEmployees()
})

onMounted(fetchEmployees)
</script>

<style scoped>
.employees {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  color: #333;
}

.add-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
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

.badge.blue { background: #e3f2fd; color: #1a73e8; }
.badge.green { background: #e8f5e9; color: #34a853; }

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
.input-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  direction: rtl;
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
.pending-section {
  margin-bottom: 24px;
}

.pending-section h2 {
  color: #fb8c00;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 8px;
}

.approve-btn {
  background: #e8f5e9;
  color: #34a853;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.reject-btn {
  background: #ffebee;
  color: #e53935;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>