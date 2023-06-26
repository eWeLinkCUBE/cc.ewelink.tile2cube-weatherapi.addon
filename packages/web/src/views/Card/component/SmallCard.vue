<template>
    <!--  :style="{ width: formState.cardWidth + 'px' }" -->
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
                <div class="api">
                    <img alt="" src="@/assets/img/area.png" />
                    <span>weather<br />api</span>
                </div>
            </div>
        </section>
        <div class="update-time">{{ $t('UPDATE') + ':' + formState.updateTime }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted} from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import type { IForeCastResultInfo, ICardStyle } from '@/api/ts/interface/IWeatherInfo';
import { useWeatherStore } from '@/store/weather';
import { formatTimeUtils, FORECAST_SETTING_MAPPING } from '@/utils/tools';
const weatherStore = useWeatherStore();

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
    isDay:boolean
}>();

onMounted(() => {
    //城市名称
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    //根据缓存取对应单位的温度
    const tempUnit = weatherStore.weatherInfo.weather.tempUnit === 'C' ? 'temp_c' : 'temp_f';
    formState.temperature = _.get(props.foreCastInfo, ['forecastData', 'current', tempUnit], '');
    //天气更新时间
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated_epoch'], 0);
    formState.updateTime = formatTimeUtils(time, 'HH:mm');
    //是否是白天
    const isDay = props.isDay;
    //当前天气
    const code = _.get(props.foreCastInfo, ['forecastData', 'current', 'condition', 'code'], 1000);

    const item = FORECAST_SETTING_MAPPING.find((item)=>item.code === code);
    if(item){
        formState.describe = isDay ? item?.day :item?.night
        formState.imgSrc = isDay ? item?.dayIcon:item?.nightIcon;
    }
});

interface ISmallCardData {
    /** 城市名称 */
    cityName: string;
    /** 温度 */
    temperature: number;
    /** 天气描述 */
    describe: string;
    /** 更新时间 */
    updateTime?: number | string;
    /** 图标 */
    imgSrc:string,
}

/** 1*1卡片所需的数据 */
const formState = reactive<ISmallCardData>({
    cityName: '',
    temperature: 0,
    describe: '',
    updateTime: 0,
    imgSrc:''
});
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
    .update-time {
        text-align: left;
        margin-top: 15px;
        font-size: 14px;
        color: #333333;
    }
}
@media screen and (min-width: 960px) {
    // .small-card {
    //     background-color: red !important;;
    // }
}
</style>
