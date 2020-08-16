import React from 'react';
import SuggestionButton from "./SuggestionButton";
import {useDispatch, useSelector} from "react-redux";
import {ApplicationState} from "../reducers/Reducers";
import {ApplicationAction, applicationMsg} from "../actions/Actions";

const PredictEnhancement: React.FC = () => {
    const suggestions = useSelector((state: ApplicationState) => state.predictions)
    const figures = useSelector((state: ApplicationState) => state.canvas.figures)
    const dispatch = useDispatch()

    const onSuggestionClick = (draw: string, text: string) => {
        dispatch(applicationMsg(ApplicationAction.SuggestionClicked, {drawSuggestion: draw, textSuggestion: text, figureId: figures[figures.length-1].id}))
    }

    return (
        <div className="contextMenu">
            {suggestions.quickDraw.topMatches.slice(0, 8).map((s, i) => {
                return <SuggestionButton key={i} prediction={s} onClick={() => onSuggestionClick(s, "")}/>;
            })}
            {suggestions.character.topMatches.slice(0, 3).map((s, i) => {
                return <SuggestionButton key={i} prediction={s} onClick={() => onSuggestionClick("", s)}/>;
            })}
        </div>
    )};

export default PredictEnhancement;