import React from 'react';
import {Curve as CurveModel} from '../models/DrawModels'
import {curvePath} from "../services/SvgServices";

export interface Props {
    model: CurveModel
}
const Curve: React.FC<Props> = (props) => {
    const m = props.model
    return (
        <path
            id={m.id}
            fill = "none"
            stroke = {m.strokeColor}
            strokeOpacity={m.toBeDeleted ? "25%" : undefined}
            strokeWidth = {m.strokeWidth}
            d={curvePath(m)}
        >
        </path>
    )
}

export default Curve