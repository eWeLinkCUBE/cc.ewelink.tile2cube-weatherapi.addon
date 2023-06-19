<template>
    <div class="cast">
        cast
    </div>
 </template>

 <script setup lang="ts">
 import { ref, onMounted, computed, watch } from 'vue';
 import { useRouter } from 'vue-router';
 import i18n from '@/i18n/index';
 import _ from 'lodash';
 import api from '@/api/Weather/index';
 const router = useRouter();
 </script>

 <style scoped lang="scss">
 .cast{
   display: flex;
   justify-content: center;
   margin:0 auto;
   text-align: center;
   width:146px;
}
 </style>
