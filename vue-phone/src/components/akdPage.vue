<template>
    <div class="scroll-content" @scroll="scrollEvent">
        <div class="form-item" v-for="item in list" :key="item._index">
            <slot name="item" v-bind="{item}"></slot>
        </div>

        <transition name="fade-in-opacity">
            <div class="bottom">
                <transition name="fade-in-opacity" v-if="loading">
                    <p><i></i><i></i><i></i></p>
                </transition>
                <transition name="fade-in-opacity" v-else>
                    <p v-if="!hasMore"><span>没有更多了</span></p>
                </transition>
            </div>
        </transition>
    </div>
</template>
<script setup>
    import {ref,watch} from "vue";
    const props = defineProps({
        ajaxFunction:Function,
        where:Object
    });

    let loading = ref(false);
    let list=ref([]);
    let hasMore=ref(true);
    let where = {...props.where};
    let total = ref(0);
    
    init();

    function init(){
        if(!where.PageIndex){
            where.PageIndex=0;
        }
        if(!where.PageSize){
            where.PageSize=20;
        }
        loadMore();
    }

    watch(() => props.where, (newValue, oldValue) => {
        where = {
            ...where,
            ...newValue
        };
        loadMore();
    },{deep: true});

    function loadMore(callback) {
        loading.value=true;
        props.ajaxFunction(where).then(res=>{
            total.value = res.total;
            if(where.PageIndex==0){
                list.value=[];
            }
            if(res.data.length){
                res.data.map((p,i)=>{
                    p._index = where.PageIndex*where.PageSize + i+1;
                });
                list.value.push(...res.data);
            }
            
            if(res.data.length<where.PageSize){
                hasMore.value=false;
            }
            where.PageIndex++;
            if(callback){
                callback(true);
            }
        }).catch(err=>{
            if(callback){
                callback(false);
            }
        })
        .finally(()=>{
            loading.value = false;
        });
    }

    function refreshLoadMore(callback){
        where.PageIndex=0;
        loadMore(callback);
    }

    function scrollEvent(e){
        let target = e.target || e.srcElement;
        if(loading.value==false && hasMore.value==true && target.scrollHeight - target.scrollTop - target.clientHeight < 50){
            loadMore();
        }
    }

    //公开参数  
    defineExpose({
        akdPageData:{
            total,
            refreshLoadMore
        }
    });
</script>

<style scoped lang="scss">
    @import "@/scss/form-item.scss";

    .scroll-content{
        flex: auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding:0 10px;
        -webkit-overflow-scrolling: touch;
        position: relative;

        .bottom {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 42px;
            line-height: 42px;
            text-align: center;
            i {
                background-color: gray;
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin: 0 10px;
                animation: scaling 1s linear infinite;
                &:nth-child(2) {
                animation-delay: 300ms;
                }
                &:nth-child(3) {
                animation-delay: 600ms;
                }
            }
            span {
                position: relative;
                display: inline-block;
                width: 80vw;
                height: 3px;
                background-color: gray;
                font-size: 14px;
                font-family: 微软雅黑;
                margin-top: 40px;
                color: #ababab;
                &:after {
                position: absolute;
                content: "";
                left: 0;
                bottom: 5px;
                width: 100%;
                height: 1px;
                background-color: gray;
                }
            }
        }

        @keyframes scaling {
            0% {
            transform: scale(1.5);
            }
            50% {
            transform: scale(0.8);
            }
            100% {
            transform: scale(1.5);
            }
        }
    }
</style>