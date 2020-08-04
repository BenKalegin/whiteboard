import {Figure, TemporalPoint} from "../models/DrawModels";

export const inkPayload = (width: number, height: number, figure: Figure) => {
    let curves: TemporalPoint[][] = []
    for (const curve of figure.curves) {
        curves.push(curve.pathPoints.map((p) => ({
            ...p,
            timespan: p.timespan + curve.startedAt - figure.curves[0].startedAt
        } as TemporalPoint)))
    }

    return {
        input_type: 0,
        requests: [
            {
                language: "quickdraw",
                writing_guide: { width: width, height: height},
                ink: curves.map(c => [
                    c.map(v => v.x),
                    c.map(v => v.y),
                    c.map(v => v.timespan)
                ])
            }
        ]
    }
}


export const fetchQuickDrawSuggestions = (width: number, height: number, figure: Figure) => {
    const url = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8';
        return fetch(url, {
            method: "POST",
/*
            mode: "cors",
            cache: "no-cache",
            redirect: "follow",
*/
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inkPayload(width, height, figure))
        })
}

