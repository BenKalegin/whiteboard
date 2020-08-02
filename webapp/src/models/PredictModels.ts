export interface QuickdrawPredictions {
    topMatches: string[]
}

export interface BasicShapePredictions {
    shape: string
}

export interface Predictions {
    quickDraw: QuickdrawPredictions
    basicShape: BasicShapePredictions
}

export const DefaultPredictions: Predictions = {
    quickDraw: { topMatches: [] },
    basicShape: {shape: ''}
}

