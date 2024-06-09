<template>
    <div class="akd-header">
        <slot name="left">
            <i class="fa fa-chevron-left" @click="goBack"></i>
        </slot>
        <div class="search-input">
            <input type="text" placeholder="请输入关键字搜索" @input.trim="searchEvent" v-model="searchText">
            <b class="fa fa-times" v-show="searchText" @click="clearInputEvent"></b>
        </div>
        <slot name="right">
            <i></i>
        </slot>
    </div>
</template>
<script setup>
import {ref} from "vue";
    import { useRouter } from 'vue-router';
    import {debounce} from "@/public/index.js";
    const router = useRouter();
    function goBack(){
        router.back();
    }

    let searchText = ref("");

    const props = defineProps({
        event:Function
    });

    function searchEvent(e){
        debounce(()=>{
            props.event(searchText,e);
        },300)(e);
    }
    function clearInputEvent(e){
        searchText.value="";
        props.event(searchText,e);
    }
</script>
<style scoped lang="scss">
    .akd-header {
        height: 50px;
        line-height: 50px;
        display: flex;
        align-items: center;
        background-color: #f17a06;
        position: relative;
        color: #fff;
        .search-input {
            position: relative;
            height: 36px;
            display: flex;
            align-items: center;
            background-color: white;
            border-radius: 18px;
            padding-left: 18px;
            padding-right: 2px;
            width:100%;
            input{
                height: 100%;
                flex: auto;
                border: none;
                outline: none;
                border-radius: 18px;
                font-size: 14px;
            }
            b{
                margin-right: 0px;
                background-color: transparent;
                color: #333;
                height: 36px;
                width: 36px;
                text-align: center;
                line-height: 36px;
            }
        }
        i{
            width: 50px;
            text-align: center;
            height: inherit;
            line-height: inherit;
            font-size: 20px;
        }
        p{
            flex: auto;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            line-height: inherit;
        }
    }
</style>