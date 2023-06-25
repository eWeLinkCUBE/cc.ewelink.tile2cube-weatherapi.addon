<template>
    <a-spin
        style="min-height: 100vh; background-color: rgba(34, 34, 34, 0.6); color: #ffff"
        :spinning="loading"
        :indicator="indicator"
        :tip="'loading'"
        size="large"
    >
        <div class="setting">
            <section>
                <h2 class="foreCast-setting">{{ $t('FORECAST_SETTING') }}</h2>
                <h3 class="forecast-describe">{{ $t('FORECAST_DESCRIBE') }}</h3>
                <div class="form">
                    <a-form :model="formState" v-bind="layout" name="nest-messages" :validate-messages="validateMessages">
                        <a-form-item :name="['weather', 'weatherApiKey']" label="weatherApiKey" :rules="[{ required: true }]">
                            <a-input v-model:value="formState.weather.weatherApiKey" :placeholder="$t('PLEASE_ENTER_API_KEY')" />
                        </a-form-item>
                        <a-form-item :name="['weather', 'cityData']" label="cityData" :rules="[{ required: true }]">
                            <a-select
                                v-model:value="formState.weather.cityData"
                                show-search
                                :placeholder="$t('PLEASE_ENTER_CITY')"
                                style="width: 350px"
                                :default-active-first-option="false"
                                :filter-option="false"
                                :not-found-content="null"
                                :disabled="!formState.weather.weatherApiKey.trim()"
                                @search="(value:string)=>toggleDebounce(value)"
                            >
                                <a-select-option :key="select.id" :value="select.id" v-for="select in cityData">
                                    {{ select.display_name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item :name="['weather', 'tempUnit']" label="tempUnit" :rules="[{ required: true }]">
                            <a-select v-model:value="formState.weather.tempUnit" style="width: 350px" :placeholder="$t('PLEASE_ENTER_TEMPERATURE')">
                                <a-select-option :key="select.label" :value="select.value" v-for="select in temperatureData">
                                    {{ select.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </div>
            </section>
            <footer class="footer">
                <a-button :disabled="disabled" type="primary" @click="submitHandler">{{$t('FINISH')}}</a-button>
            </footer>
            <!-- <a-button type="primary" @click="getForeCastInfo">获取天气数据</a-button> -->
            <!-- <iframe src="http://127.0.0.1:5173/#/card" class="scroll-bar" style="width: 368px; height: 170px;" /> -->
            <!-- ?ihost_env=iHostWebCustomCardDrawer&language=en-us -->
            <iframe src="http://127.0.0.1:5173/#/card?ihost_env=iHostWebCustomCardDrawer&language=en-us" class="scroll-bar" style="width: 460px; height: 868px;" />
        </div>
    </a-spin>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
import { useWeatherStore } from '@/store/weather';
import { message } from 'ant-design-vue';
import { temperatureData } from '@/utils/tools';
import { LoadingOutlined } from '@ant-design/icons-vue';
import type { ICityData, IFormState, IRequestForeCastInfo, IRequestConfigInfo, ISubmitData } from '@/api/ts/interface/IWeatherInfo';
const weatherStore = useWeatherStore();
const router = useRouter();

const loading = ref(false);

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px',
    },
    spin: true,
});

onMounted(async () => {
    await getSaveDate();
    return;
    const res = await api.GetTokenInfo();
    if (res.error === 0 && res.data?.cubeTokenValid) {
        await getSaveDate();
    } else {
        router.push('/token');
    }
});

/** 表单数据 */
const formState = reactive<IFormState>({
    weather: {
        weatherApiKey: '', //da6d2169b711424dac184721231206
        cityData: undefined,
        tempUnit: undefined,
    },
});

/** 获取已经保存的数据 */
const getSaveDate = async () => {
    loading.value = false;
    const res = await api.GetSaveData();
    if (res.error === 0 && res.data) {
        cityData.value = [res.data?.cityData];
        formState.weather.weatherApiKey = res.data?.weatherApiKey;
        formState.weather.cityData = res.data?.cityData.id;
        formState.weather.tempUnit = res.data?.tempUnit;
        // weatherStore.setWeatherInfo(formState);
        console.log('tempUnit------------>',weatherStore.weatherInfo.weather.tempUnit);
    }
    setTimeout(()=>{
        loading.value=false;
    },200)
};

/** form表单的长度 */
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

/** 必填校验 */
const validateMessages = { required: '${label} is required!' };

/** 设置配置信息  */
const submitHandler = async () => {
    let params: IRequestConfigInfo = {
        cityData: {},
        weatherApiKey: formState.weather.weatherApiKey,
        tempUnit: formState.weather.tempUnit,
    };
    for (const item of cityData.value) {
        if (formState.weather.cityData == item.id + '') {
            params.cityData = item;
        }
    }
    console.log('params--------------->', params);
    const res = await api.setConfigData(params);
    if (res.error === 0 && res.data) {
        console.log(res);
        weatherStore.setWeatherInfo(formState);
        console.log('提交存的数据---》',weatherStore.weatherInfo.weather);
    }
};

/** 控制提交按钮是否可以点击 */
const disabled = computed(() => {
    //没有填完
    if (!formState.weather.weatherApiKey || !formState.weather.cityData || !formState.weather.tempUnit) {
        return true;
    }

    //与旧数据有异
    const weatherInfo = JSON.stringify(formState.weather);
    if (JSON.stringify(weatherStore.weatherInfo.weather) !== weatherInfo) {
        return false;
    }
    return true;
});

//城市数据
const cityData = ref<ICityData[]>([]);

/** 获取城市数据 */
const getCityList = async (value: string) => {
    if (!value || !formState.weather.weatherApiKey) return;
    const res = await api.GetCityList(formState.weather.weatherApiKey.trim(), value);
    if (res.error === 0 && res.data) {
        cityData.value = res.data?.cityList.map((item) => {
            item.display_name = `${item.name} ( ${item.country} , ${item.region} )`;
            return item;
        });
    } else {
        cityData.value = [];
    }
};

/** 获取天气预报信息 */
const getForeCastInfo = async () => {
    const params: IRequestForeCastInfo = {
        refresh: '1',
        days: 3,
    };
    const res = await api.getForeCastInfo(params);
    console.log('res-------------->', res);
};

/** 搜索城市防抖 */
const toggleDebounce = _.debounce(getCityList, 800, {
    leading: true,
    trailing: true,
});
</script>

<style scoped lang="scss">
.setting {
    padding: 18px;
    margin: 0 auto;
    // width:100%;
    .title {
        font-size: 16px;
        font-weight: 600;
    }
    .foreCast-setting {
        text-align: center;
    }
    .forecast-describe {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .form {
        width: 600px;
        margin: 0 auto;
        .ant-input {
            width: 350px;
        }
    }
    .footer {
        text-align: right;
        margin-top: 100px;
        :deep(.ant-btn) {
            background-color: transparent;
            border:none;
            font-size: 16px;
        }
        :deep(.ant-btn-primary){
            background-color: transparent;
            border:none;
            color: #1890ff;
            box-shadow: none;
        }
    }
}
</style>
