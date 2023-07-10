<template>
    <div class="detail" :class="{'isNight':!isDay}">
        <!-- header time -->
        <Header :foreCastInfo="foreCastInfo" />
        <!-- forCast weather -->
        <LargeCard :foreCastInfo="foreCastInfo" :isDay="isDay" :tempUnit="tempUnit"/>
        <!-- hour weather data -->
        <HourForeCastCard :foreCastInfo="foreCastInfo" :isDay="isDay" :tempUnit="tempUnit"/>
        <!-- weather params -->
        <WeatherDetail :foreCastInfo="foreCastInfo" :isDay="isDay" :tempUnit="tempUnit"/>
    </div>
</template>

<script setup lang="ts">
import LargeCard from '@/views/Card/component/LargeCard.vue';
import HourForeCastCard from '@/views/Card/component/HourForeCastCard.vue';
import WeatherDetail from '@/views/Card/component/WeatherDetail.vue';
import Header from '@/views/Card/component/header.vue';
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
    height: 100vh;
    min-height: 100vh;
    overflow: auto;
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
.detail::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.detail::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.1);
}
.detail::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
</style>
