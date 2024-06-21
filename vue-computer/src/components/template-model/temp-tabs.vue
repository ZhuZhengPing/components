<template>
    <el-tabs v-loading="loading" type="border-card" style="height: 100%; display:flex; flex-direction:column;" v-model="tabName">
        <el-tab-pane :label="entity.name" name="0" v-for="item in entitys" :key="'tab'+item.entity">
            <el-form style="flex:none;" :inline="true" v-if="buttons.filter(p=>p.TableName==item.entity && p.ButtonType==20).length">
                <temp-buttons :entity="item.entity" :buttons="buttons.filter(p=>p.TableName==item.entity && p.ButtonType==20)" v-model="where" @button-event="buttonEvent(item.entity)"></temp-buttons>
            </el-form>

            <temp-table  style="flex:auto;display: flex;flex-direction: column;;height:100%;"
                   :ref="el=>refEvent(el,entity)" 
                   :entity="item.entity" 
                   :fields="fields.filter(p=>p.IsInTable && p.TableName==item.entity)" 
                   :buttons="buttons.filter(p=>p.ButtonType==10 && p.TableName==item.entity)"
                   v-model="where"></temp-table>
            </el-tab-pane>
        </el-tabs>
</template>
<script setup>
    import { reactive,ref,watch } from 'vue';
    import { SelectFormatFields } from '@/http/index.js';
    import tempTable from '@/components/template-model/temp-table.vue';
    import tempButtons from '@/components/template-model/temp-buttons.vue';

    const props = defineProps({
        parentEntity:String,
        entitys:Array
    });

    let parentData = defineModel();
    watch(()=>parentData.value.ID,(newValue,oldValue)=>{
        where.value[props.parentEntity+"ID"]=newValue;
    },{deep:true});

    let loading = ref(false);
    let tabName = ref("");
    let fields=reactive([]);
    let buttons=reactive([]);
    let entitys = reactive([]);
    let where = ref({});
    
    let entityRef={};

    init();

    async function init(){
        loading.value=true;

        let tempFields=[];
        let tempButtons=[];
        let tempTableName="";
        props.entitys.map(async p=>{
            tempTableName=await GetTableRemark({Name:p});
            entitys.push({
                entity:p,
                name:tempTableName
            });

            tempFields=await SelectFormatFields({
                TableName:"AkdTable",
                Where:`TableName='${p}'`
            });
            fields.push(...tempFields);

            tempButtons = await SelectFormatFields({
                TableName:"AkdTableButton",
                Where:`TableName='${p}'`
            });
            buttons.push(...tempButtons);
        });

        loading.value=false;
    }

    // 把元素缓存到对象中
    function refEvent(element,_entity){
        entityRef[_entity]=element;
    }

    // 掉用table组件的重新加载功能
    function buttonEvent(_entity){
        entityRef[_entity].getData();
    }
</script>
<style scoped lang="scss">
    .tab-buttons{
        flex:none;
    }
</style>