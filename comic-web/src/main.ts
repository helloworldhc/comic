// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router';
import axios from 'axios';
import * as Icons from '@element-plus/icons-vue'
import znCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus, {
  locale: znCn
})
app.use(createPinia())
app.use(router)

const instance = axios.create({ baseURL: import.meta.env.VITE_API_ENDPOINT });
app.config.globalProperties.axios = instance;
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.mount('#app')
