import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/manager',
        component: () => import('../layouts/ManagerLayout.vue'),
        meta: { requiresAuth: true, role: 'مدير' },
        children: [
            {
                path: 'settings',
                name: 'manager-settings',
                component: () => import('../views/manager/SettingsView.vue')
            },
            {
                path: 'dashboard',
                name: 'manager-dashboard',
                component: () => import('../views/manager/DashboardView.vue')
            },
            {
                path: 'employees',
                name: 'manager-employees',
                component: () => import('../views/manager/EmployeesView.vue')
            },
            {
                path: 'tasks',
                name: 'manager-tasks',
                component: () => import('../views/manager/TasksView.vue')
            },
            {
                path: 'attendance',
                name: 'manager-attendance',
                component: () => import('../views/manager/AttendanceView.vue')
            },
            {
                path: 'chat',
                name: 'manager-chat',
                component: () => import('../views/manager/ChatView.vue')
            },
        ]
    },
    {
        path: '/employee',
        component: () => import('../layouts/EmployeeLayout.vue'),
        meta: { requiresAuth: true, role: 'موظف' },
        children: [
            {
                path: 'settings',
                name: 'employee-settings',
                component: () => import('../views/employee/SettingsView.vue')
            },
            {
                path: 'dashboard',
                name: 'employee-dashboard',
                component: () => import('../views/employee/DashboardView.vue')
            },
            {
                path: 'tasks',
                name: 'employee-tasks',
                component: () => import('../views/employee/TasksView.vue')
            },
            {
                path: 'attendance',
                name: 'employee-attendance',
                component: () => import('../views/employee/AttendanceView.vue')
            },
            {
                path: 'chat',
                name: 'employee-chat',
                component: () => import('../views/employee/ChatView.vue')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        next('/login')
    } else if (to.path === '/login' && authStore.isLoggedIn) {
        if (authStore.isManager) {
            next('/manager/dashboard')
        } else {
            next('/employee/dashboard')
        }
    } else {
        next()
    }
})

export default router