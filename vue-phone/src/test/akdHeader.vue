<template>
    <akd-header>
        测试
        <template v-slot:right>
            <!-- header 插槽的内容放这里 -->
            <i class="fa fa-refresh"></i>
        </template>
    </akd-header>
</template>

<script setup>
    import AkdHeader from "../../components/phone/akdHeader.vue"
</script>