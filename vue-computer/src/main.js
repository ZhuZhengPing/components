import { createApp } from 'vue'
import App from './App.vue'
import "@/scss/public.scss"
import router from "@/router/index"
import "font-awesome/css/font-awesome.min.css";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import DialogPlugin from '@/plugins/dialog.js';
import DialogHTMLPlugin from '@/plugins/dialog-html.js';

window.appVue = createApp(App);
appVue.use(ElementPlus);
appVue.use(DialogPlugin);
appVue.use(DialogHTMLPlugin);
appVue.use(router);
appVue.mount('#app');


