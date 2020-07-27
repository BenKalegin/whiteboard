import React, { useRef } from 'react'
import CSS from 'csstype'
import {Figure as FigureModel, MouseHandler} from '../stores/Models'
import  Figure  from './Figure'


export interface Props {
    figures: FigureModel[]
    activePenColor: string
    mouseHandler: MouseHandler
}

const DrawingCanvas: React.FC<Props> = (props) => {

    const svgParentStyles: CSS.Properties = {
        overflow: 'hidden'
    };

    const mainStyles: CSS.Properties = {
        transformOrigin: '50% 50%'
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

    return (
        <div id="svgParent" className="flexAlignCenter" style={svgParentStyles}>
            <main id="svg"
                  ref={boundRef}
                  aria-label="Whiteboard Canvas. Capture your ideas and collaborate with others"
                  style={mainStyles}>
                <div id="ucParent" className="flexAlignCenter"/>
                <svg aria-hidden="true"
                     onMouseDown={(e) => props.mouseHandler.MouseDown(getMousePosition(e))}
                     onMouseMove={(e) => props.mouseHandler.MouseMove(getMousePosition(e))}
                     onMouseUp={(e) => props.mouseHandler.MouseUp(getMousePosition(e))}
                     xmlns="http://www.w3.org/2000/svg"
                    //  viewBox="0 0 1000 1000"
                     height="1000"
                     width="1000">
                    <g id="canvas-decorators">
                        <polyline id="1574a03e0b06e900"
                                  points="0,0 100,100 100, 0"
                                  fill="none" strokeLinejoin="round" strokeLinecap="round"
                                  strokeWidth="512" stroke="rgba(0,105,191,1)"/>
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
