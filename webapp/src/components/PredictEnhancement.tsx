import React from 'react';

export interface Props {
    predictions: string[]
}

const PredictEnhancement: React.FC<Props> = (props) => {

    return (
        <React.Fragment>
            <h3>Recognize the drawing</h3>
            <p>Draw any figure (mug, apple, cat, mosquito, house) using one ink pen color:</p>
            <ul>
                {props.predictions.slice(0, 5).map((s, i) => {
                    return <li key={i}>{s}</li>;
                })}
            </ul>
        </React.Fragment>
    )};


export default PredictEnhancement;