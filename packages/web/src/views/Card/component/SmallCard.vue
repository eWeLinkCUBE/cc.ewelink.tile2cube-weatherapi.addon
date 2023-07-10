<template>
    <div class="small-card">
        <header>
            <div class="area-icon">
                <img src="@/assets/img/area.png" alt="" />
                <span>{{ formState.cityName }}</span>
            </div>
        </header>
        <section>
            <div class="temperature">
                <img :src="formState.imgSrc" alt="" />
                <span>{{ formState.temperature + '°' }}</span>
            </div>
            <div class="weather">
                <span class="word">
                    {{ formState.describe }}
                </span>
            </div>
        </section>
        <div class="update-time">
            <span>{{ $t('UPDATE') + ':' + formState.updateTime }}</span>
            <div class="api">
                <img alt="" src="@/assets/img/weather-api.png" />
                <span>weather<br />api</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import i18n from '@/i18n/index';
import _ from 'lodash';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import { formatTimeUtils, FORECAST_SETTING_MAPPING,translateByCode } from '@/utils/tools';

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay: boolean;
    tempUnit: boolean;
}>();

interface ISmallCardData {
    /** city name */
    cityName: string;
    /** temperature */
    temperature: number;
    /** weather describe */
    describe: string;
    /** weather update time */
    updateTime?: number | string;
    /** weather icon */
    imgSrc: string;
}

/** Data required for 1*1 card */
const formState = reactive<ISmallCardData>({
    cityName: '',
    temperature: 0,
    describe: '',
    updateTime: 0,
    imgSrc: '',
});

onMounted(() => {
    init();
});

watch(
    () => [props.foreCastInfo,props.tempUnit,props.isDay],
    () => {
        init();
    }
);

const init = () => {
    //city name
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    //Take the temperature in the corresponding unit according to the interface
    const tempUnit = props.tempUnit ? 'temp_c' : 'temp_f';
    formState.temperature = _.get(props.foreCastInfo, ['forecastData', 'current', tempUnit], '');
    //weather update time
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated'], 0);
    formState.updateTime =time.split(' ')[1]; // formatTimeUtils((new Date(time).getTime()), 'HH:mm');
    //current weather code
    const code = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'code'], 1000);
    //Get the corresponding Chinese and English, day and night icons according to the code
    const item = FORECAST_SETTING_MAPPING[code];
    formState.describe = translateByCode(code,props.isDay);
    formState.imgSrc = props.isDay ? item.dayIcon : item.nightIcon;
};
</script>

<style scoped lang="scss">
.small-card {
    margin: 0 auto;
    text-align: center;
    user-select: none;
    padding: 8px;
    border-radius: 6px;
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
            span {
                font-size: 12px;
            }
        }
    }
    section {
        margin-top: 8px;
        .temperature {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 52px;
                height: 52px;
            }
            span {
                color: #333333;
                font-size: 28px;
            }
        }
        .weather {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            .word {
                display: inline-block;
                white-space: nowrap;
                width: 52px;
                text-align: center;
                color: #333333;
                font-size: 16px;
            }
        }
    }
    .update-time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 14px;
        color: #333333;
        .api {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 12px;
                height: 15px;
                margin-right: 5px;
            }
            span {
                font-size: 12px;
                color: #333333;
                text-align: right;
                line-height: 11px;
            }
        }
    }
}
</style>
