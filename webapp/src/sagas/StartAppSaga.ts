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
import {fetchCharacterSuggestions, fetchQuickDrawSuggestions} from "../api/InputTools";
import {ApplicationState} from "../reducers/Reducers";
import {calcProportions} from "../services/BitmapServices";

const figureById = (state: ApplicationState, figureId: string) => state.canvas.figures.find(value => value.id === figureId)!

function* curveCompleted(action: ApplicationActions) {
    if (action.type === ApplicationAction.CurveCompleted) {
        const {figureId} = action.payload
        const figure: ReturnType<typeof figureById> = yield select(figureById, figureId)

        const quickDrawResponse = yield fetchQuickDrawSuggestions(1000, 1000, figure).then(r => r.json())
        const quickDrawPredictions = quickDrawResponse[1][0][1]
        const characterResponse = yield fetchCharacterSuggestions(1000, 1000, figure).then(r => r.json())
        const characterPredictions = characterResponse[1][0][1]

        yield put(predictionMsg(PredictionAction.QuickDrawPredictionReceived, {
            picturePredictions: quickDrawPredictions,
            letterPredictions: characterPredictions,
            figureId: figureId}))
    }
}

function* suggestionClicked(action: ApplicationActions) {
    if (action.type === ApplicationAction.SuggestionClicked) {
        const {drawSuggestion, textSuggestion, figureId} = action.payload
        const figure: ReturnType<typeof figureById> = yield select(figureById, figureId)
        if (drawSuggestion.length > 0 || textSuggestion.length > 0 ) {
            const proportions = yield calcProportions(figure, drawSuggestion)
            yield put(canvasMsg(CanvasAction.ReplaceFigure, {
                figureId: figureId,
                finePictureName: drawSuggestion,
                text: textSuggestion,
                proportions: proportions
            }))
        }
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

