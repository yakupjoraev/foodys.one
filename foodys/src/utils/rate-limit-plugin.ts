import { type ZodiosPlugin } from "@zodios/core";
import pThrottle from "p-throttle";

export interface RateLimitPlugin {
  limit: number;
  interval: number;
}

export function pluginRateLimit(opts: RateLimitPlugin) {
  const throttle = pThrottle({ limit: opts.limit, interval: opts.interval });

  const returnValueThrottled = throttle(returnValue);

  const plugin: ZodiosPlugin = {
    request: (_, config) => {
      return returnValueThrottled(config);
    },
  };

  return plugin;
}

function returnValue<T>(value: T) {
  return Promise.resolve(value);
}
