<template>
    <div class="setting">
        <section>
            <h2 class="foreCast-setting">{{ $t('FORECAST_SETTING') }}</h2>
            <h3 class="forecast-describe" :style="{'width':language?'500px':'600px'}">
                <span>
                    {{ $t('FORECAST_WEATHER_API') }}
                    <a href="https://www.weatherapi.com/" target="_blank">https://www.weatherapi.com/</a><br/>
                </span>
                <span>{{ $t('FORECAST_API_KEY') }}<br/></span>
                <span class="notice">
                    <img alt="" src="@/assets/img/warn.png"/>
                    {{ $t('FORECAST_NOTICE')}}
                </span>
            </h3>
            <div class="form">
                <a-form :model="formState" v-bind="layout" name="nest-messages">
                    <a-form-item
                        :name="['weather', 'weatherApiKey']"
                        :label="$t('WEATHER_API_KEY')"
                        :rules="[{ required: true, message: $t('WEATHER_API_KEY_REQUIRED') }, { validateTrigger: 'blur' }]"
                    >
                        <a-input
                            @change="judgeDisabled"
                            v-model:value="formState.weather.weatherApiKey"
                            :placeholder="$t('PLEASE_ENTER_API_KEY')"
                        />
                    </a-form-item>
                    <a-form-item :name="['weather', 'cityData']" :label="$t('CITY_NAME')" :rules="[{ required: true, message: $t('CITY_REQUIRED') }]">
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
                            @change="judgeDisabled"
                        >
                            <a-select-option :key="select.id" :value="select.id" v-for="select in cityData">
                                {{ select.display_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :name="['weather', 'tempUnit']" :label="$t('TEMP_UNIT')" :rules="[{ required: true, message: $t('TEMP_UNIT_REQUIRED') }]">
                        <a-select @change="judgeDisabled" v-model:value="formState.weather.tempUnit" style="width: 350px" :placeholder="$t('PLEASE_ENTER_TEMPERATURE')">
                            <a-select-option :key="select.label" :value="select.value" v-for="select in temperatureData">
                                {{ select.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>
        </section>
        <footer class="footer">
            <a-button :loading="btnLoading" :disabled="disabled" :class="{ 'disabled-btn': disabled }" type="primary" @click="submitHandler">{{ $t('FINISH') }}</a-button>
        </footer>
    </div>
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
import { useEtcStore } from '@/store/etc';
import type { ICityData, IFormState, IRequestForeCastInfo, IRequestConfigInfo, ISubmitData } from '@/api/ts/interface/IWeatherInfo';
const weatherStore = useWeatherStore();
const router = useRouter();
const etcStore = useEtcStore();
const language = computed(() => etcStore.language === 'zh-cn');

onMounted(async () => {
    const res = await api.GetTokenInfo();
    if (res.error === 0 && res.data?.cubeTokenValid) {
        await getSaveDate();
    } else {
        router.push('/token');
    }
});

/** form data */
let formState = reactive<IFormState>({
    weather: {
        weatherApiKey: '',
        cityData: undefined,
        tempUnit: undefined,
    },
});

/** get saved data */
const getSaveDate = async () => {
    const res = await api.GetSaveData();
    if (res.error === 0 && res.data) {
        if (res.data && res.data.cityData) {
            cityData.value = [res.data.cityData];
            formState.weather.weatherApiKey = res.data.weatherApiKey;
            formState.weather.cityData = res.data.cityData.id;
            formState.weather.tempUnit = res.data.tempUnit;
            /** Save the data saved in the backend locally */
            weatherStore.setWeatherInfo(_.cloneDeep(formState));
            judgeDisabled();
        }
    }
};

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const btnLoading = ref(false);

/** Set configuration information  */
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
    btnLoading.value = true;
    const res = await api.setConfigData(params);
    btnLoading.value = false;
    weatherStore.setWeatherInfo(_.cloneDeep(formState));
    if (res.error === 0 && res.data) {
        message.success(i18n.global.t('SAVE_SUCCESS'));
        judgeDisabled();
    }
    /** apiKey error */
    if (res.error > 3000 && res.error < 3005) {
        message.error(`${i18n.global.t(`ERROR.${res.error}`)}`);
    }
};

/** Do not fill button */
const disabled = ref(true);

/** Controls whether the submit button can be clicked */
const judgeDisabled = () => {
    if (!formState.weather.weatherApiKey || !formState.weather.cityData || !formState.weather.tempUnit) {
        disabled.value = true;
        return;
    }
    //different from the old data
    const weatherInfo = JSON.stringify(formState.weather);
    if (JSON.stringify(weatherStore.weatherInfo.weather) !== weatherInfo) {
        disabled.value = false;
        return;
    }
    disabled.value = true;
};

//city data
const cityData = ref<ICityData[]>([]);

/** get city data */
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

/** Search City Stabilization */
const toggleDebounce = _.debounce(getCityList, 800, {
    leading: true,
    trailing: true,
});
</script>

<style scoped lang="scss">
.setting {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 18px;
    margin: 0 auto;
    .title {
        font-size: 20px;
        font-weight: 600;
    }
    .foreCast-setting {
        text-align: center;
    }
    .forecast-describe {
        // width: 600px;
        line-height: 26px;
        margin: 0 auto;
        text-align: left;
        margin-top: 20px;
        margin-bottom: 20px;
        // word-break: break-all;
        word-break: normal;
        font-size: 14px;
        white-space: nowrap;
        .notice{
            display: flex;
            align-items: center;
            img{
                width: 14px;
                height: 14px;
                margin-right: 5px;
            }
            color:#A1A1A1 ;
            font-size: 12px;
        }
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
            height: 32px;
            background: rgba(24, 144, 255, 0.2);
            border-radius: 4px;
            border: none;
            font-size: 16px;
            color: #1890ff;
        }
        .disabled-btn {
            opacity: 0.5;
        }
    }
}
</style>
