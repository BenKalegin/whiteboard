import React from 'react';
import {findPicture} from "./FinePictures";

export interface Props {
    prediction: string
    onClick: () => void
}

const SuggestionButton: React.FC<Props> = (props) => {

    const picture = findPicture(props.prediction);
    const onClick = () => {
        //if (typeof picture !== "string")
            props.onClick();
    };
    return (
        <button
            className={"suggest-button pen"}
            id="red"
            aria-label="Content Creation Toolbar - Ink Red Pen"
            aria-selected='false'
            role="tab"
            title={props.prediction}
            onClick={onClick}>
            {picture}
        </button>
    )};


export default SuggestionButton;