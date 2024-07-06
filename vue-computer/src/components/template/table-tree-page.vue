<template>
    <div class="container">
        <div class="top" v-if="form.search.length>0">
            <temp-search :entity="entity" 
                    :fields="fields.filter(p=>p.IsInSearch>0)" 
                    :buttons="buttons.filter(p=>p.ButtonType==20)" 
                    v-model="where"
                    @search-event="searchEvent"></temp-search>
        </div>
    </div>
    
    <div class="middle">
        
    </div>
</template>