import React, { useRef } from 'react'
import CSS from 'csstype'
import {CanvasToolbarSelection, Point} from '../models/DrawModels'
import  Figure  from './Figure'
import {useDispatch, useSelector} from "react-redux";
import {ApplicationState} from "../reducers/Reducers";
import {CanvasAction} from "../actions/Actions";

const DrawingCanvas: React.FC = () => {

    const tool = useSelector((state: ApplicationState) => state.canvas.toolSelected)
    const figures = useSelector((state: ApplicationState) => state.canvas.figures)
    const dispatch = useDispatch()

    const svgParentStyles: CSS.Properties = {
        overflow: 'hidden'
    };

    const boundRef = useRef<HTMLElement>(null);

    const mouseDown = (p: Point): void => {
        dispatch({
            type: CanvasAction.CanvasMouseDown,
            payload: {point: p}
        })
    }

    const mouseMove = (p: Point): void => {
        dispatch({
            type: CanvasAction.CanvasMouseMove,
            payload: {point: p}
        })
    }

    const mouseUp = (p: Point): void => {
        dispatch({
            type: CanvasAction.CanvasMouseUp,
            payload: {point: p}
        })
    }

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
                     onMouseDown={(e) => mouseDown(getMousePosition(e))}
                     onMouseMove={(e) => mouseMove(getMousePosition(e))}
                     onMouseUp={(e) => mouseUp(getMousePosition(e))}
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
                        {figures.map((f, i) =>
                            <Figure key={i} model={f}/>
                        )}
                    </g>
                </svg>
            </main>
        </div>
    )
};

export default DrawingCanvas;
