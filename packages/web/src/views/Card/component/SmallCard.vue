<template>
   <!-- height: styleObject.object.height + 'px' } -->
    <div class="small-card" :style="{ width: styleObject.object.width + 'px'}">
        <header>
            <div class="area-icon">
               <img src="@/assets/img/area.png" alt="" />
               <span>{{ '深圳' }}</span>
            </div>
        </header>
        <section>
            <div class="temperature">
               <img src="@/assets/img/sunny.png" alt="" />
               <span>29°</span>
            </div>
            <div class="weather">
               <span class="word">多云</span>
               <div class="api">
                  <img alt="" src="@/assets/img/area.png" />
                  <span>weather<br/>api</span>
               </div>
            </div>
        </section>
        <div class="update-time">
            更新 : 23:00
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
const router = useRouter();
interface IStyle {
    object: {
        width: number;
        height: number;
    };
}
const props = defineProps<{
    styleObject: IStyle;
}>();
onMounted(() => {
    console.log('props============>', props.styleObject.object.width);
    width.value = props.styleObject.object.width;
});
const width = ref(0);
</script>

<style scoped lang="scss">
.small-card {
   margin: 0 auto;
   text-align: center;
   padding: 5px;
   border: 1px solid #ccc;
   border-radius: 6px;
   // width: v-bind(width + 'px');
   header {
      display: flex;
      align-items: center;
      text-align: left;
        .area-icon {
            img {
               width: 14px;
               height: 14px;
               margin-right: 6px;
            }
            span{
               font-size: 12px;
            }
      }
   }
   section{
      margin-top: 8px;
      .temperature{
         display: flex;
         justify-content: space-between;
         align-items: center;
         img{
            width: 52px;
            height: 52px;
         }
         span{
            color:#333333;
            font-size: 28px;
         }
      }
      .weather{
         display: flex;
         align-items: center;
         justify-content: space-between;
         margin-top: 10px;
         .word{
            display: inline-block;
            width: 52px;
            text-align: center;
            color: #333333;
            font-size: 16px;
         }
         .api{
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{
               width: 12px;
               height: 15px;
               margin-right: 5px;
            }
            span{
               font-size: 12px;
               color: #333333 ;
               text-align: center;
               line-height: 11px;
            }
         }
      }
   }
   .update-time{
      text-align: left;
      margin-top: 11px;
      font-size: 14px;
      color: #333333;
   }
}
</style>
