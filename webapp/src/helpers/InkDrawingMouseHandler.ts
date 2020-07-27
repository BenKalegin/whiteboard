import {MouseHandler, Point, TemporalPoint} from "../stores/Models";

export interface InkDrawingModel {
    SmoothingBuffer: TemporalPoint[]

    /**
     * Points that are already part of the curve and will not change.
     */
    CommittedPoints: TemporalPoint[]

    /**
     * Projected points
     */
    ProjectedPoints: TemporalPoint[]

    /**
     * time when this ink was started to draw
     */
    startedAt: number
    smoothFactor: number
    tracking: boolean
}

interface InkDrawingEvents {
    Changed(model: InkDrawingModel): void

    Finished(ProjectedPoints: TemporalPoint[]): void
}

export const DefaultInkDrawingModel: InkDrawingModel = {
    CommittedPoints: [],
    ProjectedPoints: [],
    smoothFactor: 1,
    SmoothingBuffer: [],
    startedAt: 0,
    tracking: false
}



export class InkDrawingMouseHandler implements MouseHandler {

    constructor(private model: InkDrawingModel, private events: InkDrawingEvents) {
    }

    appendToBuffer = (p: Point) => {
        let buffer = [...this.model.SmoothingBuffer, { ...p, timespan: Date.now() - this.model.startedAt}];
        if (buffer.length > this.model.smoothFactor) {
            buffer.shift();
        }
        this.model.SmoothingBuffer =  buffer;
    }

    /**
     * Calculate the average point, starting at offset in the smooth window in buffer
     */
    getAveragePoint = (offset: number) : TemporalPoint | null => {

        const smoothCount = this.model.SmoothingBuffer.length;
        if (smoothCount % 2 === 1 || smoothCount >= this.model.smoothFactor) {
            let totalX = 0;
            let totalY = 0;
            let totalTime = 0;
            let pt, i;
            let count = 0;
            for (i = offset; i < smoothCount; i++) {
                count++;
                pt = this.model.SmoothingBuffer[i];
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

    updateVisiblePoints = () => {
        let p = this.getAveragePoint(0);

        if (p) {
            // append to the smoothed part of the path that will not change
            this.model.CommittedPoints = [...this.model.CommittedPoints, p]

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            const extrapolated : TemporalPoint[] = [];
            for (let offset = 2; offset < this.model.SmoothingBuffer.length; offset += 2) {
                p = this.getAveragePoint(offset);
                if (p != null)
                    extrapolated.push(p);
            }

            this.model.ProjectedPoints = [...this.model.CommittedPoints, ...extrapolated]
        }
    }

    MouseDown = (p: Point): void => {
        this.model.SmoothingBuffer = []
        this.model.ProjectedPoints = []
        this.model.CommittedPoints = []
        this.model.startedAt = Date.now()
        this.model.tracking = true
        this.appendToBuffer(p);
        this.updateVisiblePoints();
        this.events.Changed(this.model)
    };

    MouseMove = (p: Point): void => {
        if (this.model.tracking) {
            this.appendToBuffer(p);
            this.updateVisiblePoints();
            this.events.Changed(this.model)
        }
    };

    MouseUp = (_: Point): void => {
        this.model.tracking = false
        this.events.Changed(this.model)
        this.events.Finished(this.model.ProjectedPoints);
    };



}

