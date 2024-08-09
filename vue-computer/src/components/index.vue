<template>
    <div class="container-index">
        <div class="menu-index">
            <el-menu @select="selectMenuEvent" 
                     background-color="#545c64"
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

        <el-dialog title="修改密码" v-model="passowrdForm.dialogVisible" center append-to-body width="385px">
            <div class="login-container">
                <div class="controls">
                    <label>
                        <el-icon>
                            <User />
                        </el-icon>
                    </label>
                    <input type="text" v-model.trim="passowrdForm.password" placeholder="新密码" />
                </div>
                <div class="controls">
                    <label>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </label>
                    <input type="password" v-model.trim="passowrdForm.passwordConfirm" placeholder="确认密码" />
                </div>
                <div>
                    <button class="bottons" @click="updatePassword">修改密码</button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
    import {reactive,onMounted} from 'vue';
    import {SelectList,GetUserName,SetToken} from '@/http/index.js';
    import {Setting,Menu,User} from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    let menusAll=[];
    let passowrdForm = reactive({
        dialogVisible:false,
        password:"",
        passwordConfirm:""
    });

    let form = reactive({
        menus:[],
        activeMenu:"0",
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
        
        let tempUrl = menu.URL;
        let tempUrlArray = menu.URL.split('?');
        let args={};
        if(tempUrlArray.length==2){
            tempUrl = tempUrlArray[1];
            tempUrlArray = tempUrl.split('&');

            let item = null; 
            for(var i=0;i<tempUrlArray.length;i++){
                item = tempUrlArray[i].split('=');
                args[item[0]] = item[1];
            }
        }

        router.push({
            path:'/index/detail',
            query:args
        });
      }
      form.activeTab=id;
    }

    function tabRemoveEvent(tab){
        const index = form.openedTabs.findIndex(t => t.id == tab);
        form.openedTabs.splice(index, 1);
    }

    function loginOutEvent(){
        SetToken("");
        router.push({
            path:'/login'
        });
    }

    function updatePassword(){
        if(!passowrdForm.password){
            ElMessage.error('请输入新密码');
            return;
        }
        if(!passowrdForm.passwordConfirm){
            ElMessage.error('请输入确认密码');
            return;
        }
        if(passowrdForm.password != passowrdForm.passwordConfirm){
            ElMessage.error('新密码和确认密码不一致');
            return;
        }
        
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