import React from "react";

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
    polyLinePoints: Point[]
    pointTimes: number[]
}

export interface Figure {
    id: string
    offset: Point
    curves: Curve[]
    curveTimes: number[]
}

export interface MouseHandler {
    MouseDown: (p: Point) => void
    MouseMove: (p: Point) => void
    MouseUp: (p: Point) => void
}

