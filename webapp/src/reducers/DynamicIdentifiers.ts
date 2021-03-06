import shortid from "shortid";

const figureIdPrefix = "Fig_"
const curveIdPrefix = "Cur_"

export const generateFigureId = () => {
    return figureIdPrefix + shortid.generate()
}
export const generateCurveId = () => {
    return curveIdPrefix + shortid.generate()
}

export const isFigureId = (id: string) => id?.startsWith(figureIdPrefix)
export const isCurveId = (id: string) => id?.startsWith(curveIdPrefix)