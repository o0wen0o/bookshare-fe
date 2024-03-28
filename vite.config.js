import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath, URL } from 'node:url';
import dns from 'dns';
import vuetify from 'vite-plugin-vuetify';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        disableHostCheck: true,
        host: 'localhost',
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    plugins: [
        vue(),
        vuetify({
            autoImport: { labs: true }
        }),
        AutoImport({
            resolvers: [
                ElementPlusResolver()
            ],
        }),
        Components({
            resolvers: [
                ElementPlusResolver()
            ],
        }),
    ],
    define: {
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true, // Set this flag to true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)) // import.meta.url provides the URL of the current module
        }
    }
})
