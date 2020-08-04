import React, { useRef } from 'react'
import CSS from 'csstype'
import {CanvasToolbarSelection, Figure as FigureModel, Point} from '../models/DrawModels'
import  Figure  from './Figure'
import {useSelector} from "react-redux";
import {ApplicationState} from "../reducers/Reducers";

export interface MouseHandler {
    MouseDown: (p: Point) => void
    MouseMove: (p: Point) => void
    MouseUp: (p: Point) => void
}

export interface Props {
    figures: FigureModel[]
    mouseHandler: MouseHandler
}

const DrawingCanvas: React.FC<Props> = (props) => {

    const tool = useSelector((state: ApplicationState) => state.canvas.toolSelected)

    const svgParentStyles: CSS.Properties = {
        overflow: 'hidden'
    };

    const boundRef = useRef<HTMLElement>(null);

    const getMousePosition = (e: React.MouseEvent) =>   {
        const bounds = boundRef.current;
        if (!bounds)
            return {x: 0, y: 0};

        const rect = bounds.getBoundingClientRect();

        return {
            x: e.pageX - rect.left,
            y: e.pageY - rect.top
        }
    };

    const toolSpecificCursor = tool === CanvasToolbarSelection.Eraser ? " eraseActive" : "";
    return (
        <div id="svgParent" className={"flexAlignCenter" + toolSpecificCursor} style={svgParentStyles}>
            <main id="svg"
                  ref={boundRef}
                  aria-label="Whiteboard Canvas. Capture your ideas and collaborate with others"
                  >
                <svg aria-hidden="true"
                     onMouseDown={(e) => props.mouseHandler.MouseDown(getMousePosition(e))}
                     onMouseMove={(e) => props.mouseHandler.MouseMove(getMousePosition(e))}
                     onMouseUp={(e) => props.mouseHandler.MouseUp(getMousePosition(e))}
                     xmlns="http://www.w3.org/2000/svg"
                    //  viewBox="0 0 1000 1000"
                     height="1000"
                     width="1000">
                    <g id="canvas-decorators">
                        <circle cx="0" cy="0" r="40" fill="rgba(0,105,191,1)" />
                        <circle cx="0%" cy="100%" r="40" fill="rgba(0,105,191,1)" />
                        <circle cx="100%" cy="0%" r="40" fill="rgba(0,105,191,1)" />
                        <circle cx="100%" cy="100%" r="40" fill="rgba(0,105,191,1)" />
                    </g>
                    <g id="canvas-figures">
                        {props.figures.map((f, i) =>
                            <Figure key={i} model={f}/>
                        )}
                    </g>
                </svg>
            </main>
        </div>
    )
};

export default DrawingCanvas;
