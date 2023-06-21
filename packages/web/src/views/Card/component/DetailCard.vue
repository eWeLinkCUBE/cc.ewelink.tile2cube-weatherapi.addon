<template>
    <div class="detail">
        <Header :foreCastInfo="foreCastInfo" />
        <!-- 未来几天天气 -->
        <LargeCard :foreCastInfo="foreCastInfo" :styleObject="styleObject" />
        <!-- 当天小时天气数据 -->
        <HourForeCastCard :foreCastInfo="foreCastInfo"/>
        <!-- 天气参数 -->
        <WeatherDetail :foreCastInfo="foreCastInfo" />
    </div>
</template>

<script setup lang="ts">
import LargeCard from '@/views/Card/component/LargeCard.vue';
import HourForeCastCard from '@/views/Card/component/HourForeCastCard.vue';
import WeatherDetail from '@/views/Card/component/WeatherDetail.vue';
import Header from '@/views/Card/component/header.vue'
import i18n from '@/i18n/index';
import _ from 'lodash';
import type { IForeCastResultInfo, ICardStyle } from '@/api/ts/interface/IWeatherInfo';

const props = defineProps<{
    styleObject: ICardStyle;
    foreCastInfo: IForeCastResultInfo;
}>();
</script>

<style scoped lang="scss">
.detail {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width:457px;
    height: 100vh;
    background: url(../../../assets/img/day_bg.png) no-repeat;
    background-size: 457px 868px;
    padding: 0 12px;
    padding-bottom: 15px;
    padding-top:57px;
}
</style>
