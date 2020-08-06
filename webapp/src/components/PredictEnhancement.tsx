import React from 'react';
import SuggestionButton from "./SuggestionButton";
import {useDispatch, useSelector} from "react-redux";
import {ApplicationState} from "../reducers/Reducers";
import {ApplicationAction, applicationMsg} from "../actions/Actions";
import {ReactComponent} from "*.svg";

const PredictEnhancement: React.FC = () => {
    const prediction = useSelector((state: ApplicationState) => state.predictions.quickDraw)
    const figures = useSelector((state: ApplicationState) => state.canvas.figures)
    const dispatch = useDispatch()

    const onSuggestionClick = (suggestion: string) => {
        dispatch(applicationMsg(ApplicationAction.SuggestionClicked, {suggestion: suggestion, figureId: figures[figures.length-1].id}))
    }

    return (
        <div className="contextMenu">
            {prediction.topMatches.slice(0, 8).map((s, i) => {
                return <SuggestionButton key={i} prediction={s} onClick={() => onSuggestionClick(s)}/>;
            })}
        </div>
    )};

export default PredictEnhancement;