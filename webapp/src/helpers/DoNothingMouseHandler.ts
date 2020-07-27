import {MouseHandler, Point} from "../stores/Models";

export class DoNothingMouseHandler implements MouseHandler {
    MouseDown(p: Point): void {
    }

    MouseMove(p: Point): void {
    }

    MouseUp(p: Point): void {
    }
}