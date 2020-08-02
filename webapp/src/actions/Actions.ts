import {CanvasToolbarSelection, Point} from "../models/DrawModels";

export type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
            type: Key;
        }
        : {
            type: Key;
            payload: M[Key];
        }
};

export function createMsg<Obj extends { [index: string]: any }>() {
    return function<Key extends keyof Obj>(
        name: Key,
        ...args: Obj[Key] extends undefined ? [] : [Obj[Key]]
    ) {
        if (args.length > 0) {
            return { type: name, payload: args[0] };
        }
        return { type: name };
    };
}


export enum PredictionAction {
    LookupQuickDraw = "LOOKUP_QUICK_DRAW",
    LookupBasicShape = "LOOKUP_BASIC_SHAPE"
}

type PredictionMessages = {
    [PredictionAction.LookupQuickDraw]: { requestObject: object };
    [PredictionAction.LookupBasicShape]: {};
};

export enum CanvasAction {
    ToolSelected = "CANVAS_SET_TOOL",
    CanvasMouseDown = "CANVAS_MOUSE_DOWN",
    CanvasMouseMove = "CANVAS_MOUSE_MOVE",
    CanvasMouseUp = "CANVAS_MOUSE_UP",
}

type CanvasMessages = {
    [CanvasAction.ToolSelected]: { tool: CanvasToolbarSelection };
    [CanvasAction.CanvasMouseDown]: { point: Point };
    [CanvasAction.CanvasMouseMove]: { point: Point };
    [CanvasAction.CanvasMouseUp]: { point: Point };
};

export enum ApplicationAction {
    StartApplication = "APP_START"
}

type ApplicationMessages = {
    [ApplicationAction.StartApplication]: { };
};

export type PredictionActions = ActionMap<PredictionMessages>[keyof ActionMap<PredictionMessages>];
export type CanvasActions = ActionMap<CanvasMessages>[keyof ActionMap<CanvasMessages>];
export type ApplicationActions = ActionMap<ApplicationMessages>[keyof ActionMap<ApplicationMessages>];

export const canvasMsg = createMsg<CanvasMessages>();
export const predictionMsg = createMsg<PredictionMessages>();
export const applicationMsg = createMsg<ApplicationMessages>();

export type AllActions = PredictionActions | CanvasActions | ApplicationActions




