<template>
    <div class="content-form">
        <el-form label-position="right" :label-width="80">
            <el-form-item label="菜单名称">
                <el-input v-model="data.MenuName" size="large" clearable/>
            </el-form-item>
            <el-form-item label="父级模块">
                <el-select v-model="data.ParentID" placeholder="" clearable>
                    <el-option
                    v-for="(item) in parentData"
                    :key="item.ID"
                    :label="item.MenuName"
                    :value="item.ID"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="菜单Url">
                <el-input v-model="data.URL" size="large" clearable/>
            </el-form-item>
            <el-form-item label="排序值">
                <el-input-number v-model="data.OrderNum" size="large" :step="10" style="width:100%;" clearable/>
            </el-form-item>
        </el-form>
    </div>
    <div class="content-buttons">
        <el-button type="danger" v-if="props.data && props.data.ID" plain @click="menuDeleteEvent" style="margin-right:50px;">删除</el-button>
        <el-button type="primary" plain @click="menuSaveEvent" style="display:inline-block;">保存</el-button>
    </div>
</template>

<script setup>
    import {ref,watch} from 'vue';
    import{SelectList,DoDelete,Add,Update,GetUserName} from '@/http/index.js';
    import {ElInput,ElSelect,ElForm,ElFormItem,ElMessage,ElMessageBox} from 'element-plus';

    let parentData = ref(null);
    const props = defineProps({
        data:Object
    });
    const emits = defineEmits(['menu-edit-event']);
    let data = ref({
        ...props.data,
        CreateUserName:GetUserName()
    });

    watch(() => props.data, (newValue, oldValue) => {
        data.value = {
            ...newValue,
            CreateUserName: GetUserName()
        };
        console.log(newValue, oldValue);
    });

    init();
    function init(){
        SelectList({
            TableName:"AkdMenu",
            OrderBy:"ParentID,OrderNum desc"
        }).then(res=>{
            parentData.value = res.filter(p=>p.ParentID == 0);
        });
    }
    function menuCheck(){
        if(!data.value.MenuName){
            ElMessage.error('请输入菜单名称');
            return false;
        }
        if(data.value.OrderNum===""){
            ElMessage.error('请输入排序值');
            return false;
        }
        return true;
    }
    function menuDeleteEvent(){
        ElMessageBox.confirm('确定删除吗？',"提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: '提示',
        }).then(()=>{
            DoDelete({
                ID:data.ID,
                TableName:AkdMenu,
                UserName:GetUserName()
            }).then(res=>{
                if(res>0){
                    ElMessage("操作成功");
                    init();
                    emits("menu-edit-event",res);
                }else{
                    ElMessage.error("操作失败，请检查网络");
                }
            });
        });
    }

    async function menuSaveEvent(e){
        if(menuCheck()==false){
            return;
        }
        let result = 0;
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
    .content-form{
        flex:auto;
    }
    .content-buttons{
        flex:none;
        display: flex;
        justify-content: flex-end;
    }
</style>