import VueRouter from 'vue-router';

export default (router: VueRouter): void => {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = router.app.$store.getters['userSettings/isAuthenticated'];

    // If the user is authenticated to AniList, but the target page
    // requires the user to be unauthorized, we want to prevent the user
    // from going there.
    if (to.meta.requireUnauthorizedState && isAuthenticated) {
      if (from.meta.requireUnauthorizedState) {
        next({ name: 'Home' });
      } else {
        next(false);
      }
      return;
    }

    // If the user is not authenticated and we're trying to navigate to a page
    // that requires the user to be authenticated, we want to prevent this action.
    if (!isAuthenticated && !to.meta.allowUnauthorizedState) {
      next(false);
      return;
    }

    next();
  });
};
