/**
 * A utility type that "unwraps" the inner type of an array, so that:
 * ```
 * ArrayElementType<Array<string>> == string
 * ```
 */
export type ArrayElementType<T> = T extends Array<infer U> ? U : T
