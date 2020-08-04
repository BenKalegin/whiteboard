import {Canvas, CanvasToolbarSelection, Figure, Point} from "../models/DrawModels";
import {Action} from "redux";
import {CanvasAction, CanvasActions} from "../actions/Actions";
import {inkDrawMouseDown, inkDrawMouseMove, inkDrawMouseUp} from "./InkDrawReducers";
import {eraserMouseDown, eraserMouseMove} from "./EraserReducers";

export const createNewFigure = (id: number): Figure => {
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

const mouseDown = (state: Canvas, point: Point): Canvas => {
    if (isPen(state.toolSelected))
        return inkDrawMouseDown(state, point);

    if (state.toolSelected === CanvasToolbarSelection.Eraser)
        return eraserMouseDown(state, point);

    return state;
}

const mouseMove = (state: Canvas, point: Point): Canvas => {
    if (isPen(state.toolSelected))
        return inkDrawMouseMove(state, point);

    if (state.toolSelected === CanvasToolbarSelection.Eraser)
        return eraserMouseMove(state, point);

    return state

}

const mouseUp = (state: Canvas, point: Point, events: Action[]): Canvas => {
    if (isPen(state.toolSelected))
        return inkDrawMouseUp(state, point, events);

    return state

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