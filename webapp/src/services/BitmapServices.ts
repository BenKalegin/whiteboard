import {Curve, Figure, FigureProportions, Point} from "../models/DrawModels";
import {figurePath} from "./SvgServices";
import regression from 'regression'
//import {probabilisticHoughTransform} from "./ProbabilisticHoughTransform";
import * as Mirada from 'mirada'
import {interpolateNearest} from "./InterpolateServices";
import {continuousWaveletTransformUsingTensorFlow} from "./SignalServices";
declare var cv: Mirada.CV

export interface OnLoadable {
    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    onerror: OnErrorEventHandler;
}

export const onload2promise = <T extends OnLoadable>(obj: T): Promise<T> => new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
});

const getSvgBitmap = async (figure: Figure): Promise<ImageData> => {
    const size = figure.bounds!.size
    const offset = figure.bounds!.offset
    const translateStr: string = ` translate(${-offset.x.toFixed(0)}, ${-offset.y.toFixed(0)})`
    const transform = `${translateStr}`
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width="${size.x}" height="${size.y}">
        <g transform="${transform}">
        ${figurePath(figure)}
        </g>
        </svg>`;

    const src = `data:image/svg+xml,${svg/*encodeURIComponent(svg)*/}`
    let image = new Image()
    const promise = onload2promise(image)
    //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
    image.crossOrigin = 'anonymous';
    image.src = src

    await promise
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = size.x
    canvas.height = size.y
    const ctx2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    // TODO should we scale down to restrict memory usage
    ctx2D.drawImage(image, 0, 0)
    return ctx2D.getImageData(0, 0, size.x, size.y);
};

const longestCurve = (figure: Figure) => {
    let longestCurve = figure.curves[0];

    for (const curve of figure.curves) {
        if (curve.pathPoints.length > longestCurve.pathPoints.length )
            longestCurve = curve;
    }

    return longestCurve
}

function debugLineOutput(width: number, height: number, lines: Point[][]) {
    const canvas = document.getElementById('testcanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 500, 500)
    const colors = ["red", "blue", "green", "black"]
    let color = 0;
    for (const line of lines) {
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y)
        ctx.lineTo(line[1].x, line[1].y)
        ctx.strokeStyle = colors[(++color) % colors.length]
        ctx.stroke();
    }
}


function calculateSpeedOverNPoint(curve: Curve, n: number) {
    const speed: number[] = []
    for (let i = n; i < curve.pathPoints.length; i++) {
        const pi = curve.pathPoints[i];
        const pn = curve.pathPoints[i-n];
        const dx = pi.x - pn.x
        const dy = pi.y - pn.y
        const s = Math.sqrt(dx * dx + dy * dy) / (pi.timespan - pn.timespan)
        speed.push(s)
    }
    return speed;
}

/**
 * Search for max value in the array and "inverts" the array in-place, replacing every element x = max(x) - x
 * @param values
 */
const subtractArrayValuesFromMax = (values: number[]) : void => {
    let max = values[0]
    for (const value of values) {
        if (value > max)
            max = value
    }

    for (let i = 0; i < values.length; i++){
        values[i] = max - values[i]
    }
};


/**
 * Separate curve regions based on pen speed
 */
const interpolateSpeed = (curve: Curve): { duration: number; speeds: number[] } => {
    const n = 1;
    const rawSpeed = calculateSpeedOverNPoint(curve, n);
    const rawTimes = curve.pathPoints.map(p => p.timespan).slice(n)

    // interpolate gaps between time points with nearest speed value
    const speed = interpolateNearest(rawTimes, rawSpeed)

    // invert speed(t) to search for peaks
    subtractArrayValuesFromMax(speed.values)
    return { speeds: speed.values, duration: speed.maxTime - speed.minTime }
}

export const calcProportions = async (figure: Figure, suggestion: string): Promise<FigureProportions> => {
    if (suggestion === "arrow") {
        const { speeds, duration } = interpolateSpeed(figure.curves[0]);
        await continuousWaveletTransformUsingTensorFlow(speeds, duration)
        //const curves = figure.curves.flatMap(c => ExtractSubCurves(c))

        //debugLineOutput(imageData.width, imageData.height, lines) //.filter((value, index) => lengths.includes(index)));

        const curve = longestCurve(figure);

        const linearApproximation = regression.linear(curve.pathPoints.map(p => [p.x, p.y]))
        const flipX = curve.pathPoints[0].x > curve.pathPoints[curve.pathPoints.length-1].x

        return { rotateAngle:  linearApproximation.equation[0] * 45, flipX: flipX};
    }

    return {rotateAngle: 0, flipX: false}
}