import React from 'react';
import {Curve as CurveModel} from '../models/DrawModels'

export interface Props {
    model: CurveModel
}
const Curve: React.FC<Props> = (props) => {
    const m = props.model
    const pathChar = (i: number)  =>  { return i === 0 ? 'M' : 'L'}
    const path = m.pathPoints.map((p, i) => pathChar(i) + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ")
    return (
        <path
            id={m.id}
            xmlns = 'http://www.w3.org/2000/svg'
            fill = "none"
            stroke = {m.strokeColor}
            strokeWidth = {m.strokeWidth}
            d= {path}
        >
        </path>
    )
}

export default Curve