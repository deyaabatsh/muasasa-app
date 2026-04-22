import { defineStore } from 'pinia'
import api from '../api/axios'

interface Employee {
    id: number
    name: string
    email: string
    role: string
    department: string | null
    phone: string | null
    photo: string | null
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        employee: JSON.parse(localStorage.getItem('employee') || 'null') as Employee | null,
        token: localStorage.getItem('token') || null as string | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        isManager: (state) => state.employee?.role === 'مدير',
    },

    actions: {
        async login(email: string, password: string) {
            const response = await api.post('/login', { email, password })
            this.token = response.data.token
            this.employee = response.data.employee
            localStorage.setItem('token', this.token as string)
            localStorage.setItem('employee', JSON.stringify(this.employee))
            return response.data
        },

        logout() {
            this.token = null
            this.employee = null
            localStorage.removeItem('token')
            localStorage.removeItem('employee')
        }
    }
})