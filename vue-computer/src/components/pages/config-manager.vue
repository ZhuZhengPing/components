<template>
    <div class="container">
        <div class="header">
            <el-form>
                <el-form-item label="名称">
                    <el-input v-model="searchName" />
                </el-form-item>
            </el-form>
        </div>
        <div class="main">
            <el-table :data="parentData" style="width:100%;height:100%;">
                <el-table-column type="index" label="序号" width="40"></el-table-column>
                <el-table-column label="编号" prop="ID" width="80"></el-table-column>
                <el-table-column label="名称" prop="CodeName"></el-table-column>
                <el-table-column label="创建人" prop="CreateUserName" width="80"></el-table-column>
                <el-table-column label="创建时间" width="100">
                    <template #default="scope">{{ formatDateTime(scope.row.CreateTime) }}</template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="configChildEvent(scope.row)">查看子集</el-button>
                        <el-button size="mini" @click="configEditEvent(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="configDeleteEvent(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

      <el-dialog v-model="childDialogVisible" :title="parentName" width="800">
        <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
        </el-table>
    </el-dialog>
</template>

<script setup>
    import {ref,watch} from 'vue';
    import {ElForm,ElFormItem,ElInput,ElTable,ElTableColumn,ElButton} from 'element-plus'
    import{SelectList,DoDelete,Update,GetUserName} from '@/public/request.js';
    import{formatDateTime} from '@/public/index.js';

    let searchName = ref(null);
    let parentData = ref([]);
    let parentId=ref(0);
    let parentName=ref("");
    let childData = ref([]);
    let childArray = [];
    let childDialogVisible = ref(false);

    watch(parentId,(newValue)=>{

    });

    function getConfigData(){
        SelectList({
            TableName:"AkdConfig",
            Where:`ParentID=${parentId.value}`,
            OrderBy:"OrderNum"
        }).then(res=>{
            if(parentId.value==0){
                parentData.value=res;
            }else{
                childData.value=res;
            }
        });
    }

    function configChildEvent(row){
        parentId = row.ID;
        parentName = row.CodeName;
        childArray.push({
            ID:row.ID,
            CodeName:row.CodeName,
            ParentID:row.ParentID
        })
        getConfigData();
    }

    function configEditEvent(row){

    }

    function configDeleteEvent(row){

    }
</script>
<style lang="scss" scoped>

</style>