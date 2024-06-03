<template>
  <Suspense>
    <router-view v-slot="{ Component }" class="haha">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </Suspense>
</template>

<script setup>
  import {ref} from 'vue';
  import {onBeforeRouteLeave} from 'vue-router';

  let routerName = ref();

  // onBeforeRouteLeave((to,from)=>{
  //   if(to.meta.index<from.meta.index){
  //     this.routerName = "router-back";
  //   }else{
  //     this.routerName = "router-next";
  //   }
  // })

</script>

<style lang="scss">
  #app{
    width:100%;
    height: 100%;
  }
  // .app-div{
  //   width:100%;
  //   height: 100%;
  // }
  // #back-view {
  //   position: absolute;
  //   z-index: 9999;
  //   height: 42%;
  //   background-color: rgba(222, 176, 107, 0.81);
  //   color: white;
  //   font-size: 24px;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: flex-end;
  //   justify-content: center;
  //   border-radius: 0 100% 100% 0;
  //   width: 0;
  //   left: 0;
  //   top: 0;
  //   i {
  //     margin-right: 15px;
  //   }
  // }
</style>
