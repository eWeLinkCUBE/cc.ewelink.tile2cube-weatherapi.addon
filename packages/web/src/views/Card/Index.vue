<template>
    <component :is="displayType" :styleObject="styleObject"/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import SmallCard from '@/views/Card/component/SmallCard.vue';
import LargeCard from '@/views/Card/component/LargeCard.vue';
import Detail from '@/views/Card/component/DetailCard.vue';
import Cast from '@/views/Card/component/CastCard.vue';

const displayType = ref();
interface IStyle{
    object:{
        width:number,
        height:number
    }
}
const styleObject = reactive<IStyle>({
    object: {
        width:0,
        height:0
    },
});
const relationMap:{[key:string]:any} = {
    'SmallCard':SmallCard
}
onMounted(()=>{
    styleObject.object.width = window.innerWidth;
    styleObject.object.height = window.innerHeight;
    // console.log('styleObject--------------->',window.innerWidth,window.innerHeight);
    displayType.value = SmallCard;
})
</script>

<style scoped lang="scss">
</style>
