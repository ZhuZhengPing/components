<template>
<div class="content-form">
    <el-form label-position="right" :inline="true" :model="data" :label-width="80">
        <el-form-item :label="item.FiledText" v-if="item in fields.filter(p=>p.IsInSearch==10)" :key="'search'+item.ID">
            <el-select v-model="data[item.FiledName]" placeholder="" clearable style="width:100%;" @change="searchEvent">
                <el-option v-for="d in searchFunctionEvent(item,data[item.FiledName])" 
                    :key="'option'+d.value"
                    :label="d.text"
                    :value="d.value"
                />
            </el-select>
            <el-input v-model="data[item.FiledName]" clearable style="width:100%;" @input="searchEvent"/>
            <el-date-picker v-model="data[item.FiledName]" :type="item.FiledType" placeholder="" @change="searchEvent" clearable style="width:100%;"/>
            <el-input-number v-model="data[item.FiledName]" style="width:100%;" @input="searchEvent"/>
        </el-form-item>

        <el-form-item>
            <el-button plain @click="searchEvent"> 刷 新 </el-button>
        </el-form-item>
        

        <template  v-if="fields.some(p=>p.IsInSearch==20)">
            <el-form-item v-if="advanceSearch" :label="item.FiledText" v-if="item in fields.filter(p=>p.IsInSearch==20)" :key="'search'+item.ID">
                <el-select v-model="data[item.FiledName]" placeholder="" clearable style="width:100%;" @change="searchEvent">
                    <el-option v-for="d in searchFunctionEvent(item,data[item.FiledName])" 
                        :key="'option'+d.value"
                        :label="d.text"
                        :value="d.value"
                    />
                </el-select>
                <el-input v-model="data[item.FiledName]" clearable style="width:100%;" @input="searchEvent"/>
                <el-date-picker v-model="data[item.FiledName]" :type="item.FiledType" placeholder="" @change="searchEvent" clearable style="width:100%;"/>
                <el-input-number v-model="data[item.FiledName]" style="width:100%;" @input="searchEvent"/>
            </el-form-item>

            <el-form-item v-if="!advanceSearch">
                <el-button plain @click="advanceSearch=true"> 高级筛选 </el-button>
            </el-form-item>

            <el-form-item v-else>
                <el-button plain @click="advanceSearch=false"> 收起 </el-button>
            </el-form-item>

        </template>

        <temp-buttons :entity="entity" :buttons="buttons" v-model="data" @button-event="searchEvent"></temp-buttons>
    </el-form>
</div>
</template>
<script setup>
    import {reactive} from 'vue';
    import {debounce} from '@/public/index.js';
    import {SelectFormatFields} from '@/http/index.js';
    import tempButtons from '@/components/template-model/temp-buttons.vue';
    const props = defineProps({
        entity:String,
        fields: Array,
        buttons:Array,
        data:Object
    });
    
    let loading = ref(false);
    let fields=ref([...props.fields]);
    let data=ref({...props.data});
    let buttons = ref([...props.buttons]);
    let advanceSearch=ref(false);
    const emits = defineEmits(['search-event']);
    
    init();

    async function init() {
        loading.value = true;
        if (fields.value.length == 0) {
            fields.value = await SelectFormatFields({
                TableName:"AkdTable",
                Where:`TableName='${props.entity}' and IsInSearch>0`
            });
        }

        if (buttons.length == 0) {
            buttons = await SelectFormatFields({
                TableName:"AkdTableButton", 
                Where: `TableName='${props.entity}' and ButtonType=20`
            });
        }
        
        loading.value=false;
    }

    async function searchFunctionEvent(field,value){
        if(field.SelectDataFunction){
            if(field.SelectDataFunction.constructor.name === 'AsyncFunction'){
                return await field.SelectDataFunction(field,value);
            }else if(field.SelectDataFunction.constructor.name === 'Function'){
                return field.SelectDataFunction(field,value);
            }else if(field.SelectDataFunction.constructor.name === 'Array'){
                return field.SelectDataFunction;
            }
        }
        return [];
    }

    function searchEvent(){
        emits("search-event",data);
    }

    function searchByDebounceEvent(){
        debounce(searchEvent)();
    }
</script>
<style scoped lang="scss">
    .content-form{
        flex:none;
    }
</style>
