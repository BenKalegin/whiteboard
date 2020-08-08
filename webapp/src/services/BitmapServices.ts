import {Figure, FigureProportions} from "../models/DrawModels";
import {figurePath, figureStyle, figureFineTransform} from "./SvgServices";

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


export const calcProportions = async (figure: Figure): Promise<FigureProportions> => {
    if (figure.finePicture.name == 'arrow') {
        const {data, height, width} = await getSvgBitmap(figure)
    }

    return {firstMomentAngle: 90}
}