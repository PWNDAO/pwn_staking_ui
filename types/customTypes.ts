export type AnyFunction = (...args: never[]) => unknown;
export type IntervalId = ReturnType<typeof setInterval | typeof setTimeout>;
