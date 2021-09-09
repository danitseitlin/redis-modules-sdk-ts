/**
 * The parameters of the 'TDIGEST.ADD' command
 * @param value The value to add
 * @param weight The weight of this point
 */
export type TDigestAddParameters = {
    value: number,
    weight: number
}

/**
 * The response of the 'TDIGEST.INFO' command
 * @param compression The compression
 * @param capacity The capacity
 * @param 'Merged nodes' The merged nodes
 * @param 'Unmerged nodes' The unmerged nodes
 * @param 'Merged weight' The merged weight
 * @param 'Unmerged weight' The unmerged weight
 * @param 'Total compressions' The total compressions
 */
export type TDigestInfo = {
    Compression: number,
    Capacity: number,
    'Merged nodes': number,
    'Unmerged nodes': number,
    'Merged weight': string,
    'Unmerged weight': string,
    'Total compressions': number
}