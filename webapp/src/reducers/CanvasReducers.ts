import {
    Bounds,
    Canvas,
    CanvasPoint,
    CanvasToolbarSelection,
    EmbeddingType,
    Figure,
    FigureEmbedding,
    FigureProportions,
    FinePictureEmbedding,
    Point,
    TextEmbedding,
    Transform
} from "../models/DrawModels";
import {Action} from "redux";
import {CanvasAction, CanvasActions} from "../actions/Actions";
import {inkDrawMouseDown, inkDrawMouseMove, inkDrawMouseUp, penColor} from "./InkDrawReducers";
import {eraserMouseDown, eraserMouseMove} from "./EraserReducers";

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

    // close current figure drawing if other tool selected
    if (figures.length > 0 && !figures[figures.length-1].drawingClosed) {
        const lastFigure = figures.pop()!
        figures = [...state.figures, {...lastFigure, drawingClosed:  true}]
    }

    return {
        ...state,
        toolSelected: newTool,
        figures: figures
    }
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

const finePictureSize = 56;

function calcPictureTransform(bounds: Bounds, finePictureName: string, figure: Figure, rotateAngle: number, flipX: boolean) : Transform {
    const scaleFactor = Math.max(bounds.size.x, bounds.size.y) / finePictureSize
    const xScaleFactor = flipX ? -scaleFactor : scaleFactor

    const inkCenter: Point = { x: bounds.offset.x + bounds.size.x / 2, y: bounds.offset.y + bounds.size.y / 2};
    const rotate = rotateAngle != 0 ? { degrees: rotateAngle, aboutPoint: inkCenter } : undefined;

    return {
        translate: {
            x: inkCenter.x - finePictureSize * scaleFactor / 2 + (flipX ? finePictureSize * scaleFactor : 0),
            y: inkCenter.y - finePictureSize * scaleFactor / 2,
        },
        scale: {
            x: xScaleFactor,
            y: scaleFactor
        },
        rotate : rotate
    }
}

function calcTextTransform(bounds: Bounds, text: string, figure: Figure, rotateAngle: number, flipX: boolean) : Transform {
    const textSpaceAbove = 5
    const textSize = 13 - textSpaceAbove
    const scaleFactor = bounds.size.x / textSize

    const inkCenter: Point = { x: bounds.offset.x + bounds.size.x / 2, y: bounds.offset.y + bounds.size.y / 2};

    return {
        translate: {
            x: inkCenter.x - textSize * scaleFactor / 2,
            y: bounds.offset.y + bounds.size.y,
        },
        scale: {
            x: scaleFactor,
            y: scaleFactor
        },
    }
}

const replaceFigure = (state: Canvas, figureId: string, finePictureName: string, text: string, proportions: FigureProportions): Canvas => {
    const figure = state.figures.find(f => f.id === figureId)
    if (!figure || !figure.bounds)
        // figure was deleted during api calls or bounds were not calculated
        return state

    const embedding: FigureEmbedding =
    finePictureName.length > 0 ?
        <FinePictureEmbedding> {
            type: EmbeddingType.FinePicture,
            name: finePictureName,
            transform: calcPictureTransform(figure.bounds, finePictureName, figure, proportions.rotateAngle, proportions.flipX),
        }
        :
        <TextEmbedding> {
            type: EmbeddingType.Text,
            text: text,
            transform: calcTextTransform(figure.bounds, text, figure, proportions.rotateAngle, proportions.flipX),
        }
    embedding.stroke = {color: penColor(state.toolSelected)}


    const newFigure: Figure = {...figure,
        drawingClosed: true,
        embedding: embedding }
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
            const {figureId, finePictureName, text, proportions} = action.payload;
            return replaceFigure(state, figureId, finePictureName, text, proportions)
        default:
            return state;
    }
}