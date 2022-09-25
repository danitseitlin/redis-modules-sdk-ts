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

/**
 * The optional parameters of the 'TDIGEST.MERGE' command
 * @param numberOfKeys Number of sketch(es) to copy observation values from. If not passed, it will set a default based on sourceKeys parameter.
 * @param compression The compression parameter. 100 is a common value for normal uses. 1000 is extremely large. If no value is passed, the used compression will the maximal value among all inputs.
 * @param override If destination already exists, it is overwritten.
 */
export type TDigestMergeOptions = {
    numberOfKeys?: number,
    compression?: number,
    override?: boolean
}