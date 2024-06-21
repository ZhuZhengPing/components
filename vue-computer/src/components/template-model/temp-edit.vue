<template>
    <el-dialog
        :title="title">
        <div class="content-form">
            <el-form label-position="right" :model="data" :label-width="80">
                <el-form-item :label="item.FiledText" v-for="item in fields" :key="item.ID">

                    <el-select v-if="item.FiledType=='select'" v-model.trim="data[item.FiledName]" placeholder="" clearable style="width:100%;" :disabled="item.Disabled">
                        <el-option v-for="d in selectDataFunctionEvent(item,data[item.FiledName])"
                                   :key="d.value"
                                   :label="d.text"
                                   :value="d.value" />
                    </el-select>

                    <el-input v-else-if="item.FiledType=='string'" type="text" v-model.trim="data[item.FiledName]" :clearable="true" :disabled="item.Disabled" />
                    <el-input v-else-if="item.FiledType=='textarea'" type="textarea" v-model.trim="data[item.FiledName]" :clearable="true" :rows="4" :disabled="item.Disabled" />

                    <el-input v-else-if="['string','textarea'].includes(item.FiledType)" :type="item.FiledType=='string'?'text':item.FiledType" v-model.trim="data[item.FiledName]" :clearable="true" :disabled="item.Disabled" />
                    <el-date-picker v-else-if="['data','datetime','month','year'].includes(item.FiledType)" v-model="data[item.FiledName]" :type="item.FiledType" :clearable="true" :disabled="item.Disabled"></el-date-picker>
                    <el-input-number v-else-if="item.FiledType=='number'" v-model="data[item.FiledName]" :clearable="true" style="width:100%" :disabled="item.Disabled"></el-input-number>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible=false">取消</el-button>
                <el-button type="primary" plain @click="saveEvent">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
    import { reactive,ref, watch } from 'vue';
    import { SelectList, DoDelete, Add, Update, GetUserName, GetTableRemark } from '@/http/index.js';

    let model = defineModel();
    model.value.CreateUserName = GetUserName();
    
    //const emits = defineEmits(['temp-edit-event']);

    let fields=ref([...model.value.fields]);
    let data = ref({ ...model.value.data });
    let title = ref("");

    init();
    async function init(){
        if (fields.value.length == 0) {
            fields = await SelectFormatFields({
                TableName: "AkdTable",
                Where: `TableName='${model.value.entity}' and IsInEdit=1`
            });
            fields.map(p => {
                p.Value = model.value.data[p.FiledName] === undefined ? "" : model.value.data[p.FiledName];
                if (model.value.action == "select") {
                    p.Disabled = true;
                }
            });
        }

        title.value = await GetTableRemark({
            Name: model.value.entity
        });
        if (model.value.action == "add") {
            title.value = "添加" + title.value;
        } else if (model.value.action == "edit") {
            title.value = "修改" + title.value;
        } else if (model.value.action == "select") {
            title.value = "查询" + title.value;
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

        if(model.value.action=="add"){
            result = await Add(data);
        }else{
            result = await Update(data);
        }

        if(result>0){
            ElMessage("操作成功");
            emits("temp-edit-event",result);
        }else{
            ElMessage.error("操作失败，请检查网络");
        }
    }
</script>
<style scoped lang="scss">
    
</style>
