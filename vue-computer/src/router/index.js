
import { createRouter,createWebHashHistory } from 'vue-router'
//console.log("router");
const router =  createRouter({
    history: createWebHashHistory(),
    routes:[
        {
            path:"/",
            redirect: "/login",
            meta:0
        },
        {
            path:"/login",
            component:()=>import("../components/login.vue"),
            meta:1
        },
        {
            path:"/index",
            component:()=>import("../components/index.vue"),
            children: [
                {
                    path:"welcome",
                    component:()=>import("../components/pages/welcome.vue")
                },
                {
                    path:"table-manager",
                    component:()=>import("../components/pages/table-manager.vue")
                },
                {
                    path:"table-page",
                    component:()=>import("../components/template/table-page.vue")
                },
                {
                    path:"table-top-down-page",
                    component:()=>import("../components/template/table-top-down-page.vue")
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