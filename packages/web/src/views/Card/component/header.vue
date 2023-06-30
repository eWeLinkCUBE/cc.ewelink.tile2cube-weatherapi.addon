<template>
    <header class="header">
        <div class="left">
            <img src="@/assets/img/area-white.png" alt="" />
            <span>{{ formState.cityName }}</span>
        </div>
        <span class="right">{{ $t('UPDATE') + ':' + formState.updateTime }}</span>
    </header>
</template>

<script setup lang="ts">
import { onMounted ,reactive } from 'vue';
import i18n from '@/i18n/index';
import _ from 'lodash';
import { formatTimeUtils } from '@/utils/tools';
import moment from 'moment';
import type { IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';

const props = defineProps<{
    foreCastInfo: IForeCastResultInfo;
}>();
interface IFormState {
    cityName: string;
    updateTime: number | string;
}
const formState = reactive<IFormState>({
    cityName: '',
    updateTime: '',
});
onMounted(() => {
    init();
});
watch(()=>props.foreCastInfo,()=>{
    init();
});

const init = () =>{
    formState.cityName = _.get(props.foreCastInfo, ['forecastData', 'location', 'name'], '');
    const time = _.get(props.foreCastInfo, ['forecastData', 'current', 'last_updated'], 0);
    formState.updateTime = time.split(' ')[1]; //formatTimeUtils((new Date(time).getTime()), 'HH:mm');
}
</script>

<style scoped lang="scss">
header {
    width: 100%;
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    user-select: none;
    font-weight: 400;
    color: #FFFFFF;
    img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
    }
}
</style>
