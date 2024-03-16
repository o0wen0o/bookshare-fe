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
                // User
                { path: '/users', name: 'users', component: () => import('@/views/admin/users/Browse.vue') },
                { path: '/users/:id', name: 'users-read', component: () => import('@/views/admin/users/Read.vue') },
                { path: '/users/create', name: 'users-create', component: () => import('@/views/admin/users/EditAdd.vue') },
                { path: '/users/:id/edit', name: 'users-edit', component: () => import('@/views/admin/users/EditAdd.vue') },

                { path: '/roles', name: 'roles', component: () => import('@/views/admin/roles/Browse.vue') },
                
                // Book
                { path: '/books', name: 'books', component: () => import('@/views/admin/books/Browse.vue') },
                { path: '/books/:id', name: 'books-read', component: () => import('@/views/admin/books/Read.vue') },
                { path: '/books/create', name: 'books-create', component: () => import('@/views/admin/books/EditAdd.vue') },
                { path: '/books/:id/edit', name: 'books-edit', component: () => import('@/views/admin/books/EditAdd.vue') },
                
                { path: '/genres', name: 'genres', component: () => import('@/views/admin/genres/Browse.vue') },
                { path: '/genres/:id', name: 'genres-read', component: () => import('@/views/admin/genres/Read.vue') },
                { path: '/genres/create', name: 'genres-create', component: () => import('@/views/admin/genres/EditAdd.vue') },
                { path: '/genres/:id/edit', name: 'genres-edit', component: () => import('@/views/admin/genres/EditAdd.vue') },
                
                // { path: '/book-submissions', name: 'book-submissions', component: () => import('@/views/admin/book-submissions/Browse.vue') },
                // { path: '/book-submissions/:id', name: 'book-submissions-read', component: () => import('@/views/admin/book-submissions/Read.vue') },
                
                // // Post
                // { path: '/posts', name: 'posts', component: () => import('@/views/admin/posts/Browse.vue') },
                // { path: '/posts/:id', name: 'posts-read', component: () => import('@/views/admin/posts/Read.vue') },

                // // Fundraising
                // { path: '/fundraising-organizers', name: 'fundraising-organizers', component: () => import('@/views/admin/fundraising-organizers/Browse.vue') },
                // { path: '/fundraising-organizers/:id', name: 'fundraising-organizers-read', component: () => import('@/views/admin/fundraising-organizers/Read.vue') },
                // { path: '/fundraising-organizers/create', name: 'fundraising-organizers-create', component: () => import('@/views/admin/fundraising-organizers/EditAdd.vue') },
                // { path: '/fundraising-organizers/:id/edit', name: 'fundraising-organizers-edit', component: () => import('@/views/admin/fundraising-organizers/EditAdd.vue') },

                // { path: '/fundraising-projects', name: 'fundraising-projects', component: () => import('@/views/admin/fundraising-projects/Browse.vue') },
                // { path: '/fundraising-projects/:id', name: 'fundraising-projects-read', component: () => import('@/views/admin/fundraising-projects/Read.vue') },
                // { path: '/fundraising-projects/create', name: 'fundraising-projects-create', component: () => import('@/views/admin/fundraising-projects/EditAdd.vue') },
                // { path: '/fundraising-projects/:id/edit', name: 'fundraising-projects-edit', component: () => import('@/views/admin/fundraising-projects/EditAdd.vue') },

                // { path: '/donations', name: 'donations', component: () => import('@/views/admin/donations/Browse.vue') },
                // { path: '/donations/:id', name: 'donations-read', component: () => import('@/views/admin/donations/Read.vue') },
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
