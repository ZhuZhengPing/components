<template>
    <div class="container-index">
        <div class="menu-index">
            <el-menu @select="selectMenuEvent" background-color="#545c64"
                             text-color="#fff"
                             active-text-color="#ffd04b">
                <el-sub-menu v-for="(item) in form.menus" :index="item.ID+''" :key="'submenu-'+item.ID">
                    <template #title>
                        <el-icon :size="16"><Setting /></el-icon>
                        <span>{{item.MenuName}}</span>
                    </template>
                    <el-menu-item  v-for="(temp,i) in item.Details" :index="temp.ID+''" :url="temp.Url" :key="'menuitem-'+i">
                        <el-icon><Menu /></el-icon> {{temp.MenuName}}
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>
        <div class="main-index">
            <div class="top-index">
                <p>首页</p>
                
                <el-menu mode="horizontal" :ellipsis="false" style="height:100%;border-bottom:none;">
                    <el-sub-menu index="2-0">
                        <template #title><span style="color:gray;font-size:12px;">{{GetUserName()}}，欢迎你</span></template>
                        <el-menu-item index="2-1" @click="modifyPasswordEvent();">修改密码</el-menu-item>
                        <el-menu-item index="2-2" @click="loginOutEvent()">退出登录</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>
            <div class="content-index">
                <el-tabs type="border-card" v-model="form.activeTab" :closable="true"  @tab-remove="tabRemoveEvent">
                    <el-tab-pane v-for="item in form.openedTabs"  :label="item.name" :name="item.id" :key="item.url">
                        <router-view :name="item.url"></router-view>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {reactive,onMounted} from 'vue';
    import {SelectList,GetUserName} from '@/http/index.js';
    import {Setting,Menu} from '@element-plus/icons-vue';
    import { useRouter } from 'vue-router';
    

    const router = useRouter();
    let menusAll=[];

    let form = reactive({
        menus:[],
        activeMenu:"",
        openedTabs:[{
            name:"欢迎",
            id:'0',
            url:"welcome"
        }],
        activeTab: '0'
    });

    onMounted(async() => {
        const currentPath = router.path;
        const currentTab = form.openedTabs.find(tab => tab.url === currentPath);
        if (currentTab) {
            form.activeTab = currentTab.id;
        } else {
            router.push('/index/detail');
        }

        menusAll = await SelectList({
            TableName:"AkdMenu"
        });

        form.menus=menusAll.filter(p=>p.ParentID==0).map(p=>{
            p.Details = menusAll.filter(k=>k.ParentID==p.ID);
            return p;
        });
    });

    function selectMenuEvent(id){
        // 判断选项卡是否已经打开
      if (!form.openedTabs.some(tab => tab.id == id)) {
        const menu = menusAll.find(menu => menu.ID == id);
        form.openedTabs.push({
          id: id,
          name: menu.MenuName,
          url:menu.URL
        });
        router.push('/index/detail');
      }
        form.activeTab=id;
    }

    function tabRemoveEvent(tab){
        console.log(tab);
        const index = form.openedTabs.findIndex(t => t.id == tab);
        form.openedTabs.splice(index, 1);

        
    }
</script>

<style lang="scss" scoped>
    .container-index{
       display: flex;
       height: 100%;
       width:100%;

       .menu-index{
           flex:none;
           width:205px;
           height: 100%;
           .el-menu{
               height: 100%;
           }
           .el-menu--inline{
               .is-active{
                   background-color: rgb(70 77 83);
               }
           }
       }

       .main-index{
            flex:auto;
            overflow: auto;
           display: flex;
           flex-direction: column;
           width:100%;
           .top-index{
               flex:none;
               box-shadow: 0px 1px 3px #ccc;
               display: flex;  
               justify-content: space-between;
               padding: 0 20px;
               line-height: 50px;
               height: 50px;
               margin-bottom: 5px;
               p{
                   color:#606266;
               }
           }
           .content-index{
               width:100%;
               height: 100%;
                
               .el-tabs--border-card{
                   display: flex;
                   flex-direction: column;
                   height: 100%;
                   :deep(.el-tabs__content){
                       flex: auto;
                       .el-tab-pane{
                           height: 100%;
                       }
                   }
                   :deep(.el-tabs__header){
                       flex: none;
                   }
               }
           }
       }
    }
</style>