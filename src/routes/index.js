import Contact from '~/pages/Contact';
import Home from '~/pages/Home';

const publicRoutes = [];

//private routes
const privateRoutes = [
    { path: '/', component: Home },
    { path: '/contact', component: Contact },
];

export { publicRoutes, privateRoutes };
