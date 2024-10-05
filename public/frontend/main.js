import App from './App.js';
const { createApp } = Vue;
import router from './router.js';
import { bsModalError, magnetUrl } from './helper.js';
import ForumList from './components/forum-list.js';

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

const app = createApp(App);

app.component('forum-list', ForumList);

app.config.globalProperties.$filters = {
    toLocaleString(dateStr) {
        return new Date(dateStr).toLocaleString(navigator.language);
    },
    magnetUrl(hash, title) {
        return magnetUrl(hash, title);
    }
};

app.use(router)
    .use(VueAxios, axios)
    .mount('#app');
