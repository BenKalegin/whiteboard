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

export const calcProportions = async (figure: Figure, suggestion: string): Promise<FigureProportions> => {
    if (suggestion === "arrow") {
        await Mirada.loadOpencv({});
        let imageData = await getSvgBitmap(figure)


        const src = cv.matFromImageData(imageData)

        // Convert the image to gray-scale
        const gray = new cv.Mat(src.rows, src.cols, cv.CV_8UC1)
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0)

        // We dont need to search for the edges in the image using canny detector because we overwritten the stroke to 1
        // in every svg curve
        //let edges = new cv.Mat()
        //cv.Canny(gray, edges, 50, 200, 3, false)
        //cv.imshow(document.getElementById('testcanvas')!, edges)

        // Detect points that form a line
        const linesMat = new cv.Mat()
        cv.HoughLinesP(gray, linesMat, 5, Math.PI / 180, 30, 30, 10)

        const lines: Point[][] = []
        for (let i = 0; i < linesMat.rows; ++i) {
            let pt1: Point = { x: linesMat.data32S[i * 4], y: linesMat.data32S[i * 4 + 1]}
            let pt2: Point = { x: linesMat.data32S[i * 4 + 2], y: linesMat.data32S[i * 4 + 3]}
            lines.push([pt1, pt2])
        }
        linesMat.delete();
        src.delete();
        gray.delete()
        //edges.delete();

        const lengths = lines.map((l: Point[], ix: number) => {
                return {
                    i: ix,
                    len: Math.pow(l[1].x - l[0].x, 2) + Math.pow(l[1].y - l[0].y, 2)
                }
            }
        ).sort(x => -x.len).slice(0, 5).map(value => value.i)

        debugLineOutput(imageData.width, imageData.height, lines) //.filter((value, index) => lengths.includes(index)));

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