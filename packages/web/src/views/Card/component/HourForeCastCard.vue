<template>
    <div class="hour-forecast">
        <div class="header">
            <img src="@/assets/img/alarm.png" alt="" />
            <span>{{ $t('HOUR_FORECAST') }}</span>
        </div>
        <div class="card">
            <div class="item" v-for="(item, index) in HourData" :key="index">
                <p>{{ index === 0 ? $t('NOW') : item.time.split(' ')[1] }}</p>
                <img :src="imgMapping(item)" alt="" />
                <p>{{ (tempUnit ? item.temp_c : item.temp_f) + '°' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import _ from 'lodash';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils, FORECAST_SETTING_MAPPING } from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import i18n from '@/i18n/index';
const weatherStore = useWeatherStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay: boolean;
    tempUnit: boolean;
}>();

/** weather hour data */
const HourData = ref<IHourData[]>([]);

/** hour data list */
interface IHourData {
    condition: {
        /** weather icon */
        code: number;
        /** current weather */
        text: string;
    };
    /** Celsius */
    temp_c: string;
    /** Fahrenheit */
    temp_f: string;
    /** hour timestamp */
    time_epoch: number;
    /** local time */
    time: string;
}

onMounted(() => {
    assembleData();
});
watch(
    () => [props.foreCastInfo, props.tempUnit, props.isDay],
    () => {
        assembleData();
    }
);

/** Assemble hour data */
const assembleData = () => {
    const foreCastDay = _.get(props.foreCastInfo, ['forecastData', 'forecast', 'forecastday'], []);
    if (foreCastDay.length > 1) {
        //Considering the day, for example, four hours after 23:00, a total of two days and 48 hours of data are currently obtained;
        const twoDaysHourData: IHourData[] = _.concat(foreCastDay[0].hour, foreCastDay[1].hour);
        if (twoDaysHourData.length > 0) {
            let index = -1;
            for (let i = 0; i <= twoDaysHourData.length - 1; i++) {
                if (twoDaysHourData[i].time_epoch <= moment().unix() && twoDaysHourData[i + 1].time_epoch >= moment().unix()) {
                    index = i;
                    break;
                }
            }
            //Get five hours of weather data
            if (index !== -1) {
                HourData.value = _.slice(twoDaysHourData, index, index + 5);
                console.log('index------------>', index, HourData.value);
            }
        }
    }
};

const imgMapping = (hourData: IHourData) => {
    const item = FORECAST_SETTING_MAPPING[hourData.condition.code];
    if (item) return props.isDay ? item.dayIcon : item.nightIcon;
    return '';
};
</script>

<style scoped lang="scss">
.hour-forecast {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    margin: 0 auto;
    user-select: none;
    width: 100%;
    height: 129px;
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px;
    padding: 12px;
    margin-top: 12px;
    .header {
        margin-bottom: 12px;
        img {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
        span {
            font-size: 12px;
            font-weight: 400;
            color: #ffff;
        }
    }
    .card {
        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
        text-align: center;
        font-size: 10px;
        color: #ffffff;
        .item {
            img {
                width: 37px;
                height: 37px;
            }
        }
    }
}
</style>
