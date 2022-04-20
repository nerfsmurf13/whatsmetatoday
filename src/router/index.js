import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/Login';
import NewBuild from '@/pages/NewBuild';
import Home from '@/pages/Home';
import Container from '@/pages/Container';
import Ticket from '@/pages/Ticket';
import Device from '@/pages/Device';
import Register from '@/pages/Register';
import RegisterPass from '@/pages/RegisterPass';
import BuildSubmit from '@/pages/BuildSubmit';
import firebase from 'firebase';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: true,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/newbuild',
      name: 'newbuild',
      component: NewBuild,
      meta: {
        requiresAuth: true,
      },
    },
    // {
    //   path: '/mytickets',
    //   name: 'mytickets',
    //   component: MyTickets,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/ticket/:id',
    //   name: 'Ticket',
    //   component: Ticket,
    //   props: true,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/device/:id',
    //   name: 'Device',
    //   component: Device,
    //   props: true,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    {
      path: '/buildsubmit/:id',
      name: 'BuildSubmit',
      component: BuildSubmit,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    // {
    //   path: '/inventory',
    //   name: 'inventory',
    //   component: AllInventory,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/devices',
    //   name: 'Devices',
    //   component: Devices,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/adddevices',
    //   name: 'addDevices',
    //   component: AddDevices,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/students',
    //   name: 'students',
    //   component: Students,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/addstudents',
    //   name: 'addstudents',
    //   component: AddStudents,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/addcontainer',
    //   name: 'addcontainer',
    //   component: AddContainer,
    //   props: true,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/containers',
    //   name: 'containers',
    //   component: AllContainers,
    //   props: true,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/container/:id',
    //   name: 'container',
    //   component: Container,
    //   props: true,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/rooms',
    //   name: 'rooms',
    //   component: Rooms,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/addroom',
    //   name: 'addroom',
    //   component: AddRoom,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: '/registerpass',
      name: 'registerpass',
      component: RegisterPass,
      meta: {
        requiresGuest: true,
      },
    },
  ],
});
//Navigation Guards
router.beforeEach((to, from, next) => {
  //Check Auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //Check if not logged in
    if (!firebase.auth().currentUser) {
      //Go to Login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      //procedd to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //Check if logged in
    if (firebase.auth().currentUser) {
      //Go to Collection Page
      next({
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      //procedd to route
      next();
    }
  } else {
    next();
  }
});

export default router;
