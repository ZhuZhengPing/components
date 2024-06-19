<template>
    <div class="main">
        <div class="left">
            <el-menu @select="selectAkdTableEvent" style="border-right:none;">
                <el-menu-item v-for="(item,index) in menus" :index="index+''" :key="'submenu-'+item">{{item}}</el-menu-item>
            </el-menu>
        </div>
        <div class="container">
            <div class="top" style="box-shadow: none;display: flex;justify-content: flex-end;padding: 10px 0;">
                <el-button plain @click="saveEvent" :disable="!entity"> 保存 </el-button>
            </div>

            <div class="middle">
                <el-table :data="fields" stripe style="width:100%;height:100%;flex:auto;" size="small" :highlight-current-row="true">
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

            <div class="buttons">
                <el-form style="flex:none;" :inline="true">
                    <el-form-item>
                        <el-button plain @click="addButtonEvent"> 添加按钮 </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="editButtonEvent"> 修改按钮 </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="deleteButtonEvent"> 删除按钮 </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="auditButtonEvent"> 审核按钮 </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="exportButtonEvent"> 导出按钮 </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="customButtonEvent"> 自定义按钮 </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="bottom">
                <el-table v-loading="loading" :data="buttons" style="width: 100%;height:100%;flex:auto;" highlight-current-row empty-text="暂无数据">
                    <el-table-column type="index" label="序号" width="40"></el-table-column>

                    <el-table-column label="删除" width="90" align="center">
                        <template #default="scope">
                            <el-button type="primary" plain @click="editButtonEvent(scope.row)" style="width:60px;">修 改</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column type="index" label="位置" prop="ButtonType" width="80" :formatter="buttonTypeEvent"></el-table-column>
                    <el-table-column type="index" label="名称" prop="ButtonText" width="100"></el-table-column>
                    <el-table-column type="index" label="可见状态([10,20])" prop="ButtonVisibleStatus" width="120"></el-table-column>
                    <el-table-column type="index" label="按钮事件" prop="ButtonFunction" width="250"></el-table-column>
                    <el-table-column type="index" label="创建人" prop="CreateUserName" width="80"></el-table-column>
                    <el-table-column type="index" label="创建时间" prop="CreateTime" width="110" :formatter="formatDateTime"></el-table-column>

                    <el-table-column label="删除" width="90" align="center">
                        <template #default="scope">
                            <el-button type="danger" plain @click="deleteButtonEvent(scope.row)" style="width:60px;">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

    <temp-edit 
            v-if="tempEditModel.show"
            :entity="tempEditModel.entity"
            :action="tempEditModel.action"
            :fields="tempEditModel.fields"
            :data="tempEditModel.data"
            @temp-edit-event="tempEditEvent"
            ></temp-edit>
</template>

<script setup>
    import {reactive,ref,onMounted } from 'vue';
    import {GetTableDetailBySql,SelectList,UpdateList,GetTableList,Add,DoDelete} from '@/http/index.js';
    import tempTable from '@/components/template-model/temp-table.vue';
    import {formatDateTime} from '@/public/index.js';
    import tempEdit from '@/components/template-model/temp-edit.vue';

    let entity = ref("");
    let menus = ref([]);
    let fields = ref([]);
    let buttons = ref([]);

    // 注入编辑模态窗口供子组件调用
    let tempEditModel = ref({
        show:false,
        entity:"",
        action:"",
        fields:[],
        data:{}
    });
    
    onMounted(async () => { 
        menus.value = await GetTableList(); 
    });

    async function selectAkdTableEvent(key,path){
        entity.value=menus.value[key].replace("V_","");
        fields.value = await GetTableDetailBySql({Name:entity.value});
        await initButtons();
    }

    async function initButtons(){
        buttons.value = await SelectList({
            TableName:"AkdTableButton",
            Where:`TableName=${entity.value}`,
            OrderNum:"OrderNum"
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

    function addButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:20,
            TableName:entity.value,
            ButtonText:"添加",
            ButtonVisibleStatus:"[10,20,30,40,50,60,70,80,90,100]",
            ButtonFunction:JSON.stringify(addButtonTemplete)
        });
    }
    function addButtonTemplete(_entity,_data,_emits){
        tempEditModel.value.entity=_entity;
        tempEditModel.value.action="add";
        tempEditModel.value.data=_data;
        tempEditModel.value.emits=_emits;
        tempEditModel.value.show=true;
    }

    async function editButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:10,
            TableName:entity.value,
            ButtonText:"编辑",
            ButtonVisibleStatus:"[10,20,30]",
            ButtonFunction:JSON.stringify(editButtonTemplete)
        });
    }
    function editButtonTemplete(_entity,_data,_emits,_fields){
        tempEditModel.value.entity=_entity;
        tempEditModel.value.action="edit";
        tempEditModel.value.data=_data;
        tempEditModel.value.emits=_emits;
        tempEditModel.value.fields=_fields;
        tempEditModel.value.show=true;
    }

    async function deleteButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:10,
            TableName:entity.value,
            ButtonText:"删除",
            ButtonVisibleStatus:"[10,20,30]",
            ButtonFunction:JSON.stringify(deleteButtonTemplete)
        });
    }
    async function deleteButtonTemplete(_entity,_data,_emits,_fields){
        ElMessageBox.confirm("确定要删除吗？","提示").then(()=>{
            let d = DoDelete({
                ID:_data.ID,
                TableName:_entity
            });
            if(d>0){
                ElMessage.success('操作成功');
            }else{
                ElMessage.error('操作失败，请重试');
            }
        });
    }

    async function auditButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:10,
            TableName:entity.value,
            ButtonText:"审核",
            ButtonVisibleStatus:"[10,20,30,40]",
            ButtonFunction:JSON.stringify(auditButtonTemplete)
        });
    }
    async function auditButtonTemplete(_entity,_data,_emits,_fields){
        ElMessageBox.confirm("确定要审核吗？","提示").then(()=>{
            _data.Status=100;
            let d = Update(_data);
            if(d>0){
                ElMessage.success('操作成功');
            }else{
                ElMessage.error('操作失败，请重试');
            }
        });
    }

    async function exportButtonEvent(){

    }
    async function exportButtonTemplete(_entity,_data,_emits){

    }

    function addButtonCommonEvent(tempButtonRow){
        const maxValue = fields.value.reduce((max, obj) => Math.max(max, obj.OrderNum), Number.NEGATIVE_INFINITY);
        tempButtonRow.OrderNum = maxValue+10;
        let d = await Add(tempButtonRow);
        if(d>0){
            ElMessage.success('操作成功');
            await initButtons();
        }else{
            ElMessage.error('操作失败，请重试');
        }
    }

    function buttonTypeEvent(row){
        if(row.ButtonType==10){
            return "表格内按钮";
        }
        return "表格外按钮";
    }

    async function tempEditEvent(e){
        await initButtons();
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