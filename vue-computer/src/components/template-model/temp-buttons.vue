<template>
    <el-form-item v-for="item in buttons" :key="item.ID"> 
        <el-button plain type="primary" @click="buttonFunctionEvent"> {{item.ButtonText}} </el-button>
    </el-form-item>
</template>
<script setup>

    import {reactive} from 'vue';
    import { ElFormItem,ElButton } from 'element-plus';

    // where is bind model, used for the export button
    const where = defineModel();

    const props = defineProps({
        entity:String,
        buttons:Array
    });
    let buttons = reactive(props.buttons);

    const emits = defineEmits(['button-event']);

    async function buttonFunctionEvent(button){
        let tempEvent = eval('('+button.ButtonFunction+')') ;
        tempEvent(props.entity,where.value,emits);
    }
</script>