import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

import router from './router/index.js'
import store from "@/store";
import useSettingStore from '@/store/modules/setting'

const app = createApp(App);
app.use(ElementPlus).use(router).use(store);
useSettingStore().setConfigJs();
await useSettingStore().getSetting();
useSettingStore().reloadEpgFiles();
app.mount('#app')

