<template>
    <div class="weather-detail">
        <div class="item" v-for="(item, index) in itemData" :key="index">
            <div class="left">
                <img :src="item.imgSrc" alt="" />
                <span>{{ item.describe }}</span>
            </div>
            <div class="right">
                {{ item.value }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils, kmToMs, WIND_DIR_MAPPING ,judgeUv ,judgeAirQuality} from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import i18n from '@/i18n/index';
import { useEtcStore } from '@/store/etc';

import FeelsLike from '@/assets/img/feelslike.png';
import SunRise from '@/assets/img/sunrise.png';
import SunSet from '@/assets/img/sunset.png';
import PressureMb from '@/assets/img/pressure_mb.png';
import WindKph from '@/assets/img/wind_kph.png';
import PrecipMm from '@/assets/img/precip_mm.png';
import WindDir from '@/assets/img/wind_dir.png';
import AirQuality from '@/assets/img/air_quality.png';
import Uv from '@/assets/img/uv.png';
import Avg_vis_km from '@/assets/img/avgvis_km.png';

const weatherStore = useWeatherStore();
const etcStore = useEtcStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay:boolean
    tempUnit:boolean
}>();

interface IWeatherDetail {
    /** Sensitive temperature in Celsius */
    feelslike_c: number;
    /** Sensitive temperature in Fahrenheit */
    feelslike_f: number;
    /** sunrise */
    sunrise: string;
    /** sunset */
    sunset: string;
    /** barometric pressure */
    pressure_mb: number;
    /** wind speed */
    wind_kph: number; //km/h
    /** rainfall */
    precip_mm: number; //mm
    /** wind direction */
    wind_dir: string; //W N E
    /** air quality */
    air_quality: number;
    /** ultraviolet light */
    uv: number;
    /** visibility */
    avgvis_km: number;
}

/** line data */
interface IItemData {
    /** weather icon */
    imgSrc: string;
    /** weather temperature */
    value: string | number;
    /** weather describe */
    describe: string;
}

onMounted(() => {
    initialAssignment();
});
watch(()=>[props.foreCastInfo,props.tempUnit,props.isDay],()=>{
    initialAssignment();
});

const itemData = ref<IItemData[]>([]);

/** init */
const initialAssignment = () => {
    let formState: IWeatherDetail = {
        feelslike_c: _.get(props.foreCastInfo, ['forecastData', 'current', 'feelslike_c'], 0),
        feelslike_f: _.get(props.foreCastInfo, ['forecastData', 'current', 'feelslike_f'], 0),
        sunrise: _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], [])[0].astro.sunrise,
        sunset: _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], [])[0].astro.sunset,
        pressure_mb: _.get(props.foreCastInfo, ['forecastData', 'current', 'pressure_mb'], 0),
        wind_kph: _.get(props.foreCastInfo, ['forecastData', 'current', 'wind_kph'], 0),
        precip_mm: _.get(props.foreCastInfo, ['forecastData', 'current', 'precip_mm'], 0),
        wind_dir: _.get(props.foreCastInfo, ['forecastData', 'current', 'wind_dir'], ''),
        air_quality: _.get(props.foreCastInfo, ['forecastData', 'current', 'air_quality', 'us-epa-index'], ''), //欧洲标准是gb-defra-index
        uv: _.get(props.foreCastInfo, ['forecastData', 'current', 'uv'], 0),
        avgvis_km: _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], [])[0].day.avgvis_km,
    };

    itemData.value = [
        { imgSrc: FeelsLike, value: (props.tempUnit ? formState.feelslike_c : formState.feelslike_f) + '°', describe: i18n.global.t('FEELS_LIKE') },
        { imgSrc: SunRise, value: formState.sunrise, describe: i18n.global.t('SUNRISE') },
        { imgSrc: SunSet, value: formState.sunset, describe: i18n.global.t('SUNSET') },
        { imgSrc: PressureMb, value: formState.pressure_mb + ' hPa', describe: i18n.global.t('PRESSURE_MB') },
        { imgSrc: WindKph, value: kmToMs(formState.wind_kph) + 'm/s', describe: i18n.global.t('WIND_KPH') },
        { imgSrc: PrecipMm, value: formState.precip_mm + ' mm', describe: i18n.global.t('PRE_CIP_MM') },
        { imgSrc: WindDir, value: i18n.global.t(WIND_DIR_MAPPING[formState.wind_dir]), describe: i18n.global.t('WIND_DIR') },
        { imgSrc: AirQuality, value: judgeAirQuality(formState.air_quality), describe: i18n.global.t('AIR_QUALITY') },
        { imgSrc: Uv, value: formState.uv + judgeUv(formState.uv), describe: i18n.global.t('UV') },
        { imgSrc: Avg_vis_km, value: formState.avgvis_km+'km', describe: i18n.global.t('AVG_VIS_KM') },
    ];
};
</script>

<style scoped lang="scss">
.weather-detail {
    margin: 0 auto;
    user-select: none;
    width: 100%;
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px;
    padding: 12px;
    margin-top: 12px;
    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffff;
        font-size: 16px;
        margin-bottom: 12px;
        font-weight: 500;
        img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }
    }
}
</style>
