<template>
    <div class="container">
        <div class="top">
            <temp-search :entity="entity" 
                    :fields="fields.filter(p=>p.IsInSearch && p.TableName==entity)" 
                    :buttons="buttons.filter(p=>p.ButtonType==20 && p.TableName==entity)" 
                    v-model="where"
                    @search-event="searchEvent"></temp-search>
        </div>

        <div class="middle">
            <temp-table :entity="entity" 
                   :fields="fields.filter(p=>p.IsInTable)" 
                   :buttons="buttons.filter(p=>p.ButtonType==10)"
                   v-model="where"
                   @table-event="tableEvent"></temp-table>
        </div>

        <div class="bottom">
            <temp-tabs v-model="parentData"
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
    import { useRoute } from 'vue-router';
    const route = useRoute();

    let entity = ref(route.query.entity);
    let pageSize = ref(route.query.pageSize||20);
    let entitys = reactive(route.query.tabEntity.split(","));
    
    let fields = reactive([]);
    let buttons = reactive([]);
    let where = ref({});
    let parentData = ref({});

    init();

    async function init(){
        fields = await SelectList({
            TableName:entity.value
        });

        buttons = await SelectList({
            TableName:"AkdTableButton",
            Where:"TableName='AkdTableButton'"
        });
    }

    function tableEvent(row){
        parentData.value=row;
    }
</script>
<style scoped lang="scss">
    @import "@/scss/layout-top-middle.scss";
</style>