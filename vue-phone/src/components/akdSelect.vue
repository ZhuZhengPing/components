<template>
    <div class="akd-select">
        <input :class="{'disabled': disabled}" type="text" :value="text" readonly :placeholder="placeholder" @click="togglePop"/>
        <i class="fa fa-angle-down"></i>
        <transition name="slide-up">
            <div @click="selectHandler" v-show="showPop" :class="{'in-bottom': isInBottom}" v-if="!url">
                <slot></slot>
            </div>
            <div @click="selectHandler" v-show="showPop" :class="{'in-bottom': isInBottom}" v-else>
                <p v-for="item in urlOptions" :key="item[valueField]" :value="item[valueField]">{{item[textField]}}</p>
            </div>
        </transition>
    </div>
</template>

<script setup>
    import {getTarget} from "../../public/index"
    import {ref} from "vue"
    import http from "../../public/http"

    const props = defineProps({
        disabled:Boolean,
        placeholder:String,
        url:String,
        valueField:String,
        textField:String,
        options:[]
    });

    let value = defineModel();

    // properties
    let showPop=ref(false);
    let isInBottom = ref(false);
    let text=ref("");
    text.value=value.value;
    let urlOptions =null;
    if(props.url){
        urlOptions = ref([]);
        http.get(props.url).then(res=>{
            urlOptions = res;
        });
    }

    function selectHandler(e){
        if(!showPop.value) return;
        const target = getTarget(e.target, 'p');
        text.value = target.innerHTML;
        value.value = target.getAttribute("value");
        showPop.value = !showPop.value;
    }

    function togglePop(e) {
        e.stopPropagation();
        if(props.disabled) {
            return;
        }
        isInBottom.value = e.target.getBoundingClientRect().y > window.innerHeight / 2;
        showPop.value = !showPop.value;
    }
</script>

<style lang="scss" scoped>
    .akd-select {
        position: relative;
        height: 42px;
        line-height: 42px;
        input {
            height: 100%;
            width: 100%;
            border-radius: 3px;
            padding: 0 10px;
            border: solid 1px lightgray;
            vertical-align: bottom;
            font-size: 14px;
            &.disabled {
                background-color: #f1f1f1;
            }
        }
        i {
            position: absolute;
            pointer-events: none;
            right: 0;
            top: 0;
            width: 38px;
            height: 100%;
            text-align: center;
            line-height: inherit;
        }
        div {
            position: absolute;
            z-index: 99999;
            padding: 0 5px;
            top: 100%;
            left: 0;
            width: 100%;
            max-height: 240px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            background-color: white;
            box-shadow: 5px 5px 15px rgba(0, 0, 0, .3);
            &.in-bottom {
                top: auto;
                bottom: 100%;
            }
        }
        p { 
            margin: 0;
            padding: 5px 15px;
            font-size: 15px;
            &:not(:last-child) {
                border-bottom: solid 1px #efefef;
            }
        }
    }
</style>