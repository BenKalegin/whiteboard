import {CanvasAction, CanvasActions, PredictionAction, PredictionActions} from "./Actions";
import {Canvas, Curve, DefaultCanvas, Figure, Point, TemporalPoint} from "./DrawModels";
import {CanvasToolbarSelection} from "../features/CanvasToolbar";
import {DefaultPredictions, Predictions} from "./PredictModels";
import {InkDrawSmoothReducer} from "./InkDrawSmoothReducer";
import {Reducer} from "redux";


export const predictionsReducer = (state: Predictions, action: PredictionActions) : Predictions => {
    switch (action.type) {
        case PredictionAction.LookupQuickDraw:
            return {
                ...state,
            }
        default:
            return state;
    }
}

const createNewFigure = (id: number) : Figure => {
    return {
        id: "Fig" + id,
        offset: {x: 0, y: 0},
        curves: [],
        curveTimes: []
    }
};

const isPen = (tool: CanvasToolbarSelection) => {
    switch (tool) {
        case CanvasToolbarSelection.Black:
        case CanvasToolbarSelection.Blue:
        case CanvasToolbarSelection.Green:
        case CanvasToolbarSelection.Red:
            return true
        default:
            return false
    }
}

const selectTool = (state: Canvas, newTool: CanvasToolbarSelection) => {
    let figures = state.figures;
    let figureIdentifier = state.figureIdentifier;

    if (isPen(newTool)) {
        figureIdentifier = state.figureIdentifier + 1
        figures = [...state.figures, createNewFigure(state.figureIdentifier)]
    }

    return {
        ...state,
        toolSelected: newTool,
        figureIdentifier: figureIdentifier,
        figures: figures
    };
};

const penColor = (toolSelected: CanvasToolbarSelection) => {
    switch (toolSelected) {
        case CanvasToolbarSelection.Black: return "black"
        case CanvasToolbarSelection.Blue: return "blue"
        case CanvasToolbarSelection.Green: return "green"
        case CanvasToolbarSelection.Red: return "red"

        default: return "black"
    }
}

const startNewCurve = (figures: Figure[], startedAt: number, toolSelected: CanvasToolbarSelection, projectedPoints: TemporalPoint[]) : Figure[] => {
    const lastFigure = figures.pop()!;

    const curve : Curve = {
        startedAt: startedAt,
        id: "Crv" + (lastFigure.curves.length + 1).toString(),
        pathPoints: [],
        strokeColor: penColor(toolSelected),
        strokeWidth: 3
    }

    curve.pathPoints = [...projectedPoints]
    return [...figures, {...lastFigure, curves: [...lastFigure.curves, curve]}]
}


const mouseDown = (state: Canvas, point: Point): Canvas => {

    if (!isPen(state.toolSelected))
        return state

    const inkDraw = InkDrawSmoothReducer.MouseDown(state.inkDraw, point);
    const figures = startNewCurve(state.figures, inkDraw.startedAt, state.toolSelected, inkDraw.projectedPoints);

    return {...state,
        inkDraw: inkDraw,
        figures: figures
    }
}

const updateRecentCurveWithInkDrawing = (figures: Figure[], projectedPoints: TemporalPoint[]): Figure[] => {
    const lastFigure = figures.pop()!
    let curves = lastFigure.curves;
    const lastCurve : Curve = curves.pop()!
    lastCurve.pathPoints = [...projectedPoints]
    return [...figures, {...lastFigure, curves: [...curves, lastCurve]}]
}


const mouseMove = (state: Canvas, point: Point): Canvas => {
    if (!isPen(state.toolSelected) || !state.inkDraw.tracking)
        return state

    const inkDraw = InkDrawSmoothReducer.MouseMove(state.inkDraw, point)
    return {
        ...state,
        inkDraw: inkDraw,
        figures: updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints)
    }
}
const mouseUp = (state: Canvas, point: Point): Canvas => {
    if (!isPen(state.toolSelected))
        return state

    // todo fetchPredictions().then()
    const inkDraw = InkDrawSmoothReducer.MouseUp(state.inkDraw, point)
    return {
        ...state,
        inkDraw: inkDraw,
        figures: updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints)
    }
}


export const canvasReducer = (state: Canvas, action: CanvasActions): Canvas => {
    switch (action.type) {
        case CanvasAction.ToolSelected:
            return selectTool(state, action.payload.tool)
        case CanvasAction.CanvasMouseDown:
            return mouseDown(state, action.payload.point)
        case CanvasAction.CanvasMouseMove:
            return mouseMove(state, action.payload.point)
        case CanvasAction.CanvasMouseUp:
            return mouseUp(state, action.payload.point)
        default:
            return state;
    }
}

export interface ApplicationState {
    canvas: Canvas
    predictions: Predictions
}

export const initialState : ApplicationState = {
    canvas: DefaultCanvas,
    predictions: DefaultPredictions
}

export type AllActions = PredictionActions | CanvasActions

export const rootReducer : Reducer<ApplicationState, AllActions> = (state = initialState, action) => {
    return {
        predictions: predictionsReducer(state.predictions, action as PredictionActions),
        canvas: canvasReducer(state.canvas, action as CanvasActions)
    } as ApplicationState
}



/*
const { post, response } = useFetch('https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8')

const fetchPredictions = async () => {
    const figure = figures[figures.length - 1];
    const data = await post('', inkPayload(1000, 1000, figure) )
    if (!response.ok) {
        console.error("request failed", response.headers)
    }else if (data[0] !== "SUCCESS") {
        console.error("request failed", data)
    }else
        setPredictions(data[1][0][1])
}
*/


