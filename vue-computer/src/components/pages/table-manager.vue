<template>
    <div class="main">
        <div class="left">
            <el-menu @select="selectAkdTableEvent" style="border-right:none;">
                <el-menu-item v-for="(item,index) in menus" :index="index+''" :key="'submenu-'+item">{{item}}</el-menu-item>
            </el-menu>
        </div>
        <div class="container">
            <div class="middle">
                <el-table :data="data" stripe style="width:100%;height:100%;flex:auto;" size="small" :highlight-current-row="true">
                    <el-table-column type="index" label="序号" width="40"></el-table-column>
                    
                    <el-table-column label="字段" prop="FiledName" />
                    
                    <el-table-column prop="TableName" label="实体"></el-table-column>

                    <el-table-column label="标题" width="120">
                        <template #default="scope">
                            <el-input v-model.trim="scope.row.FiledText"  type="text" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column> 

                    <el-table-column label="类型"  width="120">
                        <template #default="scope">
                            <el-select v-model="scope.row.FiledType" style="width:100%">
                                <el-option key="1" label="select" value="select" />
                                <el-option key="2" label="string" value="string" />
                                <el-option key="3" label="date" value="date" />
                                <el-option key="4" label="datetime" value="datetime" />
                                <el-option key="5" label="month" value="month" />
                                <el-option key="6" label="year" value="year" />
                                <el-option key="7" label="number" value="number" />
                            </el-select>
                        </template>
                    </el-table-column>  

                    <el-table-column label="是否搜索">
                        <template #default="scope">
                            <el-switch v-model="scope.row.IsInSearch" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="搜索默认值" width="120">
                        <template #default="scope">
                            <el-input v-model.trim="scope.row.SearchValue" type="text" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="是否显示在表格" width="120">
                        <template #default="scope">
                            <el-switch v-model="scope.row.IsInTable" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="表格宽度" width="120">
                        <template #default="scope">
                            <el-input-number v-model.trim="scope.row.InTableWidth" :clearable="true" :controls="false" style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="是否显示在编辑" width="120">
                        <template #default="scope">
                            <el-switch v-model="scope.row.IsInEdit" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="是否可空">
                        <template #default="scope">
                            <el-switch v-model="scope.row.IsRequest" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="空提示语" width="120">
                        <template #default="scope">
                            <el-input v-model.trim="scope.row.RequestPrompt" :clearable="true"  style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="表格格式化函数" width="200">
                        <template #default="scope">
                            <el-input v-model="scope.row.TableFormatFunction" autosize :rows="3" type="textarea" :clearable="true" style="width:100%"/>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="下拉框格式化函数" width="200">
                        <template #default="scope">
                            <el-input v-model="scope.row.SelectDataFunction" autosize :clearable="true" :rows="3" type="textarea" style="width:100%"/>
                        </template>
                    </el-table-column>

                    <el-table-column label="从小到大排序" width="120">
                        <template #default="scope">
                            <el-input-number v-model.trim="scope.row.OrderNum" :step="10" autosize :clearable="true"  :controls="false" style="width:100%"/>
                        </template>
                    </el-table-column>

                </el-table> 
            </div>

            <div class="top" style="box-shadow: none;display: flex;justify-content: flex-end;padding: 10px 0;">
                <el-button plain @click="saveEvent" :disable="!entity"> 保存 </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {reactive,ref,onMounted } from 'vue';
    import {GetTableDetailBySql,SelectList,UpdateList,GetTableList} from '@/public/request.js'

    let data = ref([]);
    let entity = "";
    let menus = ref([]);
    
    onMounted(async () => { 
        menus.value = await GetTableList(); 
    });

    async function selectAkdTableEvent(key,path){
        console.log("selectAkdTableEvent",key,path);
        entity=menus.value[key].replace("V_","");
        data.value = await GetTableDetailBySql({Name:entity});
        // data.value.map(p=>{
        //     p.TableName = entity;
        // });
    }

    function addEvent(){
        const maxValue = data.value.reduce((max, obj) => Math.max(max, obj.OrderNum), Number.NEGATIVE_INFINITY);
        data.value.push({
            OrderNum:maxValue
        });
    }

    async function saveEvent(){
        let d = await UpdateList(data.value);
        if(d>0){
            ElMessage.success('操作成功');
        }else{
            ElMessage.error('操作失败，请重试');
        }
    }

    async function doDeleteEvent(row,index){
        if(row.ID){
            let d = await DeleteList({ID:row.ID});
            if(d>0){
                data.value.splice(index, 1);
            }else{
                ElMessage.error('操作失败，请重试');
            }
        }else{
            data.value.splice(index, 1);
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../scss/layout-left-right.scss";
    .buttons{
        flex: none;
        padding: 5px 10px;
        display: flex;
        align-items:end;
        box-shadow: 0px 1px 5px #ccc;
        margin-bottom: 5px;
    }
    .tables{
        flex: auto;
        overflow: auto;
    }
</style>