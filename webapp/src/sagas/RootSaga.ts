import { takeEvery } from 'redux-saga/effects';
import {ApplicationAction} from "../actions/Actions";
import {startApplicationSaga} from "./StartAppSaga";

export function* rootSaga() {
    yield takeEvery(ApplicationAction.StartApplication, startApplicationSaga)
}