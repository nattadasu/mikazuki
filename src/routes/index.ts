import Vue from 'vue';
import Router from 'vue-router';
import beforeEachInterceptor from './beforeEachInterceptor';
import AniList from './AniList';
import Search from '@/components/Search/Search.vue';
import Settings from '@/components/Settings/Settings.vue';
import FirstPage from '@/components/FirstPage/FirstPage.vue';

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
        allowUnauthorizedState: true,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        routeName: 'settings',
        allowUnauthorizedState: true,
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

beforeEachInterceptor(router);

export default router;
