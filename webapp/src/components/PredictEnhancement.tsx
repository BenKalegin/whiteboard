import React from 'react';
import SuggestionButton from "./SuggestionButton";
import {useDispatch, useSelector} from "react-redux";
import {ApplicationState} from "../reducers/Reducers";
import {ApplicationAction, applicationMsg} from "../actions/Actions";

const PredictEnhancement: React.FC = () => {
    const prediction = useSelector((state: ApplicationState) => state.predictions.quickDraw)
    const figures = useSelector((state: ApplicationState) => state.canvas.figures)
    const dispatch = useDispatch()

    const onSuggestionClick = (suggestion: string) => {
        dispatch(applicationMsg(ApplicationAction.SuggestionClicked, {suggestion: suggestion, figureId: figures[figures.length-1].id}))
    }

    return (
        <React.Fragment>
            <h3>Recognize the drawing</h3>
            <p>Draw any figure (mug, apple, cat, mosquito, house) using one ink pen color:</p>
            <div id="chrome">
                <div className="chromeContainer" role="tablist">
                    {prediction.topMatches.slice(0, 8).map((s, i) => {
                        return <SuggestionButton key={i} prediction={s} onClick={() => onSuggestionClick(s)}/>;
                    })}
                </div>
            </div>

        </React.Fragment>
    )};

export default PredictEnhancement;