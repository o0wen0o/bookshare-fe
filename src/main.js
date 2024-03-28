import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from "axios";
import store from '@/net/store.js';
import 'element-plus/theme-chalk/dark/css-vars.css';

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

axios.defaults.baseURL = 'http://localhost:8081';

const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
    ssr: true,
});

app.use(router);
app.use(store);
app.use(vuetify)
app.mount('#app');
