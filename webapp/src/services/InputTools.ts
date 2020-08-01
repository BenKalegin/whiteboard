import {Figure, TemporalPoint} from "../stores/DrawModels";

export const inkPayload = (width: number, height: number, figure: Figure) => {
    let curves: TemporalPoint[][] = []
    for (const curve of figure.curves) {
        curves.push(curve.pathPoints.map((p) => {
            return {...p, timespan: p.timespan + curve.startedAt - figure.curves[0].startedAt} as TemporalPoint
        }))
    }


    return {
        input_type: 0,
        requests: [
            {
                language: "quickdraw",
                writing_guide: { width: width, height: height},
                ink: curves
            }
        ]
    }
}
