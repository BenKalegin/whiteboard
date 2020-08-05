import {Canvas, Figure, Point} from "../models/DrawModels";
import {isCurveId} from "./DynamicIdentifiers";

const deleteCurve = (figures: Figure[]): Figure[] => {
    const newFigures = [...figures]
    for (let i = 0; i < newFigures.length; i++){
        let figure = newFigures[i];
        const curvesToKeep = figure.curves.filter(c => !c.toBeDeleted)
        if (curvesToKeep.length !== figure.curves.length) {
            if (curvesToKeep.length !== 0)
                newFigures[i] = {...figure, curves: curvesToKeep}
            else
                // last curve in figure
                newFigures.splice(i, 1)
        }
    }
    return newFigures
}
export const eraserMouseDown = (state: Canvas) => {
    return {
        ...state,
        figures: deleteCurve(state.figures)
    }
}

export const eraserMouseMove = (state: Canvas, point: Point): Canvas => {
    const curveIdsUnderMouse = document.elementsFromPoint(point.x, point.y)
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