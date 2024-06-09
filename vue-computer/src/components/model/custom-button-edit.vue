<template>
    <div class="bottom-buttons">
        <el-button plain size="small" @click="buttonAddEvent">新增</el-button>
    </div>
    <div class="bottom-grid">
        <el-table :data="list" style="width:100%;height:100%;">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column label="按钮名称" prop="ButtonText"></el-table-column>
            <el-table-column label="按钮事件" prop="ButtonFunction"></el-table-column>
            <el-table-column label="排序" prop="OrderNum"></el-table-column>
            <el-table-column label="创建人" prop="CreateUserName"></el-table-column>
            <el-table-column label="创建时间">
                <template #default="scope">{{ formatDateTime(scope.row.CreateTime) }}</template>
            </el-table-column>
            <el-table-column label="编辑">
                <template #default="scope">
                    <el-button type="primary" plain size="small" @click="buttonUpdateEvent(scope.row)">修改</el-button>
                </template>
            </el-table-column>
            <el-table-column label="删除">
                <template #default="scope">
                    <el-button type="danger" plain size="small" @click="buttonDeleteEvent(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
    import {ref} from 'vue';
    import{SelectList,DoDelete,Update,GetUserName} from '@/http/index.js';
    const props = defineProps({
        data:Object
    });
    let list = ref([]);
    init();
    function init(){
        // ButtonType: 10：菜单按钮，20：列表按钮
        SelectList({
            TableName:"AkdButton",
            Where:`ForeignKeyID=${props.ID}&ButtonType=${props.ButtonType}`
        }).then(res=>{
            list.value = res;
        });
    }

    function buttonAddEvent(){
        
    }

    function buttonUpdateEvent(row){

    }

    function buttonDeleteEvent(row){
        DoDelete({
            TableName:"AkdButton",
            ID: row.ID,
            UserName:GetUserName()
        }).then(res=>{
            if(res>0){
                ElMessage('操作成功');
                loadButtons();
            }else{
                ElMessage.error('操作失败，请检查网络');
            }
        });
    }
</script>
<style scoped lang="scss">
    .bottom-buttons{
        flex: none;
        padding:10px;
    }
    .bottom-grid{
        flex: auto;
    }
</style>