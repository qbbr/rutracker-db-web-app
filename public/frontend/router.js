const { createRouter, createWebHashHistory } = VueRouter;
import Home from './Home.js';
import Torrent from './Torrent.js';
import About from './About.js';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/:id', name: 'Torrent', component: Torrent },
        { path: '/about', name: 'About', component: About },
    ]
});
