import { message } from "ant-design-vue";
import i18n from "@/i18n/index";
import errorI18n from '@/i18n/en-us';

function ErrorCodeHandle(error: number) {
    //如果不存在错误码的翻译，不弹出错误消息
    if (!errorI18n.ERROR.hasOwnProperty(error)) {
        return;
    }
    message.error(i18n.global.t(`ERROR.${error}`));
}

export default ErrorCodeHandle;
