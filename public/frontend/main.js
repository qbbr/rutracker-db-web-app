import App from './App.js';
const { createApp } = Vue;
import router from './router.js';
import { bsModalError } from './helper.js';

axios.defaults.baseURL = '/api';
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const data = error.response.data;
    const title = data.code + ': ' + data.type;
    let message = data.message;

    if (data.trace) {
        message += `\n\n${data.file}:${data.line}`;
    }

    bsModalError(
        title,
        message,
    );

    return Promise.reject(error);
});

const emitter = mitt();
const app = createApp(App);

app.config.globalProperties.$emitter = emitter;

app.config.globalProperties.$filters = {
    toLocaleString(dateStr) {
        return new Date(dateStr).toLocaleString(navigator.language);
    },
    magnetUrl(hash, title) {
        return 'magnet:?xt=urn:btih:' + hash + '&tr=http://bt.t-ru.org/ann?magnet' + '&dn=' + title;
    }
};


app.use(router)
    .use(VueAxios, axios)
    .mount('#app');
