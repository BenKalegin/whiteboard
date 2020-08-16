import {Figure, TemporalPoint} from "../models/DrawModels";

export const quickDrawPayload = (width: number, height: number, figure: Figure) => {
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

export const handWritePayload = (width: number, height: number, figure: Figure) => {
    let curves: TemporalPoint[][] = []
    for (const curve of figure.curves) {
        curves.push(curve.pathPoints.map((p) => ({
            ...p,
            timespan: p.timespan + curve.startedAt - figure.curves[0].startedAt
        } as TemporalPoint)))
    }

    return {
        api_level: "537.36",
        app_version: 0.4,
        input_type: 0,
        device: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
        itc: "en-t-i0-handwrit",  //"und-t-i0-handwrit",
        options: "enable_pre_space",
        requests: [
            {
                language: "en",
                //language: "universal",
                max_completions: 0,
                max_num_results: 100,
                pre_context: "",
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
            body: JSON.stringify(quickDrawPayload(width, height, figure))
        })
}

export const fetchCharacterSuggestions = (width: number, height: number, figure: Figure) => {
    const url = 'https://inputtools.google.com/request?itc=en-t-i0-handwrit&app=translate' //itc=und-t-i0-handwrit&app=hwtcharpicker'
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
            body: JSON.stringify(handWritePayload(width, height, figure))
        })
}

