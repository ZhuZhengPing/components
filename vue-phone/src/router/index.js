
import { createRouter,createWebHashHistory } from 'vue-router'
//console.log("router");
export default createRouter({
    history: createWebHashHistory(),
    routes:[
        {
            name:"/",
            component:()=>import("./"),
            meta:0
        },
        {
            path:"/test-akd-header",
            component:()=>import("../test/akdHeader.vue"),
            meta:1
        },
        {
            path:"/test-phone-akd-push-back",
            component:()=>import("../test/akdPushBack.vue"),
            meta:1
        },
        {
            path:"/test-phone-akd-date-picker",
            component:()=>import("../test/akdDatePicker.vue"),
            meta:1
        },
        {
            path:"/test-phone-akd-select",
            component:()=>import("../test/akdSelect.vue"),
            meta:1
        },
        {
            path:"/test-computer-akd-login",
            component:()=>import("../test/akdLogin.vue"),
            meta:1
        }
    ]
})