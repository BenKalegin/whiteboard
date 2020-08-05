import {Canvas, Figure, Point} from "../models/DrawModels";
import {isCurveId} from "./DynamicIdentifiers";

const deleteCurve = (figures: Figure[]): Figure[] => {
    const newFigures = [...figures]
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
        figures: deleteCurve(state.figures)
    }
}

export const eraserMouseMove = (state: Canvas, point: Point): Canvas => {
    const pointsInsideCursor: Point[] = [
        {x: point.x-2, y: point.y-2},
        {x: point.x-2, y: point.y-1},
        {x: point.x-2, y: point.y},
        {x: point.x-2, y: point.y+1},
        {x: point.x-2, y: point.y+2},

        {x: point.x-1, y: point.y-2},
        {x: point.x-1, y: point.y-1},
        {x: point.x-1, y: point.y},
        {x: point.x-1, y: point.y+1},
        {x: point.x-1, y: point.y+2},

        {x: point.x, y: point.y-2},
        {x: point.x, y: point.y-1},
        {x: point.x, y: point.y},
        {x: point.x, y: point.y+1},
        {x: point.x, y: point.y+2},

        {x: point.x+1, y: point.y-2},
        {x: point.x+1, y: point.y-1},
        {x: point.x+1, y: point.y},
        {x: point.x+1, y: point.y+1},
        {x: point.x+1, y: point.y+2},

        {x: point.x+2, y: point.y-2},
        {x: point.x+2, y: point.y-1},
        {x: point.x+2, y: point.y},
        {x: point.x+2, y: point.y+1},
        {x: point.x+2, y: point.y+2},
    ]

    const curveIdsUnderMouse = Array.from(new Set(pointsInsideCursor.flatMap(p => document.elementsFromPoint(p.x, p.y))))
        .filter(e => isCurveId(e.id))
        .map(e => e.id)

    const newFigures = [...state.figures]
    for (let i = 0; i < newFigures.length; i++){
        const figure = newFigures[i];
        const flipDeleted = figure.curves.filter(c => c.toBeDeleted !== curveIdsUnderMouse.includes(c.id)).map((c, i) => i)
        if (flipDeleted.length > 0) {
            const newCurves = [...figure.curves]
            for (const j of flipDeleted) {
                newCurves[j] = {...newCurves[j], toBeDeleted: !newCurves[j].toBeDeleted}
            }
            newFigures[i] = {...figure, curves: newCurves}
        }
    }

    return {
        ...state,
        figures: newFigures
    }
}