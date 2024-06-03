<template>
    <div class="container">
        <div class="content">
            <h1 class="banner">后台管理系统</h1>
            <div class="from">
                <div class="from-item">
                    <i class="fa fa-user"></i>
                    <input type="text" placeholder="请输入账号" v-model="user.UserID" />
                </div>
                <div class="from-item">
                    <i class="fa fa-lock"></i>
                    <input type="text" placeholder="请输入密码" v-model="user.Password" />
                </div>
            </div>
            <div class="footer">
                <input type="button" value="登录" @click="doLoginEvent"/>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {reactive} from "vue"
    import { ElMessage } from 'element-plus'
    import {DoLogin,SetToken} from "../public/request.js"
    import { useRouter} from 'vue-router'

    const router = useRouter();

    let user = reactive({
        UserID:'',
        Password:''
    });

    function doLoginEvent() {
        // remove blank spaces
        user.UserID = user.UserID.replace(/^\s+|\s+$/,"");
        user.Password = user.Password.replace(/^\s+|\s+$/,"");
        if(!user.UserID){
            ElMessage.error('请输入账号');
            return;
        }
        if(!user.Password){
            ElMessage.error('请输入密码');
            return;
        }
        
        DoLogin(user).then(res=>{
            SetToken(JSON.stringify(res));
            router.push({
                path:'/index'
            });
        });
    }
</script>

<style lang="scss" scoped>
    .container{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#333;
        font-size: 14px;
        background-repeat: no-repeat; /* 背景图片不重复 */
        background-size: cover; /* 拉伸或缩放背景图片以填充整个容器 */
        background-position: center center; /* 居中对齐背景图片 */
        .content{
            border: 1px solid #e1e1e1;
            padding:15px 20px 30px 20px; 
            background-color: white;
            border-radius: 5px;
            .banner{
                font-size: 20px;
                color: rgb(29 45 95);
            }

            .from-item{
                margin:15px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                border:1px solid #e1e1e1;
                :focus{
                    border-color: #1890ff;
                }
                i{
                    display: block;
                    flex: none;
                    width: 30px;
                    text-align: center;
                    color:rgb(184, 184, 184);
                    font-size: 16px;
                }
                input{
                    border: 0;
                    height: inherit;
                    width:100%;
                    background-color: transparent;
                    width:260px;
                }
            }

            .footer{
                
                input{
                    color:white;
                    background-color: cadetblue;
                    width:100%;
                    border: 0;
                    height: 40px;
                }
            }
        }
    }
</style>