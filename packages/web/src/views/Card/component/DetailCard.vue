<template>
    <div class="detail Scroll-bar" :class="{'isNight':!isDay}">
        <!-- 头部时间 -->
        <Header :foreCastInfo="foreCastInfo" />
        <!-- 未来几天天气 -->
        <LargeCard :foreCastInfo="foreCastInfo" :isDay="isDay" :tempUnit="tempUnit"/>
        <!-- 当天小时天气数据 -->
        <HourForeCastCard :foreCastInfo="foreCastInfo" :isDay="isDay" :tempUnit="tempUnit"/>
        <!-- 天气参数 -->
        <WeatherDetail :foreCastInfo="foreCastInfo" :isDay="isDay" :tempUnit="tempUnit"/>
    </div>
</template>

<script setup lang="ts">
import LargeCard from '@/views/Card/component/LargeCard.vue';
import HourForeCastCard from '@/views/Card/component/HourForeCastCard.vue';
import WeatherDetail from '@/views/Card/component/WeatherDetail.vue';
import Header from '@/views/Card/component/header.vue'
import i18n from '@/i18n/index';
import _ from 'lodash';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay:boolean;
    tempUnit:boolean
}>();
</script>

<style scoped lang="scss">
.detail {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    max-width:457px;
    min-height: 100vh;
    background: url(../../../assets/img/day_bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 0 12px;
    padding-bottom: 15px;
    padding-top:57px;
}
.isNight{
    background: url(../../../assets/img/night_bg.png) no-repeat;
    background-size: 100% 100%;
}
.Scroll-bar::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
}
.Scroll-bar::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.1);
}
.Scroll-bar::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
</style>
