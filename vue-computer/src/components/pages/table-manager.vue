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
                                <el-option key="8" label="textarea" value="textarea" />
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
                <el-table :data="buttons" style="width: 100%;height:100%;flex:auto;" highlight-current-row empty-text="暂无数据">
                    <el-table-column type="index" label="序号" width="60"></el-table-column>

                    <el-table-column label="删除" width="90" align="center">
                        <template #default="scope">
                            <el-button type="primary" plain @click="editButtonInTableEvent(scope.row)" style="width:60px;">修 改</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="位置" prop="ButtonType" width="100" :formatter="buttonTypeEvent"></el-table-column>
                    <el-table-column label="名称" prop="ButtonText" width="100"></el-table-column>
                    <el-table-column label="可见状态([10,20])" prop="ButtonVisibleStatus" width="150"></el-table-column>
                    <el-table-column label="事件" prop="ButtonFunction" min-width="250" style="white-space:pre;"></el-table-column>
                    <el-table-column label="创建人" prop="CreateUserName" width="100"></el-table-column>
                    <el-table-column label="创建时间" prop="CreateTime" width="140" :formatter="formatDateTimeEvent"></el-table-column>

                    <el-table-column label="删除" width="90" align="center">
                        <template #default="scope">
                            <el-button type="danger" plain @click="deleteButtonnTableEvent(scope.row)" style="width:60px;">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

    <temp-edit 
            v-if="tempEditModel.show"
            v-model="tempEditModel"
            @temp-edit-event="tempEditCallbackEvent"
            ></temp-edit>

</template>

<script setup>
    import {reactive,ref,onMounted } from 'vue';
    import {GetTableDetailBySql,SelectList,UpdateList,GetTableList,Add,DoDelete} from '@/http/index.js';
    import tempTable from '@/components/template-model/temp-table.vue';
    import {formatDateTime} from '@/public/index.js';
    import {ElMessage} from 'element-plus';
    import tempEdit from '@/components/template-model/temp-edit.vue';

    let entity = ref("");
    let menus = ref([]);
    let fields = ref([]);
    let buttons = ref([]);

    // 注入编辑模态窗口供子组件调用
    let tempEditModel = reactive({
        entity:"",
        action:"",
        data:{},
        fields:[],
        show:false
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
            Where:`TableName='${entity.value}'`,
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

    async function addButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:20,
            TableName:entity.value,
            ButtonText:"添加",
            ButtonVisibleStatus:"[10,20,30,40,50,60,70,80,90,100]",
            ButtonFunction:addButtonTemplete.toString()
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
            ButtonFunction:editButtonTemplete.toString()
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

    function editButtonInTableEvent(row){
        tempEditModel.entity="AkdTableButton";
        tempEditModel.action="edit";
        tempEditModel.data=row;
        tempEditModel.emits=initButtons;
        tempEditModel.show=true;
    }

    async function deleteButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:10,
            TableName:entity.value,
            ButtonText:"删除",
            ButtonVisibleStatus:"[10,20,30]",
            ButtonFunction:deleteButtonTemplete.toString()
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
    async function deleteButtonnTableEvent(row){
        await deleteButtonTemplete("AkdTableButton",row);
    }

    async function auditButtonEvent(){
        await addButtonCommonEvent({
            ButtonType:10,
            TableName:entity.value,
            ButtonText:"审核",
            ButtonVisibleStatus:"[10,20,30,40]",
            ButtonFunction:auditButtonTemplete.toString()
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
        await addButtonCommonEvent({
            ButtonType:20,
            TableName:entity.value,
            ButtonText:"导出",
            ButtonVisibleStatus:"[10,20,30,40,50,60,70,80,90,100]",
            ButtonFunction:auditButtonTemplete.toString()
        });
    }
    async function exportButtonTemplete(_entity,_data,_emits){
        let tempData = SelectList({
            TableName:_entity,
            Where:_data
        });

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(tempData);
        var titleStyle = { font: { bold: true, color: { rgb: '000000' } } };
        var range = XLSX.utils.decode_range(ws['!ref']);
        for (var col = range.s.c; col <= range.e.c; col++) {
            var cellAddress = { c: col, r: 0 }; 
            var cellRef = XLSX.utils.encode_cell(cellAddress);
            ws[cellRef].s = titleStyle;
        }
        var wscols = [];
        for (var col = range.s.c; col <= range.e.c; col++) {
            var maxLength = 0;
            for (var row = range.s.r; row <= range.e.r; row++) {
                var cellAddress = { c: col, r: row };
                var cellRef = XLSX.utils.encode_cell(cellAddress);
                if (ws[cellRef] && ws[cellRef].v) {
                    var cellLength = String(ws[cellRef].v).length;
                    maxLength = Math.max(maxLength, cellLength);
                }
            }
            var colWidth = { wch: maxLength + 2 }; 
            wscols.push(colWidth);
        }
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws,"Sheet1");
        tempExcelName = await GetTableRemark({
            Name: _entity
        });
        XLSX.writeFile(wb, (tempExcelName||"")+"列表.xlsx" );
    }

    async function addButtonCommonEvent(tempButtonRow){
        const maxValue = fields.value.reduce((max, obj) => Math.max(max, obj.OrderNum), Number.NEGATIVE_INFINITY);
        tempButtonRow.OrderNum = maxValue+10;
        let d = await Add(tempButtonRow,"AkdTableButton");
        if(d>0){
            ElMessage.success('操作成功');
            await initButtons();
        }else{
            ElMessage.error('操作失败，请重试');
        }
    }



    function customButtonEvent(){
        tempEditModel.show=true;
    }
    async function tempEditCallbackEvent(d){
        tempEditModel.show=false;
        await initButtons();
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

    function formatDateTimeEvent(row){
        return formatDateTime(row.CreateTime);
    }
</script>

<style lang="scss" scoped>
    @import "@/scss/layout-left-right.scss";
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
    .el-form-item{
        margin-bottom: 0;
    }
    :deep(.el-table) {
        .cell{
            white-space: pre;
        }
    }
</style>