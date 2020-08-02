import { put } from 'redux-saga/effects';
import {CanvasAction, canvasMsg} from "../actions/Actions";
import {CanvasToolbarSelection} from "../models/DrawModels";

export function* startApplicationSaga() {
    // Set tool to black ink on startup. Later we can load last tool from config
    yield put( canvasMsg(CanvasAction.ToolSelected, { tool: CanvasToolbarSelection.Black}))

    // yield put() show demo
}



