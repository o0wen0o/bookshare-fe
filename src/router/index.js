import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/net/index.js";
import { ElMessage } from 'element-plus';
import store from "@/net/store.js";
import { deleteAccessToken } from "@/net/auth.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
                { path: '', name: 'welcome-login', component: () => import('@/views/welcome/LoginPage.vue') },
                { path: 'register', name: 'welcome-register', component: () => import('@/views/welcome/RegisterPage.vue') },
                { path: 'forget', name: 'welcome-forget', component: () => import('@/views/welcome/ForgetPage.vue') }
            ]
        }, {
            path: '/index',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
            meta: { requiresAuth: true },
        }, {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/AdminPanelView.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
            redirect: 'users',
            children: [
                { path: '/users', name: 'users', component: () => import('@/views/admin/users/Browse.vue') },
                { path: '/users/:id', name: 'users-read', component: () => import('@/views/admin/users/Read.vue') },
                { path: '/users/create', name: 'users-create', component: () => import('@/views/admin/users/EditAdd.vue') },
                { path: '/users/:id/edit', name: 'users-edit', component: () => import('@/views/admin/users/EditAdd.vue') },

                { path: '/roles', name: 'roles', component: () => import('@/views/admin/roles/Browse.vue') },
                { path: '/books', name: 'books', component: () => import('@/views/admin/books/Browse.vue') },
                { path: '/book-comments', name: 'book-comments', component: () => import('@/views/admin/book-comments/Browse.vue') },
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    // Redirect logic for unauthorized access to '/index' path
    if (requiresAuth && isUnauthorized) {
        // If the route requires authentication and user is unauthorized
        deleteAccessToken();
        ElMessage.warning('Please log in to continue.');
        next('/');
        return;
    }

    // Redirect logic for authorized access
    if (to.name?.startsWith('welcome')) {
        if (!isUnauthorized) {
            // If coming from an admin route and user is authorized, redirect to /admin
            if (store.getters.userRoles.includes("Admin")) {
                next('/admin');
                return;
            } else {
                // If authorized but not coming from an admin route, redirect to /index
                next('/index');
                return;
            }
        }
    }

    // Admin role protection
    if (requiresAdmin && !store.getters.userRoles.includes("Admin")) {
        // If the route requires an Admin role and the user does not have it
        ElMessage.warning('You do not have permission to access this page');
        next(isUnauthorized ? '/' : '/index'); // Redirect to home if unauthorized, else to index
        return;
    }

    next(); // This is the default case if none of the above conditions are met
});

export default router;
