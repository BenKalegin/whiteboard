import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './features/App';
import { Action, Middleware, applyMiddleware, compose, createStore, StoreEnhancer } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import {rootReducer, initialState} from "./stores/Reducers";


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

//sagaMiddle.run(rootSaga);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <svg className="svgDefs" xmlns="http://www.w3.org/2000/svg" visibility="hidden">
                <defs>
                    <linearGradient id="pen-linear-gradient" x1="36.1146" y1="1057.5" x2="60.0056" y2="1057.5" gradientTransform="translate(0 -980)" gradientUnits="userSpaceOnUse">
                        <stop offset="0.2" stopColor="#fff" stopOpacity="0"/>
                        <stop offset="0.2048" stopColor="#fff" stopOpacity="0.00948"/>
                        <stop offset="0.2972" stopColor="#fff" stopOpacity="0.1775"/>
                        <stop offset="0.3805" stopColor="#fff" stopOpacity="0.2992"/>
                        <stop offset="0.4509" stopColor="#fff" stopOpacity="0.3734"/>
                        <stop offset="0.5" stopColor="#fff" stopOpacity="0.4"/>
                        <stop offset="0.5576" stopColor="#fff" stopOpacity="0.3835"/>
                        <stop offset="0.6177" stopColor="#fff" stopOpacity="0.3344"/>
                        <stop offset="0.679" stopColor="#fff" stopOpacity="0.2526"/>
                        <stop offset="0.7406" stopColor="#fff" stopOpacity="0.1388"/>
                        <stop offset="0.8" stopColor="#fff" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="pen-linear-gradient-2" x1="39.75" y1="1017" x2="56.5602" y2="1017" gradientTransform="translate(0 -980)" gradientUnits="userSpaceOnUse">
                        <stop offset="0.16" stopColor="#fff" stopOpacity="0"/>
                        <stop offset="0.2179" stopColor="#fff" stopOpacity="0.2236"/>
                        <stop offset="0.2949" stopColor="#fff" stopOpacity="0.4965"/>
                        <stop offset="0.3645" stopColor="#fff" stopOpacity="0.7131"/>
                        <stop offset="0.424" stopColor="#fff" stopOpacity="0.8691"/>
                        <stop offset="0.4711" stopColor="#fff" stopOpacity="0.9648"/>
                        <stop offset="0.5" stopColor="#fff"/>
                        <stop offset="0.5289" stopColor="#fff" stopOpacity="0.9648"/>
                        <stop offset="0.576" stopColor="#fff" stopOpacity="0.8691"/>
                        <stop offset="0.6355" stopColor="#fff" stopOpacity="0.7131"/>
                        <stop offset="0.7051" stopColor="#fff" stopOpacity="0.4965"/>
                        <stop offset="0.7821" stopColor="#fff" stopOpacity="0.2236"/>
                        <stop offset="0.84" stopColor="#fff" stopOpacity="0"/>
                    </linearGradient>
                </defs>
            </svg>

            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement)
