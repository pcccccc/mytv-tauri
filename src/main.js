import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
// import VueVirtualScroller from 'vue-virtual-scroller'
import router from './router/index.js'
import store from "@/store";
import {mounted} from "@/mounted/index.js";
import { ElNotification } from 'element-plus'


const app = createApp(App);

app.use(ElementPlus)
    // .use(VueVirtualScroller)
    .use(router)
    .use(store);
// await mounted();
app.mount('#app')

