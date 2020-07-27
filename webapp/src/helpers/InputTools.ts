import {TemporalPoint} from "../stores/Models";


export interface QuickDrawGuide {
    width: number
    height: number
}

export interface QuickDrawRequest {
    language: string
    writing_guide: QuickDrawGuide
    ink: number[][][]
}

export interface QuickDrawPayload {
    input_type: number;
    requests: QuickDrawRequest[];
}


export const inkPayload = (width: number, height: number, points: TemporalPoint[]) => {
    return {
        input_type: 0,
        requests: [
            {
                language: "quickdraw",
                writing_guide: { width: width, height: height},
                ink: [
                    [
                        points.map(v => v.x),
                        points.map(v => v.y),
                        points.map(v => v.timespan)
                    ]
                ]
            }
        ]
    }
}
