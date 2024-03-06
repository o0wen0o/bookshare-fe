import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/net";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
                { path: '', name: 'login', component: () => import('@/views/welcome/LoginPage.vue') },
                { path: 'register', name: 'register', component: () => import('@/views/welcome/RegisterPage.vue') },
                { path: 'forget', name: 'forget', component: () => import('@/views/welcome/ForgetPage.vue') }
            ]
        }, {
            path: '/index',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
        }, {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/AdminPanelView.vue'),
            children: [
                { path: '', redirect: 'users' }, // Redirect from /admin to /admin/users
                { path: '/users', name: 'users', component: () => import('@/views/admin/users/Browse.vue') },
                { path: '/roles', name: 'roles', component: () => import('@/views/admin/roles/Browse.vue') },
                { path: '/books', name: 'books', component: () => import('@/views/admin/books/Browse.vue') },
                { path: '/book-comments', name: 'book-comments', component: () => import('@/views/admin/book-comments/Browse.vue') },
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized();
    if (to.name.startsWith('welcome') && !isUnauthorized) {
        next('/index');
    } else if (to.fullPath.startsWith('/index') && isUnauthorized) {
        next('/');
    } else {
        next(); // proceed as usual
    }
});

export default router;
