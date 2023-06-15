<template>
    <div class="get-token">
        <header>
            <span class="title" @click="getTokenInfo">{{ $t('SETTING') }}</span>
        </header>
        <section class="container">
            <h2 class="title">{{ $t('GET_IHOST_TOKEN') }}</h2>
            <h3 class="click-msg">{{ $t('CLICK_GET_TOKEN') }}</h3>
            <h3 class="allow-msg">{{ $t('CONFIRM_GET_TOKEN') }}</h3>
            <div class="card-list" @click="getToken">GetToken</div>
        </section>
        <footer class="next-step">
            <a @click="nextStep">{{ $t('NEXT') }} ></a>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/i18n/index';
import _ from 'lodash';
import api from '@/api/Weather/index';
const router = useRouter();
onMounted(() => {
});

const getTokenInfo = async () => {
    const res = await api.GetTokenInfo();
    console.log('res----->', res);
};
const nextStep = () => {
    router.push('/setting');
};
const getToken = async () =>{
    const res = await api.GetToken();
    console.log('res-------->',res);
}
</script>



<style scoped lang="scss">
.get-token {
    padding: 18px;
    .title {
        font-size: 16px;
        font-weight: 600;
    }
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .card-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 24px;
            margin-top: 40px;
            padding: 0 80px;
            .card {
                padding: 16px;
                width: 226px;
                height: 168px;
                box-shadow: 0px 0px 5px 0px rgba(136, 136, 136, 0.25);
                border-radius: 12px 12px 12px 12px;
                img {
                    margin: 20px 64px;
                }
            }
            .disabled-card {
                filter: grayscale(100%);
                background: #e8e8ec;
                color: #9e9e9e;
                scale: 1 !important;
                pointer-events: none;
            }

            .card:hover {
                scale: 1.02;
                cursor: pointer;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            }
        }
    }
    .next-step {
        display: flex;
        justify-content: flex-end;
        margin-top: 120px;
        padding: 0 64px;
        font-size: 16px;
        font-weight: 600;
        .disabled-btn {
            pointer-events: none;
            -webkit-filter: grayscale(100%);
            -moz-filter: grayscale(100%);
            -ms-filter: grayscale(100%);
            -o-filter: grayscale(100%);
            filter: grayscale(100%);
            user-select: none;
        }
    }
}
</style>
