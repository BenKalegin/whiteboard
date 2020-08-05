import {Canvas, CanvasPoint, CanvasToolbarSelection, Figure, Point} from "../models/DrawModels";
import {Action} from "redux";
import {CanvasAction, CanvasActions} from "../actions/Actions";
import {inkDrawMouseDown, inkDrawMouseMove, inkDrawMouseUp} from "./InkDrawReducers";
import {eraserMouseDown, eraserMouseMove} from "./EraserReducers";
import {generateFigureId} from "./DynamicIdentifiers";

export const createNewFigure = (): Figure => {
    return {
        id: generateFigureId(),
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

    if (isPen(newTool)) {
        figures = [...state.figures, createNewFigure()]
    }

    return {
        ...state,
        toolSelected: newTool,
        figures: figures
    };
};

const mouseDown = (state: Canvas, point: CanvasPoint): Canvas => {
    if (isPen(state.toolSelected))
        return inkDrawMouseDown(state, point.relative);

    if (state.toolSelected === CanvasToolbarSelection.Eraser)
        return eraserMouseDown(state);

    return state;
}

const mouseMove = (state: Canvas, point: CanvasPoint): Canvas => {
    if (isPen(state.toolSelected))
        return inkDrawMouseMove(state, point.relative);

    if (state.toolSelected === CanvasToolbarSelection.Eraser)
        return eraserMouseMove(state, point.absolute);

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
            return mouseUp(state, action.payload.point.relative, events)
        default:
            return state;
    }
}