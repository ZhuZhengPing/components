<template>
    <div class="container">
        <div class="top" v-if="form.search.length>0">
            <temp-search :entity="entity" 
                    :fields="fields.filter(p=>p.IsInSearch>0)" 
                    :buttons="buttons.filter(p=>p.ButtonType==20)" @search-event="searchEvent"></temp-search>
        </div>

        <div class="middle">
            <temp-table :entity="entity" 
                   :fields="fields.filter(p=>p.IsInTable)" 
                   :buttons="buttons.filter(p=>p.ButtonType==10)"
                   :where="where"></temp-table>
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
    let pageSize = ref(getQueryString("pageSize"));
    let fields = reactive([]);
    let buttons = reactive([]);
    let where = reactive({});

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
        where = data;
    }

    // function exportEvent(){ 
    //     form.loading = true;
    //     selectList(searchModel).then(data=>{
    //         // 创建工作簿和工作表
    //         var wb = XLSX.utils.book_new();
    //         var ws = XLSX.utils.aoa_to_sheet(data);

    //         // 设置标题样式
    //         var titleStyle = { font: { bold: true, color: { rgb: '000000' } } };
    //         var range = XLSX.utils.decode_range(ws['!ref']);
    //         for (var col = range.s.c; col <= range.e.c; col++) {
    //             var cellAddress = { c: col, r: 0 }; // 标题通常在第一行
    //             var cellRef = XLSX.utils.encode_cell(cellAddress);
    //             ws[cellRef].s = titleStyle;
    //         }

    //         // 设置列宽自适应内容
    //         var wscols = [];
    //         for (var col = range.s.c; col <= range.e.c; col++) {
    //             var maxLength = 0;
    //             for (var row = range.s.r; row <= range.e.r; row++) {
    //                 var cellAddress = { c: col, r: row };
    //                 var cellRef = XLSX.utils.encode_cell(cellAddress);
    //                 if (ws[cellRef] && ws[cellRef].v) {
    //                     var cellLength = String(ws[cellRef].v).length;
    //                     maxLength = Math.max(maxLength, cellLength);
    //                 }
    //             }
    //             var colWidth = { wch: maxLength + 2 }; // 加 2 以留出一些空间
    //             wscols.push(colWidth);
    //         }
    //         ws['!cols'] = wscols;

    //         // 添加工作表到工作簿
    //         XLSX.utils.book_append_sheet(wb, ws, props.props||"Sheet1");

    //         // 保存文件
    //         XLSX.writeFile(wb, props.name+"列表.xlsx" );
    //     }).finally(()=>{
    //         form.loading = false;
    //     });
    // }
</script>
<style scoped lang="scss">

    @import "@/scss/layout-top-middle.scss"


    // .container{
    //     display: flex;
    //     flex-direction: column;
    //     height: 100%;

    //     .banner{
    //         flex:none;
    //         padding:5px;
    //         display: flex;
    //         align-items: center;
    //         box-shadow: 0px 1px 5px #ccc;
    //         margin-bottom: 5px;
    //         flex-wrap: wrap;
    //     }

    //     .content{
    //         flex:auto;
    //         height: 100%;
    //         box-shadow: 0px 1px 5px #ccc;
    //         display: flex;
    //         flex-direction: column;
    //     }
    // }
</style>
