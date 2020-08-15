import { put, takeEvery, select } from 'redux-saga/effects';
import {
    ApplicationAction,
    ApplicationActions,
    CanvasAction,
    canvasMsg,
    PredictionAction,
    predictionMsg
} from "../actions/Actions";
import {CanvasToolbarSelection} from "../models/DrawModels";
import {fetchQuickDrawSuggestions} from "../api/InputTools";
import {ApplicationState} from "../reducers/Reducers";
import {calcProportions} from "../services/BitmapServices";

const figureById = (state: ApplicationState, figureId: string) => state.canvas.figures.find(value => value.id === figureId)!

function* curveCompleted(action: ApplicationActions) {
    if (action.type === ApplicationAction.CurveCompleted) {
        const {figureId} = action.payload
        const figure: ReturnType<typeof figureById> = yield select(figureById, figureId)

        const response = yield fetchQuickDrawSuggestions(1000, 1000, figure).then(r => r.json())
        const predictions = response[1][0][1]
        yield put(predictionMsg(PredictionAction.QuickDrawPredictionReceived, { predictions: predictions, figureId: figureId}))
    }
}

function* suggestionClicked(action: ApplicationActions) {
    if (action.type === ApplicationAction.SuggestionClicked) {
        const {suggestion, figureId} = action.payload
        const figure: ReturnType<typeof figureById> = yield select(figureById, figureId)
        const proportions = yield calcProportions(figure, suggestion)
        yield put(canvasMsg(CanvasAction.ReplaceFigure, {figureId: figureId, finePictureName: suggestion, proportions: proportions}))
    }
}


export function* startApplicationSaga() {
    // Set tool to black ink on startup. Later we can load last tool from config
    yield put( canvasMsg(CanvasAction.ToolSelected, { tool: CanvasToolbarSelection.Black}))

    // yield put() show demo

    // run watchers in parallel
    yield takeEvery(ApplicationAction.CurveCompleted, curveCompleted);
    yield takeEvery(ApplicationAction.SuggestionClicked, suggestionClicked);
}

