import {CanvasToolbarSelection} from "../features/CanvasToolbar";

export interface Point {
    x: number
    y: number
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
}

export interface Figure {
    id: string
    offset: Point
    curves: Curve[]
    curveTimes: number[]
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

export interface Canvas {
    smoothWindow: number
    toolSelected: CanvasToolbarSelection
    inkDraw: InkDraw
    figures: Figure[]
    figureIdentifier: number
}

export const DefaultCanvas: Canvas = {
    smoothWindow: 1,
    toolSelected: CanvasToolbarSelection.None,
    inkDraw: DefaultInkDraw,
    figures: new Array<Figure>(),
    figureIdentifier:  1
}