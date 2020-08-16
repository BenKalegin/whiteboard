export interface QuickdrawPredictions {
    topMatches: string[]
    figureId: string // todo do we need it here
}

export interface CharacterPredictions {
    topMatches: string[]
    figureId: string
}

export interface BasicShapePredictions {
    shape: string
}

export interface Predictions {
    quickDraw: QuickdrawPredictions
    character: CharacterPredictions
    basicShape: BasicShapePredictions
}

export const DefaultPredictions: Predictions = {
    quickDraw: { topMatches: [], figureId: "" },
    character: { topMatches: [], figureId: "" },
    basicShape: {shape: ''}
}

