const { createRouter, createWebHashHistory } = VueRouter;
import Home from './Home.js';
import About from './About.js';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/about', name: 'About', component: About },
    ],
});
