import {
    CanvasAction,
    CanvasActions,
    PredictionAction,
    PredictionActions,
    AllActions,
    ApplicationAction, applicationMsg, HasInducedActions
} from "../actions/Actions";
import {Canvas, Curve, initialCanvas, Figure, Point, TemporalPoint, CanvasToolbarSelection} from "../models/DrawModels";
import {DefaultPredictions, Predictions} from "../models/PredictModels";
import {InkDrawSmoothReducer} from "./InkDrawSmoothReducer";
import {Reducer, Action} from "redux";


export const predictionsReducer = (state: Predictions, action: PredictionActions) : Predictions => {
    switch (action.type) {
        case PredictionAction.QuickDrawPredictionReceived:
            return {
                ...state,
                quickDraw:  {
                    topMatches: action.payload
                }
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

    const inkDraw = InkDrawSmoothReducer.mouseDown(state.inkDraw, point);
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

    const inkDraw = InkDrawSmoothReducer.mouseMove(state.inkDraw, point)
    return {
        ...state,
        inkDraw: inkDraw,
        figures: updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints)
    }
}
const mouseUp = (state: Canvas, point: Point, events: Action[]): Canvas => {
    if (!isPen(state.toolSelected))
        return state

    const inkDraw = InkDrawSmoothReducer.mouseUp(state.inkDraw, point)
    const figures = updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints);

    const figure = figures[figures.length-1]
    const curve = figure.curves[figure.curves.length-1]
    const action = applicationMsg(ApplicationAction.CurveCompleted, {figureId: figure.id, curveId: curve.id});
    events.push(action)

    return {
        ...state,
        inkDraw: inkDraw,
        figures: figures
    }
}


export const canvasReducer = (state: Canvas, action: CanvasActions, events: Action[]): Canvas => {
    switch (action.type) {
        case CanvasAction.ToolSelected:
            return selectTool(state, action.payload.tool)
        case CanvasAction.CanvasMouseDown:
            return mouseDown(state, action.payload.point)
        case CanvasAction.CanvasMouseMove:
            return mouseMove(state, action.payload.point)
        case CanvasAction.CanvasMouseUp:
            return mouseUp(state, action.payload.point, events)
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



