import { createDecorator } from 'vue-class-component';

export const isMobile = () => {
  return createDecorator((options, key) => {
    // removed iPad
    ((options.computed ??= {}) as any)[key] = {
      get: () => /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      set: () => {},
    };
  });
};
