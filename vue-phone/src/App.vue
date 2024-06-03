<template>
    <div class="container">
        <div class="from-item">
            <h3>手机端组件</h3>
            <p @click="toAkdHeader">头部导航</p>
            <p @click="toAkdPushBack">左拉返回</p>
            <p @click="toAkdDate">日期选择</p>
            <p @click="toAkdSelect">下拉框</p>
        </div>
    </div>
</template>
<script setup>
    import {useRouter} from 'vue-router';
    let router = useRouter();

    function toAkdHeader(){
        router.push({
            path:'/test-phone-akd-header'
        });
    }

    function toAkdPushBack(){
        router.push({
            path:'/test-phone-akd-push-back'
        });
    }

    function toAkdDate(e){
        router.push({
            path:'/test-phone-akd-date-picker'
        });
    }

    function toAkdSelect(e){
        router.push({
            path:'/test-phone-akd-select'
        })
    }
</script>
<style scoped lang="scss">
    @import "../scss/public.scss";
    .container{
        padding: $padding;
        height: 100%;
        overflow: auto;
        .from-item{
            line-height: $line-height;
            
            h3{
                font-size:$font-size-big;    
            }
            p{
                color:white;
                background-color: #6b4e43;
                padding-left: $padding;
                margin:$padding-small 0;
                border-radius: $border-radius;
            }
        }
    }
</style>