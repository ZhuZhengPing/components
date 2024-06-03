import { createApp } from 'vue'
import App from './App.vue'
import "./scss/public.scss"
import router from "./router/index"
import {akdPushBack} from './directive/phone/index.js'
import "font-awesome/css/font-awesome.min.css";
import 'element-plus/dist/index.css'

window.appVue = createApp(App);
appVue.directive("akdPushBack",akdPushBack);
appVue.use(router);
appVue.mount('#app');
