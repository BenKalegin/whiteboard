import {Canvas, Figure, Point} from "../models/DrawModels";

const deleteCurve = (figures: Figure[], point: Point): Figure[] => {
    return figures;
}
export const eraserMouseDown = (state: Canvas, point: Point) => {
    const figures = deleteCurve(state.figures, point)
    return {
        ...state,
        figures: figures
    }
};

export const eraserMouseMove = (state: Canvas, point: Point) => {
    return state
/*
    document.elementsFromPoint(point.x, point.y)
    return {
        ...state,
        figures: figures
    }
*/
};