import {Canvas, CanvasToolbarSelection, Curve, Figure, Point, TemporalPoint} from "../models/DrawModels";
import {InkDrawSmoothReducer} from "./InkDrawSmoothReducer";
import {Action} from "redux";
import {ApplicationAction, applicationMsg} from "../actions/Actions";
import {generateCurveId, generateFigureId} from "./DynamicIdentifiers";

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

export const penColor = (toolSelected: CanvasToolbarSelection) => {
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

const createNewFigure = (): Figure => {
    return {
        id: generateFigureId(),
        curves: [],
        curveTimes: [],
        drawingClosed: false,
        toBeDeleted: false
    }
};

const startNewCurve = (figures: Figure[], startedAt: number, toolSelected: CanvasToolbarSelection, projectedPoints: TemporalPoint[]): Figure[] => {

    const figure = (figures.length === 0 || figures[figures.length-1].drawingClosed) ? createNewFigure() : figures.pop()!;

    const curve: Curve = {
        startedAt: startedAt,
        id: generateCurveId(),
        pathPoints: [],
        strokeColor: penColor(toolSelected),
        strokeWidth: 3,
        toBeDeleted: false
    }

    curve.pathPoints = [...projectedPoints]
    return [...figures, {...figure, curves: [...figure.curves, curve]}]
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

const isHtmlSvg = (something: HTMLElement | SVGElement): something is SVGElement => {
    if(!something) return false;
    return something instanceof SVGElement;
}

const getSvgElementById = (id: string): SVGElement | null => {
    const element = document.getElementById(id)
    if(!element) return null
    if(isHtmlSvg(element)) {
        return element;
    }
    return null;
}

export const inkDrawMouseUp = (state: Canvas, point: Point, events: Action[]) => {
    const inkDraw = InkDrawSmoothReducer.mouseUp(state.inkDraw, point)
    const figures = updateRecentCurveWithInkDrawing(state.figures, state.inkDraw.projectedPoints);
    const figure = figures[figures.length - 1]
    const curve = figure.curves[figure.curves.length - 1]

    const figureElement = getSvgElementById(figure.id) as SVGGElement
    const bounds = figureElement.getBBox();
    figure.bounds = {
        offset: {x: bounds.x, y: bounds.y},
        size:  {x: bounds.width, y: bounds.height}
    }


    const action = applicationMsg(ApplicationAction.CurveCompleted, {figureId: figure.id, curveId: curve.id});
    events.push(action)
    return {
        ...state,
        inkDraw: inkDraw,
        figures: figures
    }
};