import {AllActions, CanvasActions, HasInducedActions, PredictionAction, PredictionActions} from "../actions/Actions";
import {Canvas, initialCanvas} from "../models/DrawModels";
import {DefaultPredictions, Predictions} from "../models/PredictModels";
import {Action, Reducer} from "redux";
import {canvasReducer} from "./CanvasReducers";


export const predictionsReducer = (state: Predictions, action: PredictionActions) : Predictions => {
    switch (action.type) {
        case PredictionAction.QuickDrawPredictionReceived:
            return {
                ...state,
                quickDraw:  {
                    topMatches: action.payload.picturePredictions,
                    figureId: action.payload.figureId
                },
                character: {
                    topMatches: action.payload.letterPredictions,
                    figureId: action.payload.figureId

                }
            }
        default:
            return state;
    }
}

export interface ApplicationState {
    canvas: Canvas
    predictions: Predictions
}

export const initialState : ApplicationState = {
    canvas: initialCanvas,
    predictions: DefaultPredictions
}

export const rootReducer : Reducer<ApplicationState, AllActions> = (state = initialState, action) => {
    let events: Action[] = [];
    const newVar = {
        predictions: predictionsReducer(state.predictions, action as PredictionActions),
        canvas: canvasReducer(state.canvas, action as CanvasActions, events)
    } as ApplicationState;

    const asyncDispatch = (action as any as HasInducedActions).asyncDispatch;
    if (asyncDispatch)
        asyncDispatch(events);

    return newVar
}



