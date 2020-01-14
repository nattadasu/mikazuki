import Vue from 'vue';
import Router from 'vue-router';
import AniList from '@/routes/AniList';
import Search from '@/views/Search.vue';
import Settings from '@/views/Settings.vue';

Vue.use(Router);

const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (from.name === 'DetailView') {
      return {
        selector: from.params.id,
      };
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    ...AniList,
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
      redirect: '/aniList',
    },
  ],
});

export default router;
