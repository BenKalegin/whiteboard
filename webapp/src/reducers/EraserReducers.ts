import {Canvas, Figure, Point} from "../models/DrawModels";
import {isCurveId} from "./DynamicIdentifiers";

const deleteCurve = (figures: Figure[], curvesIdsToDelete: string[]): Figure[] => {
    const newFigures = [...figures]
    for (let i = 0; i < newFigures.length; i++){
        let figure = newFigures[i];
        const curvesToKeep = figure.curves.filter(c => !curvesIdsToDelete.includes(c.id))
        if (curvesToKeep.length !== figure.curves.length) {
            if (curvesToKeep.length !== 0)
                newFigures[i] = {...figure, curves: curvesToKeep}
            else
                newFigures.splice(i, 1)
        }
    }
    return newFigures
}
export const eraserMouseDown = (state: Canvas) => {
    return {
        ...state,
        figures: deleteCurve(state.figures, state.curvesIdsToDelete)
    }
}

export const eraserMouseMove = (state: Canvas, point: Point) => {
    const curveIdsUnderMouse = document.elementsFromPoint(point.x, point.y)
        .filter(e => isCurveId(e.id))
        .map(e => e.id)

    if (curveIdsUnderMouse?.length > 0) {
        return {
            ...state,
            curvesIdsToDelete: curveIdsUnderMouse
        }
    }
    else {
        return state;
    }
}