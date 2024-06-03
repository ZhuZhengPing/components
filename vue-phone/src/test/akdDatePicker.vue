<template>
    <akd-date-picker v-akd-push-back v-model="tempDate" placeholder="请输入标题"></akd-date-picker>
</template>

<script setup>
    import {ref} from "vue"
    import akdDatePicker from "../../components/phone/akdDatePicker.vue"

    let tempDate = ref("2023-11-11");

</script> 