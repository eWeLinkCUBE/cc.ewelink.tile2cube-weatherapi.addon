<template>
    <div class="cast-card">
        <header>
            <div class="area-icon">
                <img src="@/assets/img/phone-area.png" alt="" />
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
                <img alt="" src="@/assets/img/api.png" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import i18n from '@/i18n/index';
import _ from 'lodash';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import { useWeatherStore } from '@/store/weather';
import { FORECAST_SETTING_MAPPING, translateByCode} from '@/utils/tools';

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay: boolean;
    tempUnit: boolean;
}>();

onMounted(() => {
    init();
});

watch(()=>[props.foreCastInfo,props.tempUnit,props.isDay],()=>{
    init();
});

const init = () => {
    //city name
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    //get correct temperature by cache;
    const tempUnit = props.tempUnit ? 'temp_c' : 'temp_f';
    formState.temperature = _.get(props.foreCastInfo, ['forecastData', 'current', tempUnit], '');
    //weather update time
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated'], 0);
    formState.updateTime = time.split(' ')[1]; //formatTimeUtils((new Date(time).getTime()), 'HH:mm');
    //weather describe
    const code = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'code'], 1000);
    // formState.describe = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'text'], '');
    const item = FORECAST_SETTING_MAPPING[code];
    formState.describe = translateByCode(code,props.isDay);
    formState.imgSrc = props.isDay ? item.dayIcon : item.nightIcon;
};

interface ISmallCardData {
    /** city name */
    cityName: string;
    /** temperature */
    temperature: number;
    /** weather describe */
    describe: string;
    /** weather update time */
    updateTime?: number | string;
    /** icon */
    imgSrc:string
}

/** cast card data */
const formState = reactive<ISmallCardData>({
    cityName: '',
    temperature: 0,
    describe: '',
    updateTime: 0,
    imgSrc:'',
});
</script>

<style scoped lang="scss">
.cast-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing:border-box;
    padding:.625rem .875rem 1rem .625rem;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    header {
        display: flex;
        align-items: center;
        text-align: left;
        .area-icon {
            display: flex;
            align-items: center;
            img {
                width: 0.7rem;
                height: 0.875rem;
                margin-right: 0.375rem;
            }
            span {
                font-size: 0.75rem;
                width:70vw;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
    section {
        // margin-top: 0.5rem;
        .temperature {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 3.5rem;//3.25rem;
                height: 3.5rem;//3.25rem;
            }
            span {
                color: #333333;
                font-size: 2.5rem;//1.75rem;
                font-weight: 600;
                white-space: nowrap;
            }
        }
        .weather {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: .1rem;//0.625rem;
            .word {
                display: inline-block;
                width: 10rem;
                white-space: nowrap;
                text-align: left;
                color: #333333;
                font-weight: 600;
                font-size: 1.125rem;
            }
        }
    }
    .update-time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.3rem;
        font-size: 0.875rem;
        color: #333333;
        white-space: nowrap;
        .api {
            display: flex;
            justify-content: space-between;
            align-items: center;
            img {
                width: 2.3rem;
                height: 0.9375rem;
            }
        }
    }
}
</style>
