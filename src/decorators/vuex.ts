import { createDecorator } from 'vue-class-component';
import { mapGetters, mapState } from 'vuex';

/**
 * Performs mapGetters on the given property name and, if set, namespace
 * @param namespace Applies the given namespace to the mapGetter
 */
export const Getter = (namespace?: string) => mapper(mapGetters, namespace);

/**
 * Performs mapState on the given property name and, if set, namespace
 * @param namespace Applies the given namespace to the mapState
 */
export const State = (namespace?: string) => mapper(mapState, namespace);

function mapper(mapFn: typeof mapState | typeof mapGetters, namespace?: string) {
  return createDecorator((options, key) => {
    let map;
    if (namespace) {
      map = mapFn(namespace, [key]);
    } else {
      map = mapFn([key]);
    }

    options.computed = {
      ...(options.computed ?? {}),
      ...map,
    };
  });
}
