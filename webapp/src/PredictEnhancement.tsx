import React from 'react';

export interface Props {
    predictions: string[]
}

const PredictEnhancement: React.FC<Props> = (props) => {

    return (
        <div>
            <h3>Predict</h3>
            <p>Drawn any figure  (mug, apple, cat, mosquito, house) in one mouse stroke and check predicted labels below:</p>
            <ul>
                {props.predictions.slice(0, 5).map((s, i) => {
                    return <li key={i}>{s}</li>;
                })}
            </ul>
        </div>
    )};


export default PredictEnhancement;