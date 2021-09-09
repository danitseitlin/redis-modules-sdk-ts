/**
 * The config information
 * @param CACHE_SIZE The cache size of the module
 * @param ASYNC_DELETE The async delete of the module
 * @param OMP_THREAD_COUNT The omp thread count of the module
 * @param THREAD_COUNT The thread count of the module
 * @param RESULTSET_SIZE The resultset size of the module
 * @param MAINTAIN_TRANSPOSED_MATRICES The maintain transposed matrices of the module
 * @param VKEY_MAX_ENTITY_COUNT The vkey max entity count of the module
 */
export type GraphConfigInfo = {
    CACHE_SIZE: number,
    ASYNC_DELETE: number,
    OMP_THREAD_COUNT: number,
    THREAD_COUNT: number,
    RESULTSET_SIZE: number,
    MAINTAIN_TRANSPOSED_MATRICES: number,
    VKEY_MAX_ENTITY_COUNT: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}