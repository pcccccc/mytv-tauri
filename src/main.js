import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
// import VueVirtualScroller from 'vue-virtual-scroller'
import router from './router/index.js'
import store from "@/store";
import {disableDevToolsAndContextMenu, downloadM3uAndEpg, mounted} from "@/mounted/index.js";
const app = createApp(App);

app.use(ElementPlus)
    // .use(VueVirtualScroller)
    .use(router)
    .use(store);
const initApp = async () => {
    if (import.meta.env.PROD) {
        disableDevToolsAndContextMenu();
    }
    await mounted();
    app.mount('#app');
};

initApp().then(async res => {
    await downloadM3uAndEpg();
});