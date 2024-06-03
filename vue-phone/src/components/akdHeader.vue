<template>
    <div class="akd-header-component">
        <div class="left">
            <slot name="left">
                <i style="font-size:28px;" class="fa fa-angle-left" @click="goBack"></i>
            </slot>
        </div>
        <h3>
            <slot></slot>
        </h3>
        <div>
            <slot name="right">
                <i></i>
            </slot>
        </div>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter();

    function goBack() {
        router.back();
    }

</script>


<style lang="scss">
    @import "../../scss/public";

    .akd-header-component {
        flex: none;
        height: $line-height-big;
        background-color: $color-header;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
            flex: none;
            width: $line-height-big;
            height: 100%;
            i {
                height: 100%;
                width: 100%;
                display: inline-block;
                text-align: center;
                font-size: 20px;
                line-height: $line-height-big;
            }
        }
        h3 {
            flex: auto;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>