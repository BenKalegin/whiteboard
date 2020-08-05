import {Bounds, Canvas, CanvasPoint, CanvasToolbarSelection, Figure, Point, Transform} from "../models/DrawModels";
import {Action} from "redux";
import {CanvasAction, CanvasActions} from "../actions/Actions";
import {inkDrawMouseDown, inkDrawMouseMove, inkDrawMouseUp, penColor} from "./InkDrawReducers";
import {eraserMouseDown, eraserMouseMove} from "./EraserReducers";
import {generateFigureId} from "./DynamicIdentifiers";

export const createNewFigure = (): Figure => {
    return {
        id: generateFigureId(),
        curves: [],
        curveTimes: [],
        finePicture: {
            name: "",
            transform: {},
            stroke : {color: ""}
        },
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

function calcTransform(bounds: Bounds) : Transform {
    const scaleFactor = Math.max(bounds.size.x,  bounds.size.y) / 56
    return {
        translate: {
            x: bounds.offset.x,
            y: bounds.offset.y
        },
        scale: {
            x: scaleFactor,
            y: scaleFactor
        }
    }
}

const replaceFigure = (state: Canvas, figureId: string, finePictureName: string): Canvas => {
    const figure = state.figures.find(f => f.id === figureId)
    if (!figure || !figure.bounds)
        // figure was deleted during api calls or bounds were not calculated
        return state

    const newFigure: Figure = {...figure,
        finePicture: {
            name: finePictureName,
            transform: calcTransform(figure.bounds),
            stroke: {color: penColor(state.toolSelected)}
        } }
    return {
        ...state,
        figures: [...state.figures.filter(f => f.id !== figureId), newFigure]
    }

};

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
        case CanvasAction.ReplaceFigure:
            return replaceFigure(state, action.payload.figureId, action.payload.finePictureName)
        default:
            return state;
    }
}