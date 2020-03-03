import Vue from 'vue';
import Router from 'vue-router';
import AniList from '@/routes/AniList';
import Search from '@/views/Search.vue';
import Settings from '@/views/Settings.vue';
import FirstPage from '@/views/FirstPage.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    ...AniList,
    {
      path: '/',
      name: 'FirstPage',
      component: FirstPage,
      meta: {
        routeName: 'firstPage',
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        routeName: 'settings',
      },
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        searchablePage: true,
        routeName: 'search',
      },
      children: [
        {
          path: ':query',
        },
      ],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

export default router;
