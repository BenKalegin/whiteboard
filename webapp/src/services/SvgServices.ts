import {Curve, Figure} from "../models/DrawModels";

export const curvePath = (curve: Curve) => {
    const pathChar = (i: number)  =>  { return i === 0 ? 'M' : 'L'}
    return curve.pathPoints.map((p, i) => pathChar(i) + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ")
}

/**
 * Create svg for the figure, ignoring user's color and thickness
 * @param figure
 */
export const figurePath = (figure: Figure) => {
    return figure.curves.map(c => `
            <path
            fill = "none"
            stroke = "white"
            stroke-width = "1"
            d="${curvePath(c)}"
            />
    `).join("\n")
}

export const figureTransform = (figure: Figure) => {
    const embedding = figure.embedding!;
    const {translate, scale, rotate} = embedding.transform
    const scaleStr: string = scale ? ` scale(${scale.x.toFixed(2)}, ${scale.y.toFixed(2)})` : ""
    const translateStr: string = translate? ` translate(${translate.x.toFixed(0)}, ${translate.y.toFixed(0)})` : ""
    const rotateStr: string = rotate? ` rotate(${rotate.degrees.toFixed(3)} ${rotate.aboutPoint.x.toFixed(0)}, ${rotate.aboutPoint.y.toFixed(0)})` : ""
    return `${rotateStr}${translateStr}${scaleStr}`
}

export const finePictureStyle = (figure: Figure) => {
    return `
            #${figure.id}  {
                --primary-color: ${figure.embedding!.stroke.color};
                --secondary-color: #11EBD8;
                --tertiary-color: #000;
            }`
}

export const TextStyle = (figure: Figure) => {
    return `
            #${figure.id} text  {
                fill: ${figure.embedding!.stroke.color}
            }`
}