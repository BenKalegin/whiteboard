import React, {createContext, useReducer, Dispatch} from "react";
import {canvasReducer, predictionsReducer} from "./Reducers";
import {Canvas, DefaultCanvas} from "./DrawModels";
import {CanvasActions, PredictionActions} from "./Actions";
import {DefaultPredictions, Predictions} from "./PredictModels";


interface ApplicationState {
    canvas: Canvas
    predictions: Predictions
}

const initialState : ApplicationState = {
    canvas: DefaultCanvas,
    predictions: DefaultPredictions
}

const mainReducer = (
    {predictions, canvas}: ApplicationState, action: PredictionActions | CanvasActions) => ({
        predictions: predictionsReducer(predictions, action as PredictionActions),
        canvas: canvasReducer(canvas, action as CanvasActions)
    })

const AppContext = createContext<{ state: ApplicationState; dispatch: Dispatch<PredictionActions | CanvasActions>;
}>({
    state: initialState,
    dispatch: () => null
});

const AppProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(mainReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppProvider, AppContext };