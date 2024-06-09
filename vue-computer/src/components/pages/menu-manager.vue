<template>
    <div class="container">
        <div class="menu">
            <el-tree ref="treeElement" 
            :highlight-current="true" 
            :expand-on-click-node="false" 
            :data="treeData" icon="" 
            :props="treeProps" 
            :default-expand-all="true" 
            @node-click="treeNodeClickEvent" >
                <template #default="{ node, data }">
                    <span class="custom-icon">
                        <el-icon v-if="data.ParentID==0"><Folder /></el-icon>
                        <el-icon v-else><Menu /></el-icon>
                        {{ node.label }}
                    </span>
                </template>
            </el-tree>
        </div>
        <div class="main" >
            <div class="top">
                <el-button plain @click="menuAddEvent">新增</el-button>
            </div>
            
            <div class="content">
                <menu-edit v-if="pageState=='edit' || pageState=='add'" :data="form" @menu-edit-event="menuEditEvent"></menu-edit>
                <el-empty v-else description="请选择左边菜单进行操作"></el-empty>
            </div>
             <div class="bottom" >
                <template v-if="pageState=='edit'">
                    <div class="bottom-buttons">
                        <el-button plain size="small">新增</el-button>
                    </div>
                    <div class="bottom-grid">
                        <el-table :data="buttonList" style="width:100%;height:100%;">
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
                                    <el-button type="primary" plain size="small" @click="bottomGridUpdateEvent(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="删除">
                                <template #default="scope">
                                    <el-button type="danger" plain size="small" @click="bottomGridDeleteEvent(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
                <el-empty v-else-if="pageState=='add'" description="请先保存菜单再进行操作"></el-empty>
            </div> 
        </div>
    </div>
</template>
<script setup>   
    import {ref} from 'vue';
    import{SelectList,Update,GetUserName} from '@/http/index.js';
    import{formatDateTime} from '@/public/index.js';
    // import menuEdit from '@/model/menu-edit.vue';
    import {Folder,Menu} from '@element-plus/icons-vue'

    let treeElement = ref(null);
    let treeData = ref([]);
    let treeProps = {
        children: 'children',
        label: 'MenuName'
    }
    let form = ref({});
    let showMenuEdit = ref(false);
    let pageState = ref("");
    init();

    function init(){
        SelectList({
            TableName:"AkdMenu",
            OrderBy:"ParentID,OrderNum"
        }).then(res=>{
            treeData.value = res.filter(p=>p.ParentID == 0);
            treeData.value.map(d=>{
                d.children = res.filter(p=>p.ParentID == d.ID);
            });
        });
    }
    
    function treeNodeClickEvent(e){
        form.value = { ...e };
        pageState.value="edit";
    }

    function menuAddEvent(){
        form.value = {
            ID:"",
            URL:"",
            OrderNum:"",
            MenuName:""
        };
        pageState.value="add";

        let currentElement = treeElement.value.getCurrentNode();
        if(currentElement){
            form.value.ParentID = currentElement.ParentID || currentElement.ID;
        }
        //console.log(form);
    }
    
    function menuEditEvent(){
        
    }


</script>
<style scoped lang="scss">
    .container{
        display: flex;
        width: 100%;
        height: 100%;

        .menu{
            width:150px;
            padding: 10px 15px 10px 10px;
            flex:none;
            height: 100%;
            overflow: auto;
            box-shadow: 0px 1px 5px #ccc;
            margin-right: 8px;

            .custom-icon {
                display: flex;
                align-items: center;
            }
            .custom-icon i {
                margin-right: 5px;
            }
        }

        .main{
            flex:auto;
            display: flex;
            flex-direction: column;
            height: 100%;
            .top{
                border-bottom: 1px solid #f7f7f7;
                flex:none;
                box-shadow: 0px 1px 5px #ccc;
                margin-bottom: 8px;
                padding:10px 20px;
            }
            .content{
                flex:auto;
                margin-bottom: 8px;
                box-shadow: 0px 1px 5px #ccc;
                padding:20px;
                display: flex;
                flex-direction: column;
                
            }
            .bottom{
                flex: none;
                height: 300px;
                display: flex;
                flex-direction: column;
                box-shadow: 0px 1px 5px #ccc;
                padding:10px 10px 0 10px;

                
            }
        }
    }
</style>