<template>
    <div class="table-container">
        <el-table v-loading="loading" :data="list" @current-change="rowSelectEvent" style="width: 100%;height:100%;flex:auto;" highlight-current-row empty-text="暂无数据">
            <el-table-column type="index" label="序号" width="40"></el-table-column>

            <template  v-for="item in form.fields" :key="'tab'+item.ID">
                <el-table-column v-if="item.FiledType=='select'" :prop="item.FiledName" :label="item.FiledText" :width="item.Width||'auto'" :formatter="tableFunctionEvent" />
                <el-table-column v-else-if="['string','textarea'].includes(item.FiledType)" :prop="item.FiledName" :label="item.FiledText" :width="item.Width||'auto'"/>
                <el-table-column v-else-if="['data','datetime','month','year'].includes(item.FiledType)" :prop="item.FiledName" :label="item.FiledText" :width="item.Width||'auto'" :formatter="tableDateEvent"/>
                <el-table-column v-else-if="item.FiledType=='number'" :prop="item.FiledName" :label="item.FiledText" :width="item.Width||'auto'"/>

                <template v-if="buttons.length">
                    <el-table-column label="操作" width="90" align="center" v-if="btn in buttons" :key="'btn'+btn.ID">
                        <template #default="scope">
                            <el-button v-if="!btn.ButtonVisibleStatus || btn.ButtonVisibleStatus.includes(scope.row.Status)" type="primary" plain 
                            @click="tableButtonEvent(scope.row,form.fields)" @button-event="getData" style="min-width:60px;">{{btn.ButtonText}}</el-button>
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>

        <div v-loading="loading" class="table-page" v-if="props.pageSize>0">
            <el-pagination layout="total,prev, pager, next" :total="form.total" @current-change="pageEvent" :page-size="props.pageSize" />
        </div>
    </div>
</template>

<script setup>

    import {reactive,watch} from 'vue';
    import {SelectList,SelectListPages,GetUserName,SelectFormatFields} from '@/http/index.js';
    import {formatDateByType} from '@/public/index.js';
    
    const props = defineProps({
        entity:String,
        fields:Array,
        buttons:Array,
        // where:Object,
        action:String,    //  add , edit , select
        pageSize:Number
    });
    const emits = defineEmits(['table-event']);
    let where = defineModel();

    let loading = ref(false);
    let fields=reactive([...props.fields]);
    let buttons=reactive([...props.buttons]);
    let list=reactive([]);
    let total = ref(0);
    let pageIndex=0;

    watch(() => where.value, (newValue, oldValue) => {
        where.value = [
            ...where.value,
            ...newValue
        ];
        getData();
    },{deep: true});

    init();
    async function init(){
        loading.value=true;
        if(fields.length==0){
            fields = await SelectFormatFields({
                TableName:"AkdTable",
                Where:`TableName='${props.entity}'`
            });
        }
        if(props.action == "edit" || props.action == "select"){
            fields.map(p=>{
                p.Value = props.data[p.FiledName]===undefined ? "" : props.data[p.FiledName];
                if(props.action == "select"){
                    p.Disabled = true;
                }
            });
        }

        if(buttons.length==0){
            buttons = await SelectFormatFields({
                TableName:"AkdTableButton",
                Where:`TableName='${props.entity}' and ButtonType=10`
            });
        }

        await getData();
        loading.value=false;
    }

    async function getData(){
        loading.value=true;
        if(props.pageSize){
           var result = await SelectListPages({
                ...where.value,
                TableName:props.entity,
                PageIndex:pageIndex,
                PageSize:props.pageSize
            });
            list=result.data;
            total=result.total;
        }else{
            list=await SelectList({
                ...where.value,
                TableName:props.entity,
            });

            // // 如果存在ParentID,也就是主从结构，则列表可以做成主从结构的模式
            // if(fields.some(p=>p.FiledName=='ParentID')){
            //     let tempList = list.filter(p=>p.ParentID==0);
            //     tempList.map(p=>{
            //         p.children = list.filter(k=>k.ParentID==p.ID);
            //     });
            //     list=tempList;
            // }
        }
        loading.value=false;
    }

    async function tableFunctionEvent(row,column,cellValue,index){
        let targetField = fields.find(p=>p.FiledName==column.property);
        if(targetField.TableFormatFunction){
            if(targetField.TableFormatFunction.constructor.name === 'AsyncFunction'){
                return await targetField.TableFormatFunction(row,column,cellValue,index);
            }else if(targetField.TableFormatFunction.constructor.name === 'Function'){
                return targetField.TableFormatFunction(row,column,cellValue,index);
            }else if(targetField.TableFormatFunction.constructor.name ==='Array'){
                let temp = targetField.TableFormatFunction.find(p=>p.value==cellValue);
                if(temp){
                    return temp.text;
                }
            }
        }
        return cellValue;
    }

    function tableDateEvent(row,column,cellValue){
        let targetField = fields.find(p=>p.FiledName==column.property);
        return formatDateByType(cellValue,targetField.FiledType);
    }

    // _fields：按钮的类型，values:当前实体对象
    function tableButtonEvent(_data,_fields){
        return _fields.ButtonFunction(props.entity,_data,getData,_fields);
    }

    function pageEvent(val){
        pageIndex = val - 1;
        getData();
    }

    function rowSelectEvent(row){
        emits("table-event",row);
    }

    // 导出加载功能，供父组件调用
    defineExpose({
        getData
    });
</script>

<style lang="scss" scoped>
    .table-container {
        flex: auto;
        display: flex;
        flex-direction: column;
        height:100%;
    }
    .table-page{
        flex:none;
    }
</style>