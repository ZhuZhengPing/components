<template>
    <div class="table-container">
        <el-table v-loading="loading" :data="list" @current-change="rowSelectEvent" style="width: 100%;height:100%;flex:auto;" highlight-current-row default-expand-all empty-text="暂无数据">
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
    import {SelectTreeList,SelectTreeListPages,GetUserName,SelectFormatFields} from '@/http/index.js';
    import {formatDateByType} from '@/public/index.js';

    const props = defineProps({
        entity:String,
        fields:Array,
        buttons:Array,
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

    watch(async () => where.value, (newValue, oldValue) => {
        where.value = [
            ...where.value,
            ...newValue
        ];
        await getData();
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

        if(buttons.length==0){
            buttons = await SelectFormatFields({
                TableName:"AkdTableButton",
                Where:`TableName='${props.entity}' and ButtonType=10`
            });
        }

        await getData();
        loading.value=false;
    }


</script>