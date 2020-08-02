import React from 'react'
import {Figure as FigureModel} from '../models/DrawModels'
import Curve from './Curve'

export interface Props {
    model: FigureModel
}
const Figure: React.FC<Props> = (props) => {
    const m = props.model

    return (
        <g
            id={m.id}
            x={m.offset.x}
            y={m.offset.y}
        >
            {m.curves.map((c, i) =>
                <Curve model={c} key={i}/>
            )}
        </g>
    )
}

export default Figure