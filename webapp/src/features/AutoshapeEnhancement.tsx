import React from 'react';

export interface Props {
    predictions: string[]
}

const AutoShapeEnhancement: React.FC<Props> = (props) => {

    return (
        <React.Fragment>
            <h3>Auto Shapes</h3>
            <p>Recognize simple shape in your drawing and auto correct it</p>
            <ul>
                {props.predictions.slice(0, 5).map((s, i) => {
                    return <li key={i}>{s}</li>;
                })}
            </ul>
        </React.Fragment>
    )};


export default AutoShapeEnhancement;