export interface Point {
    x: number
    y: number
}

export interface Bounds {
    offset: Point
    size: Point
}

export interface CanvasPoint {
    relative: Point
    absolute: Point
}

export interface TemporalPoint extends Point {
    timespan: number;
}


export interface Curve {
    id: string
    strokeWidth: number | string
    strokeColor: string
    startedAt: number
    pathPoints: TemporalPoint[]
    toBeDeleted: boolean
}

// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
export interface Transform {
    rotate?: {
        degrees: number
        aboutPoint: Point
    }
    translate?: {
        x: number
        y: number
    }

    scale?: {
        x: number
        y: number
    }
}

interface Stroke {
    color: string
}

export interface FinePictureEmbedding {
    name: string
    transform: Transform
    stroke: Stroke
}

export interface Figure {
    id: string
    finePicture: FinePictureEmbedding
    curves: Curve[]
    curveTimes: number[]
    bounds?: Bounds
}

export interface FigureProportions {
    rotateAngle: number
    flipX: boolean
}

export interface InkDraw{
    smoothingBuffer: TemporalPoint[]

    /**
     * Points that are already part of the curve and will not change.
     */
    committedPoints: TemporalPoint[]

    /**
     * Projected points
     */
    projectedPoints: TemporalPoint[]

    /**
     * time when this ink was started to draw
     */
    startedAt: number
    smoothFactor: number
    tracking: boolean
}

const DefaultInkDraw: InkDraw = {
    committedPoints: [],
    projectedPoints: [],
    smoothFactor: 1,
    smoothingBuffer: [],
    startedAt: 0,
    tracking: false
}

export enum CanvasToolbarSelection {
    None,
    PanZoom,
    Black,
    Red,
    Green,
    Blue,
    Eraser
}

export interface Canvas {
    smoothWindow: number
    toolSelected: CanvasToolbarSelection
    inkDraw: InkDraw
    figures: Figure[]
}

export const initialCanvas: Canvas = {
    smoothWindow: 1,
    toolSelected: CanvasToolbarSelection.None,
    inkDraw: DefaultInkDraw,
    figures: new Array<Figure>(),
}