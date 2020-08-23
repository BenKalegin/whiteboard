import {Figure, FigureProportions, Point} from "../models/DrawModels";
import {figurePath} from "./SvgServices";
import regression from 'regression'
//import {probabilisticHoughTransform} from "./ProbabilisticHoughTransform";
//import {HoughLinesP, Canny, cvtColor, Mat, matFromImageData, COLOR_RGBA2GRAY, loadOpencv} from 'mirada'
import * as Mirada from 'mirada'
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
    const ctx2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx2D.fillStyle = "yellow"
    ctx2D.fillRect(0, 0, width, height)
    ctx2D.strokeStyle = "black"
    for (const line of lines) {
        ctx2D.moveTo(line[0].x, line[0].y)
        ctx2D.lineTo(line[1].x, line[1].y)
        ctx2D.stroke();
    }
}

export const calcProportions = async (figure: Figure, suggestion: string): Promise<FigureProportions> => {
    if (suggestion === "arrow") {
        await Mirada.loadOpencv({});
        let imageData = await getSvgBitmap(figure)


        const src = cv.matFromImageData(imageData)

        // Convert the image to gray-scale
        const gray = new cv.Mat(src.rows, src.cols, cv.CV_8UC1)
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0)
        src.delete();
        //cv.imshow(document.getElementById('testcanvas')!, gray)


        // Find the edges in the image using canny detector
        let edges = new cv.Mat()
        cv.Canny(gray, edges, 50, 200, 3, false)
        cv.imshow(document.getElementById('testcanvas')!, edges)

        // Detect points that form a line
        const linesMat = new cv.Mat()
        cv.HoughLinesP(edges, linesMat, 1, Math.PI / 180, 10, 10, 1)
        //cv.HoughLines(edges, linesMat, 1, Math.PI / 180, 10, 10, 1)

        const lines: Point[][] = []
        for (let i = 0; i < linesMat.rows; ++i) {
            let pt1: Point = { x: linesMat.data32S[i * 4], y: linesMat.data32S[i * 4 + 1]}
            let pt2: Point = { x: linesMat.data32S[i * 4 + 2], y: linesMat.data32S[i * 4 + 3]}
            lines.push([pt1, pt2])
        }
        linesMat.delete();
        edges.delete();

        debugLineOutput(imageData.width, imageData.height, lines);

        // data is in form red=data[0], green = data[1], blue = data[2], alpha = data[3]
        // convert it to white/black
/*
        const blackAndWhite: number[] = new Array<number>(height * width)
        for(let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const offset = (y * width + x) * 4; //rgba
                //const luminance = .2126 * data[offset] + .7152 * data[offset+1] + .0722 * data[offset+2]
                const lum = data[offset] + data[offset + 1] + data[offset + 2];
                if (lum > 0)
                    console.log("lum " + x + ":" + y + " = " + lum)
                blackAndWhite[y * width + x] = lum > 0 ? 1: 0;
            }
        }

        const lines = probabilisticHoughTransform(blackAndWhite, width, height, 1, Math.PI / 180, 10, 10, 3, 10);
        for (const line of lines) {
            console.log(`${line[0].x}:${line[0].y}->${line[1].x}:${line[1].y}`)
        }
*/


        const curve = longestCurve(figure);

        const linearApproximation = regression.linear(curve.pathPoints.map(p => [p.x, p.y]))
        const flipX = curve.pathPoints[0].x > curve.pathPoints[curve.pathPoints.length-1].x

        return { rotateAngle:  linearApproximation.equation[0] * 45, flipX: flipX};
    }

    return {rotateAngle: 0, flipX: false}
}