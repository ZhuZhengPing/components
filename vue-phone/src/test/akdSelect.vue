<template>
    <akd-select v-akd-push-back v-model="tempDate" placeholder="请选择">
        <p value="1">苹果</p>
        <p value="2">桔子</p>
        <p value="3">香蕉</p>
    </akd-select>
</template>

<script setup>
    import {ref} from "vue"
    import akdSelect from "../../components/phone/akdSelect.vue"

    let tempDate = ref("苹果");

</script> 