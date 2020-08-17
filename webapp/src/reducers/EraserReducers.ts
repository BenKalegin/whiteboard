import {Canvas, Figure, Point} from "../models/DrawModels";
import {isCurveId, isFigureId} from "./DynamicIdentifiers";

const removeToBeDeleted = (figures: Figure[]): Figure[] => {
    const newFigures = [...figures.filter(f => !f.toBeDeleted)]
    for (let i = 0; i < newFigures.length; i++)
        newFigures[i] = {
            ...newFigures[i],
            curves: newFigures[i].curves.filter(c => !c.toBeDeleted)
        };
    return newFigures.filter(f => f.curves.length > 0)
}

export const eraserMouseDown = (state: Canvas) => {
    return {
        ...state,
        figures: removeToBeDeleted(state.figures)
    }
}

export const eraserMouseMove = (state: Canvas, point: Point): Canvas => {
    const pointsInsideCursor: Point[] = [
        {x: point.x, y: point.y},

        {x: point.x-5, y: point.y},
        {x: point.x+5, y: point.y},

        {x: point.x, y: point.y-5},
        {x: point.x, y: point.y+5},

        {x: point.x-3, y: point.y-3},
        {x: point.x+3, y: point.y-3},
        {x: point.x-3, y: point.y+3},
        {x: point.x+3, y: point.y+3}
    ]

    const hitTestElements = Array.from(new Set(pointsInsideCursor.flatMap(p => document.elementsFromPoint(p.x, p.y))));

    const findParentFigureId = (e: Element): string | undefined => {
        while (e.parentElement) {
            const g = e as SVGGElement;
            if (g && isFigureId(g.id))
                return g.id
            e = e.parentElement
        }
        return undefined
    };

    // we need to deleted embedded figures under cursor
    const figureIdsUnderMouse = hitTestElements
        .map(e => findParentFigureId(e))
        .filter(s => s)

    // we need to delete drawing curves under cursor
    const curveIdsUnderMouse = hitTestElements
        .filter(e => isCurveId(e.id))
        .map(e => e.id)

    const newFigures = [...state.figures]
    for (let i = 0; i < newFigures.length; i++){
        const figure = newFigures[i];

        if (figure.embedding) {
            // check if figure has embedding and should be highlighted for deletion
            if (figureIdsUnderMouse.includes(figure.id))
                newFigures[i] = {...figure, toBeDeleted: true}
             else if (figure.toBeDeleted)
                // uncheck if figure is no more under eraser
                newFigures[i] = {...figure, toBeDeleted: false}
        }else {
            // check curves
            const flipDeleted = figure.curves.filter(c => c.toBeDeleted !== curveIdsUnderMouse.includes(c.id)).map((c, i) => i)
            if (flipDeleted.length > 0) {
                const newCurves = [...figure.curves]
                for (const j of flipDeleted) {
                    newCurves[j] = {...newCurves[j], toBeDeleted: !newCurves[j].toBeDeleted}
                }
                newFigures[i] = {...figure, curves: newCurves}
            }
        }
    }

    return {
        ...state,
        figures: newFigures
    }
}