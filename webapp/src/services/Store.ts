import createSagaMiddleware from "redux-saga";
import {Action, applyMiddleware, compose, createStore, Middleware, StoreEnhancer} from "redux";
import {initialState, rootReducer} from "../reducers/Reducers";
import {rootSaga} from "../sagas/RootSaga";
import {Saga} from "@redux-saga/types";

const sagaMiddle = createSagaMiddleware();

const sagaEnhancer = applyMiddleware(sagaMiddle);

function asyncDispatchMiddleware(): Middleware {
    return store => next => action =>
    {
        let syncActivityFinished = false;
        let actionQueue: Action[] = [];

        function flushQueue() {
            actionQueue.forEach(a => store.dispatch(a)); // flush queue
            actionQueue = [];
        }

        function asyncDispatch(actions: Action[]) {
            actionQueue = actionQueue.concat(actions);

            if (syncActivityFinished) {
                flushQueue();
            }
        }

        const actionWithAsyncDispatch =
            Object.assign({}, action, {asyncDispatch});

        const result = next(actionWithAsyncDispatch);
        syncActivityFinished = true;
        flushQueue();
        return result
    }
}


const asyncDispatchEnhancer = applyMiddleware(asyncDispatchMiddleware());


const enhancers = [sagaEnhancer]

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();
    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension)
    }
}

const composedEnhancers = compose(asyncDispatchEnhancer, ...enhancers)

export const store = createStore(rootReducer, initialState, composedEnhancers as StoreEnhancer);

sagaMiddle.run(rootSaga);

export const runSaga = <S extends Saga>(saga: S, ...args: Parameters<S>) => {
    if (!sagaMiddle) {
        console.warn('sage middleware should be initialized first');
        return;
    }
    return sagaMiddle.run(saga, ...args);
};

