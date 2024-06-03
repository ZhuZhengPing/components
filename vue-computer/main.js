import { createApp } from 'vue'
import App from '@/App.vue'
import "@/scss/public.scss"
import router from "@/router/index"
import {akdPushBack} from '@/directive/phone/index.js'
import "font-awesome/css/font-awesome.min.css";
import DialogPlugin from "@/components/plugins/dialog.js";

window.appVue = createApp(App);
appVue.directive("akdPushBack", akdPushBack);
appVue.use(DialogPlugin);
appVue.use(router).mount('#app');

// console.log(appVue.$router);

