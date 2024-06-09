<template>
    <div class="container">
        <div class="top">
            <temp-search :entity="entity" 
                    :fields="fields.filter(p=>p.IsInSearch && p.TableName==entity)" 
                    :buttons="buttons.filter(p=>p.ButtonType==20 && p.TableName==entity)" @search-event="searchEvent"></temp-search>
        </div>

        <div class="middle">
            <temp-table :entity="entity" 
                   :fields="fields.filter(p=>p.IsInTable && p.TableName==entity)" 
                   :buttons="buttons.filter(p=>p.ButtonType==10 && p.TableName==entity)"
                   :where="where"
                   @table-event="tableEvent"></temp-table>
        </div>

        <div class="bottom">
            <temp-tabs :parentData="parentData"
                  :parentEntity="entity"
                  :entitys="entitys"></temp-tabs>
        </div>
    </div>
</template>
<script setup>
    import { reactive,ref } from 'vue';
    import { SelectList } from '@/http/index.js';
    import { getQueryString } from '@/public/index.js';
    import tempSearch from '@/components/template-model/temp-search.vue';
    import tempTable from '@/components/template-model/temp-table.vue';
    import tempTabs from '@/components/template-model/temp-tabs.vue';

    let entity = ref(getQueryString("entity"));
    let pageSize = ref(getQueryString("pageSize"));
    let fields = reactive([]);
    let buttons = reactive([]);
    let where = reactive({});
    let entitys = reactive(getQueryString("tabEntity").split(","));
    let parentData = reactive({});

    init();

    async function init(){
        fields = await SelectList({
            TableName:props.entity
        });

        buttons = await SelectList({
            TableName:"AkdTableButton",
            Where:"TableName='AkdTableButton'"
        });
    }

    function tableEvent(row){
        parentData=row;
    }
</script>
<style scoped lang="scss">
    @import "../../layout-left-right.scss";
</style>