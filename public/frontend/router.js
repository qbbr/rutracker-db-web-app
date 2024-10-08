const { createRouter, createWebHashHistory } = VueRouter;
import Home from './views/Home.js';
import Torrent from './views/Torrent.js';
import About from './views/About.js';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/:id', name: 'Torrent', component: Torrent },
        { path: '/about', name: 'About', component: About },
    ]
});
