import {Curve, Figure} from "../models/DrawModels";

export const curvePath = (curve: Curve) => {
    const pathChar = (i: number)  =>  { return i === 0 ? 'M' : 'L'}
    return curve.pathPoints.map((p, i) => pathChar(i) + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ")
}

export const figurePath = (figure: Figure) => {
    return figure.curves.map(c => `
            <path
            fill = "none"
            stroke = "${c.strokeColor}"
            stroke-width = "${c.strokeWidth}"
            d="${curvePath(c)}"
            />
    `).join("\n")
}

export const figureFineTransform = (figure: Figure) => {
    const translate = figure.finePicture.transform.translate;
    const scale = figure.finePicture.transform.scale;
    const scaleStr: string = scale ? ` scale(${scale.x.toFixed(2)}, ${scale.y.toFixed(2)})` : ""

    const translateStr: string = translate? ` translate(${translate.x.toFixed(0)}, ${translate.y.toFixed(0)})` : ""
    return `${translateStr}${scaleStr}`
}

export const figureStyle = (figure: Figure) => {
    return `
            #${figure.id}  {
                --primary-color: ${figure.finePicture.stroke.color};
                --secondary-color: #11EBD8;
                --tertiary-color: #000;
            }`
}