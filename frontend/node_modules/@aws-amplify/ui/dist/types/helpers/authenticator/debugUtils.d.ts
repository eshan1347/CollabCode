import { GetRoute } from './getRoute';
/**
 * @internal Not to be used in production
 * @description Debugging tool for logging `state` and `actorState`
 *
 * @example
 * ```ts
 * const getRouteWithLogs = logRouteChanges(getRoute);
 * ```
 */
export declare const logRouteChanges: (fn: GetRoute) => GetRoute;
