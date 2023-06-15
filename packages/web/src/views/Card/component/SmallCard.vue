<template>
   <div class="small-card">
      small-card
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
const router = useRouter();
interface IStyle{
    object:{
        width:number,
        height:number
    }
}
const props = defineProps<{
   styleObject: IStyle;
}>();
onMounted(()=>{
   console.log('props============>',props.styleObject);
   width.value = props.styleObject.object.width;
});
const width = ref(0);
</script>

<style scoped lang="scss">
.small-card{
   display: flex;
   justify-content: center;
   margin:0 auto;
   text-align: center;
   // width:146px;
   width: v-bind(width + 'px');
}
</style>
