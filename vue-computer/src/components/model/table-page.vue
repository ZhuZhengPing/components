<template>
    <div class="content-form">
        <el-form label-position="right" :inline="true" :label-width="80">
            <solt name="input"></solt>
            <template v-if="advanceSearch">
                <solt name="advance"></solt>
                <el-form-item v-if="!advanceSearch">
                    <el-button plain @click="advanceSearch=true"> 高级筛选 </el-button>
                </el-form-item>
                <el-form-item v-else>
                    <el-button plain @click="advanceSearch=false"> 收起 </el-button>
                </el-form-item>
            </template>
            <solt name="button"></solt>
        </el-form>
    </div>
</template>
<script setup>
    import {ref} from "vue";
    let advanceSearch=ref(false);
</script>
<style scoped lang="scss">
    .content-form{
        flex:none;
    }
</style>