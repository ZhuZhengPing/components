<template>
    <el-dialog
        v-model:visible="props.visible"
        :title="title"
        :width="width">
        <div class="content-form">
            <el-form label-position="right" :model="data" :label-width="80">
                <el-form-item :label="item.FiledText" v-for="item in fields" :key="item.ID">

                    <el-select v-if="item.FiledType=='select'" v-model.trim="data[item.FiledName]" placeholder="" clearable style="width:100%;" :disabled="item.Disabled">
                        <el-option v-for="d in selectDataFunctionEvent(item,data[item.FiledName])"
                                   :key="d.value"
                                   :label="d.text"
                                   :value="d.value" />
                    </el-select>

                    <el-input v-else-if="item.FiledType=='string'" v-model.trim="data[item.FiledName]" :clearable="true" :disabled="item.Disabled" />

                    <el-date-picker v-else-if="['data','datetime','month','year'].includes(item.FiledType)" v-model="data[item.FiledName]" :type="item.FiledType" :clearable="true" :disabled="item.Disabled"></el-date-picker>

                    <el-input-number v-else-if="item.FiledType=='number'" v-model="data[item.FiledName]" :clearable="true" style="width:100%" :disabled="item.Disabled"></el-input-number>
                </el-form-item>

                <slot></slot>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible=false">取消</el-button>
                <el-button type="primary" plain @click="saveEvent" v-if="">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
    import { reactive,ref, watch } from 'vue';
    import { SelectList, DoDelete, Add, Update, GetUserName, GetTableRemark } from '@/public/request.js';
    import {ElDialog,ElOption,ElButton,ElInput,ElSelect,ElDatePicker,ElInputNumber,ElForm,ElFormItem,ElMessage,ElMessageBox} from 'element-plus';

    const props = defineProps({
        entity:String,
        action:String,    //  add , edit , select
        fields:Array,
        data: Object,

        visible: Boolean, 
        title: String,
        width: String,
        onConfirm: Function ,
        onCancel:Function
    });
    const emits = defineEmits(['edit-event', 'update:visible']);

    let fields=ref([...props.fields]);
    let data = ref({ ...props.data });
    let title = ref(props.title);
    let visible = ref(props.visible);

    watch(() => props.data, (newValue, oldValue) => {
        data.value = {
            ...newValue,
            CreateUserName: GetUserName()
        };
    });

    init();
    async function init(){
        if (fields.value.length == 0) {
            fields = await SelectFormatFields({
                TableName: "AkdTable",
                Where: `TableName='${props.entity}' and IsInEdit=1`,
                OrderBy: "OrderNum"
            });
            fields.map(p => {
                p.Value = props.data[p.FiledName] === undefined ? "" : props.data[p.FiledName];
                if (props.action == "select") {
                    p.Disabled = true;
                }
            });
        }

        if (!title) {
            title.value = await GetTableRemark({
                Name: props.entity
            });
            if (props.action == "add") {
                title.value = "添加" + title.value;
            } else if (props.action == "edit") {
                title.value = "修改" + title.value;
            } else if (props.action == "select") {
                title.value = "查询" + title.value;
            }
        }
    }
    
    async function selectDataFunctionEvent(targetField,value){
        if (targetField.SelectDataFunction) {
            if (targetField.SelectDataFunction.constructor.name === 'AsyncFunction') {
                return await targetField.SelectDataFunction(targetField, value);
            } else if (targetField.SelectDataFunction.constructor.name === 'Function') {
                return targetField.SelectDataFunction(targetField, value);
            } else if (targetField.SelectDataFunction.constructor.name === 'Array') {
                return targetField.SelectDataFunction;
            }
        }
        return [];
    }

    async function saveEvent(){
        let requestFields = fields.filter(p=>p.IsRequest==true);
        let isSuccess = true;
        requestFields.forEach(p=>{
            if(!data[p.FiledName]){
                ElMessage.error(p.RequestPrompt);
                isSuccess=false;
                return;
            }
        });
        if(isSuccess==false){
            return;
        }
        let result=0;
        if(data.ID){
            result = await Update(data);
        }else{
            result = await Add(data);
        }
        if(result>0){
            ElMessage("操作成功");
            init();
            emits("menu-edit-event",result);
        }else{
            ElMessage.error("操作失败，请检查网络");
        }
    }
</script>
<style scoped lang="scss">
    
</style>
