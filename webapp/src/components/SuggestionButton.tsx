import React from 'react';
import {findPicture} from "./FinePictures";

export interface Props {
    prediction: string
    onClick: () => void
}

const SuggestionButton: React.FC<Props> = (props) => {

    return (
        <button
            className={"chrome-Button pen"}
            id="red"
            aria-label="Content Creation Toolbar - Ink Red Pen"
            aria-selected='false'
            role="tab"
            title={props.prediction}
            onClick={props.onClick}>
            {findPicture(props.prediction)}
        </button>
    )};


export default SuggestionButton;