<template>
  <Suspense>
      <router-view></router-view>
    <!-- <router-view v-slot="{Component,route}">
      <transition :name="route.meta.transition">
        <component :is="Component" :key="route.path"/>
      </transition>
    </router-view>  -->
  </Suspense>
</template>

<script setup>

</script>

<style lang="scss">
  #app{
    width:100%;
    height: 100%;
  }
  .router-back-enter-active, .router-back-leave-active,
  .router-next-enter-active, .router-next-leave-active {
    position: absolute !important;
    width: 100%;
    left: 0;
    top: 0;
    transition: all .5s ease;
  }
  .router-back-enter-active .router-next-leave-active {
    z-index: 2;
  }
  .router-next-enter-active, .router-back-leave-active {
    z-index: 3;
  }
  .router-back-enter-from, .router-next-leave-to {
    opacity: 0;
  }
  .router-back-leave-to, .router-next-enter-from {
    transform: translateX(100%);
  }
</style>
