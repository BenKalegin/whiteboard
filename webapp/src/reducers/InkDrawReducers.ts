import {Canvas, CanvasToolbarSelection, Curve, Figure, Point, TemporalPoint} from "../models/DrawModels";
import {InkDrawSmoothReducer} from "./InkDrawSmoothReducer";
import {Action} from "redux";
import {ApplicationAction, applicationMsg} from "../actions/Actions";
import {generateCurveId} from "./DynamicIdentifiers";

export const updateRecentCurveWithInkDrawing = (figures: Figure[], projectedPoints: TemporalPoint[]): Figure[] => {
    const lastFigure = figures.pop()!
    let curves = lastFigure.curves;
    const lastCurve: Curve = curves.pop()!
    lastCurve.pathPoints = [...projectedPoints]
    return [...figures, {...lastFigure, curves: [...curves, lastCurve]}]
}

export function inkDrawMouseMove(state: Canvas, point: Point): Canvas {
    if (!state.inkDraw.tracking)
        return state
    const inkDraw = InkDrawSmoothReducer.mouseMove(state.inkDraw, point)
    return {
        ...state,
        inkDraw: inkDraw,
        figures: updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints)
    }
}

const penColor = (toolSelected: CanvasToolbarSelection) => {
    switch (toolSelected) {
        case CanvasToolbarSelection.Black:
            return "black"
        case CanvasToolbarSelection.Blue:
            return "blue"
        case CanvasToolbarSelection.Green:
            return "green"
        case CanvasToolbarSelection.Red:
            return "red"

        default:
            return "black"
    }
}

const startNewCurve = (figures: Figure[], startedAt: number, toolSelected: CanvasToolbarSelection, projectedPoints: TemporalPoint[]): Figure[] => {
    const lastFigure = figures.pop()!;

    const curve: Curve = {
        startedAt: startedAt,
        id: generateCurveId(),
        pathPoints: [],
        strokeColor: penColor(toolSelected),
        strokeWidth: 3,
        toBeDeleted: false
    }

    curve.pathPoints = [...projectedPoints]
    return [...figures, {...lastFigure, curves: [...lastFigure.curves, curve]}]
}

export const inkDrawMouseDown = (state: Canvas, point: Point) => {
    const inkDraw = InkDrawSmoothReducer.mouseDown(state.inkDraw, point);
    const figures = startNewCurve(state.figures, inkDraw.startedAt, state.toolSelected, inkDraw.projectedPoints);
    return {
        ...state,
        inkDraw: inkDraw,
        figures: figures
    }
};

export const inkDrawMouseUp = (state: Canvas, point: Point, events: Action[]) => {
    const inkDraw = InkDrawSmoothReducer.mouseUp(state.inkDraw, point)
    const figures = updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints);
    const figure = figures[figures.length - 1]
    const curve = figure.curves[figure.curves.length - 1]
    const action = applicationMsg(ApplicationAction.CurveCompleted, {figureId: figure.id, curveId: curve.id});
    events.push(action)
    return {
        ...state,
        inkDraw: inkDraw,
        figures: figures
    }
};