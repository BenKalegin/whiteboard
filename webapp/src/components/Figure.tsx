import React from 'react'
import {Figure as FigureModel} from '../models/DrawModels'
import Curve from './Curve'
import {findPicture} from "./FinePictures";

export interface Props {
    model: FigureModel
}

const Figure: React.FC<Props> = (props) => {
    const m = props.model

    const translate = m.finePicture.transform.translate;
    const scale = m.finePicture.transform.scale;

    const translateStr = translate ? ` translate(${translate.x}, ${translate.y})` : ""
    const scaleStr = scale ? ` scale(${scale.x}, ${scale.y})` : ""
    const transform = `${translateStr}${scaleStr}`
    return (
        <g id={m.id} transform={transform} stroke={m.finePicture.stroke.color}>
            {m.finePicture.name.length > 0 ?
                findPicture(m.finePicture.name) :
                m.curves.map((c, i) => <Curve model={c} key={i} />
            )}
        </g>
    )
}

export default Figure