import React from 'react'
import {Figure as FigureModel} from '../models/DrawModels'
import Curve from './Curve'
import {findPicture} from "./FinePictures";

export interface Props {
    model: FigureModel
}

interface StyleProps {
    stroke: string
    id:string
}
const InlineStyle: React.FC<StyleProps> = (props) => {
    return (<style>{`
            #${props.id}  {
                --primary-color: ${props.stroke};
                --secondary-color: #11EBD8;
                --tertiary-color: #000;
            }
        `}
    </style>)
}
const Fine: React.FC<Props> = (props) => {
    const m = props.model
    const translate = m.finePicture.transform.translate;
    const scale = m.finePicture.transform.scale;
    const scaleStr: string = scale ? ` scale(${scale.x}, ${scale.y})` : ""

    const translateStr: string = translate? ` translate(${translate.x}, ${translate.y})` : ""
    const transform: string = `${translateStr}${scaleStr}`

    return (
        <g id={m.id} transform={transform}>
            <InlineStyle stroke={m.finePicture.stroke.color} id={m.id}/>
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