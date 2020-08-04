import { takeEvery} from 'redux-saga/effects';
import {ApplicationAction} from "../actions/Actions";
import {startApplicationSaga} from "./StartAppSaga";

export function* rootSaga() {
    yield takeEvery(ApplicationAction.StartApplication, startApplicationSaga)
}


/*
// Event iterator
function events(target, event) {
    let fns = [], handler = e => {
        fns.forEach(fn => fn(null, e));
        fns = [];
    };
    target.addEventListener(event, handler);

    return {
        next(fn) {
            fns.push(fn);
        },
        dispose(){
            target.removeEventListener(event, handler);
            fns = handler = null;
        }
    }
}

function * draw(){
    while(true){
        // wait until mousedown event
        let e = yield take('mousedown');
        e.payload.preventDefault();
        e.payload.stopPropagation();


        // start listening to mousemove and mouseup events
        let up$ = events(window, 'mouseup');
        let move$ = events(window, 'mousemove');


        while(true){
            let {move} = yield race({
                up: cps(up$.next),
                move: cps(move$.next)
            });

            if(move){
                move.preventDefault();
                move.stopPropagation();
                let {pageX, pageY} = move;
                yield setState({pageX, pageY});
            }
            else break;
        }

        // cleanup
        up$.dispose();
        move$.dispose();
    }

}*/
