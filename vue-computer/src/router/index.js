
import { createRouter,createWebHashHistory } from 'vue-router'
//console.log("router");
const router =  createRouter({
    history: createWebHashHistory(),
    routes:[
        {
            path:"/",
            redirect: "/login"
        },
        {
            path:"/login",
            component:()=>import("../components/login.vue")
        },
        {
            path:"/index",
            component:()=>import("../components/index.vue"),
            children: [
                {
                    path:"detail",
                    components:{
                        welcome:()=>import("../components/pages/welcome.vue"),
                        "table-manager":()=>import("../components/pages/table-manager.vue"),
                        "table-page":()=>import("../components/template/table-page.vue"),
                        "table-top-down-page":()=>import("../components/template/table-top-down-page.vue"),
                        "menu-manager":()=>import("../components/pages/menu-manager.vue")
                    }
                }
            ],
            meta:1
        }
    ]
});

router.beforeEach((to,form,next)=>{
    if(to.meta.index>form.meta.index){
        to.meta.transition = "router-back";
    }else{
        to.meta.transition = "router-next";
    }
    next();
});

export default router;