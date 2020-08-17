import React from 'react'
import {EmbeddingType, Figure as FigureModel, FinePictureEmbedding, TextEmbedding} from '../models/DrawModels'
import Curve from './Curve'
import {findPicture} from "./FinePictures"
import {finePictureStyle, figureTransform, TextStyle} from "../services/SvgServices"

export interface Props {
    model: FigureModel
}

const Fine: React.FC<Props> = (props) => {
    const m = props.model

    return (
        <g id={m.id} transform={figureTransform(m)} strokeOpacity={m.toBeDeleted ? "25%" : undefined}>
            <style>{finePictureStyle(m)}</style>
            {findPicture((m.embedding as FinePictureEmbedding)!.name)}
        </g>
    )
}

const Text: React.FC<Props> = (props) => {
    const m = props.model

    return (
        <g id={m.id} transform={figureTransform(m)} strokeOpacity={m.toBeDeleted ? "25%" : undefined}>
            <style>{TextStyle(m)}</style>
            <text pointerEvents="none">{(m.embedding as TextEmbedding).text}</text>
        </g>
    )
}

const Figure: React.FC<Props> = (props) => {
    const m = props.model
    return (
        <React.Fragment>
        {m.embedding && m.embedding.type === EmbeddingType.FinePicture ? <Fine model={m}/>
            : m.embedding && m.embedding.type === EmbeddingType.Text ? <Text model={m}/>
            :
            <g id={m.id} >
                {m.curves.map((c, i) => <Curve model={c} key={i}/>)}
            </g>
        }
        </React.Fragment>
    )
}

export default Figure