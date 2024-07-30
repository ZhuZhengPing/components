<template>
    <div class="container">
        <div class="top" v-if="fields.search.length>0">
            <temp-search :entity="entity" 
                    :fields="fields.filter(p=>p.IsInSearch>0)" 
                    :buttons="buttons.filter(p=>p.ButtonType==20)" 
                    v-model="where"
                    @search-event="searchEvent"></temp-search>
        </div>

        <div class="middle">
            <temp-table :entity="entity" 
                   :fields="fields.filter(p=>p.IsInTable)" 
                   :buttons="buttons.filter(p=>p.ButtonType==10)"
                   :pageSize="pageSize"
                   :hasChildren="hasChildren"
                   v-model="where"
                   @table-event="tableEvent"></temp-table>
        </div>
    </div>
</template>
<script setup>
    import { reactive,ref } from 'vue';
    import { SelectFormatFields } from '@/http/index.js';
    import { getQueryString } from '@/public/index.js';
    import tempSearch from '@/components/template-model/temp-search.vue';
    import tempTable from '@/components/template-model/temp-table.vue';

    let entity = ref(getQueryString("entity"));
    
    let pageSize = ref(0);
    let page = getQueryString("page");
    if(page){
        pageSize=20;
    }
    let hasChildren=ref(getQueryString("hasChildren")||0);

    let fields = reactive([]);
    let buttons = reactive([]);
    let where = ref({});

    init();

    async function init(){
        fields = await SelectFormatFields({
            TableName:"AkdTable",
            Where:`TableName='${entity.value}'`
        });

        buttons = await SelectFormatFields({
            TableName:"AkdTableButton",
            Where:"TableName='AkdTableButton'"
        });
    }

    function searchEvent(data) {
        // where = data;
    }

    function tableEvent(row){
        
    }
</script>
<style scoped lang="scss">
    @import "@/scss/layout-top-middle.scss"
</style>
