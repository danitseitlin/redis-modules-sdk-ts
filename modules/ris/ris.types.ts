/**
 * The Interval Set object
 * @param name The name of the interval set
 * @param minimum The minimum score of the interval set
 * @param maximum The maximum score of the interval set
 */
export type RedisIntervalSet = {
    name?: string,
    minimum: number,
    maximum: number
}