/**
 * @param { Promise } promise
 * @param { Object= } errorConfig - Additional Information you can pass to the err object
 * @return { Promise }
 */
type ErrorConfig = { additionalErrorInfo?: Record<string, unknown>, enableLogging?: boolean }

export function to<T, U extends Error = Error> (
    promise: Promise<T>,
    { additionalErrorInfo = {}, enableLogging = true }: ErrorConfig = { additionalErrorInfo: {}, enableLogging: true },
): Promise<[U, undefined] | [null, T]> {
    return promise
        // TODO instead of `null` return `undefined`?
        .then<[null, T]>((data: T) => [null, data])
        .catch<[U, undefined]>((err: U) => {
            // TODO is this AbortError correct?
            if (enableLogging && err.name !== 'AbortError') {
                // Sentry.captureException(err, { contexts: { additionalErrorInfo } })
            }
            return [err, undefined]
        })
}
export default to
