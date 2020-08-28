/**
 * Taking value over time arrays, return new array with filled gaps so linear method can be applied further.
 */

export const interpolateNearest = (times: number[], values: number[]): { values: number[], minTime:number, maxTime: number} => {
    const minTime = times[0]
    const maxTime = times[times.length-1]

    if (times.length != values.length)
        throw "uneven arrays"

    if (maxTime < minTime)
        throw "wrong order"

    if (maxTime - minTime > 10000)
        // todo think about long curves, should we scale down time to save memory?
        throw "too long period"

    const result: number[] = new Array(maxTime - minTime + 1)

    for (let i = 0; i < times.length; i++) {
        result[times[i] - minTime] = values[i]
    }

    let nearestBefore = 0;
    let nearestAfter = 0;

    for (let i = 0; i < result.length; i++) {
        if (result[i] == undefined) {
            if ((i-nearestBefore) <= (nearestAfter - i))
                result[i] = result[nearestBefore]
            else
                result[i] = result[nearestAfter]
        }else{
            nearestBefore = i;
            if (nearestAfter <= i) {
                nearestAfter = 0
                for(let j = i+1; j < result.length; j++)
                    if (result[j] != undefined) {
                        nearestAfter = j;
                        break;
                    }

            }
        }
    }

    return {
        values: result,
        minTime: minTime,
        maxTime: maxTime
    }
};