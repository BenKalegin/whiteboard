import React from 'react'
import {Figure as FigureModel} from '../models/DrawModels'
import Curve from './Curve'
import {findPicture} from "./FinePictures"
import {figureStyle, figureFineTransform} from "../services/SvgServices"

export interface Props {
    model: FigureModel
}

const Fine: React.FC<Props> = (props) => {
    const m = props.model

    return (
        <g id={m.id} transform={figureFineTransform(m)}>
            <style>{figureStyle(m)}</style>
            {findPicture(m.finePicture.name)}
        </g>
    )
}

const Figure: React.FC<Props> = (props) => {
    const m = props.model
    return (
        <React.Fragment>
        {m.finePicture.name.length === 0 ?
                <g id={m.id}>
                    {m.curves.map((c, i) => <Curve model={c} key={i} />)}
                </g>
            : <Fine model={m}/>
        }
        </React.Fragment>
    )
}

export default Figure