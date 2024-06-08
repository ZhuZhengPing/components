<template>
    <div class="akd-header">
        <slot name="left">
            <i class="fa fa-chevron-left" @click="goBack"></i>
        </slot>
        <p>
            <slot></slot>
        </p>
        <slot name="right">
            <i></i>
        </slot>  
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter();
    function goBack(){
        router.back();
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