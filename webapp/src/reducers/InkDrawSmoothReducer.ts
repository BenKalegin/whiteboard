import {InkDraw, Point, TemporalPoint} from "../models/DrawModels";

export class InkDrawSmoothReducer {

    private static appendToSmoothingBuffer = (p: Point, model: InkDraw): InkDraw => {

        let buffer = [...model.smoothingBuffer, { ...p, timespan: Date.now() - model.startedAt}];
        if (buffer.length > model.smoothFactor) {
            buffer.shift();
        }

        return {
            ...model,
            smoothingBuffer: buffer
        }
    }

    /**
     * Calculate the average point, starting at offset in the smooth window in buffer
     */
    private static getAveragePoint = (offset: number, model: InkDraw) : TemporalPoint | null => {

        const smoothCount = model.smoothingBuffer.length;
        if (smoothCount % 2 === 1 || smoothCount >= model.smoothFactor) {
            let totalX = 0;
            let totalY = 0;
            let totalTime = 0;
            let pt, i;
            let count = 0;
            for (i = offset; i < smoothCount; i++) {
                count++;
                pt = model.smoothingBuffer[i];
                totalX += pt.x;
                totalY += pt.y;
                totalTime += pt.timespan
            }
            return {
                x: totalX / count,
                y: totalY / count,
                timespan: totalTime / count
            }
        }
        return null;
    }

    private static updateVisiblePoints = (model: InkDraw): InkDraw =>  {
        let p = InkDrawSmoothReducer.getAveragePoint(0, model);

        if (p) {
            // append to the smoothed part of the path that will not change
            const committedPoints = [...model.committedPoints, p];

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            const extrapolated : TemporalPoint[] = [];
            for (let offset = 2; offset < model.smoothingBuffer.length; offset += 2) {
                p = InkDrawSmoothReducer.getAveragePoint(offset, model)
                if (p != null)
                    extrapolated.push(p);
            }

            return {
                ...model,
                projectedPoints: [...committedPoints, ...extrapolated],
                committedPoints: committedPoints
            }
        }

        return model
    }

    public static mouseDown = (model: InkDraw, p: Point): InkDraw => {
        model = {
            ...model,
            smoothingBuffer: [],
            projectedPoints: [],
            committedPoints: [],
            startedAt: Date.now(),
            tracking:  true
        }

        model = InkDrawSmoothReducer.appendToSmoothingBuffer(p, model);
        InkDrawSmoothReducer.updateVisiblePoints(model);

        return {
            ...model,
        }
    };

    public static mouseMove = (model: InkDraw, p: Point): InkDraw => {
        if (model.tracking) {
            model = InkDrawSmoothReducer.appendToSmoothingBuffer(p, model);
            model = InkDrawSmoothReducer.updateVisiblePoints(model);
        }
        return model;
    };

    public static mouseUp = (model: InkDraw, _: Point): InkDraw => {
        return {
            ...model,
            tracking: false
        }
    };



}

