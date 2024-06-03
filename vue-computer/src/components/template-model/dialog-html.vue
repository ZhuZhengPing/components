<template>
  <el-dialog
    v-model:visible="visible"
    :title="title"
    :width="width">
      <runtime-template :template="content" />
    <template #footer>
      <el-button @click="cancelEvent">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import RuntimeTemplate from 'vue3-runtime-template';
    import { ElDialog,ElButton } from 'element-plus';

    const props = defineProps({
        visible:Boolean,
        title:String,
        width:String,
        content:String,
        onConfirm: Function,
        onCancel: Function
    });

    const emits = defineEmits(['update:visible']);
    const visible = ref(props.visible);
    const content = ref(props.content);
    
    watch(() => props.visible, (newVal) => {
        visible.value = newVal;
    });
    
    function confirmEvent (){
        props.onConfirm();
        visible.value = false;
        emits('update:visible', false);
    };

    function cancelEvent() {
        props.onCancel();
        visible.value = false;
        emits('update:visible', false);
    };

</script>