import React, { useState, useRef } from 'react';
import CSS from 'csstype';

export interface Props {
    smoothWindow: number
}

const DrawingCanvas: React.FC<Props> = (props) => {

    const svgParentStyles: CSS.Properties = {
        overflow: 'hidden'
    };

    const mainStyles: CSS.Properties = {
        // transform: 'matrix(0.4637, 0, 0, 0.4637, 49.4283, -41.1269)',
        transformOrigin: '50% 50%'
    };

    const strokeWidth = "3";

    const [path, setPath] = useState<SVGPathElement | null>(null);
    const [strPath, setStrPath] = useState<string>("null");
    // Contains the last positions of the mouse cursor
    const [buffer, setBuffer] = useState<{ x: number; y: number }[]>([]);


    const boundRef = useRef<HTMLElement>(null);
    let svgContainerRef = useRef<SVGSVGElement>(null);

    const appendToBuffer = function (pt: { x: number; y: number }) {
        buffer.push(pt);
        while (buffer.length > props.smoothWindow) {
            buffer.shift();
        }
        setBuffer(buffer)
    };

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

    const mouseDownHandler = (e: React.MouseEvent) => {

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#000");
        path.setAttribute("stroke-width", strokeWidth);
        setPath(path);
        setBuffer([]);
        let pt = getMousePosition(e);
        appendToBuffer(pt);
        const strPath = "M" + pt.x + " " + pt.y
        setStrPath(strPath)
        path.setAttribute("d", strPath)
        svgContainerRef.current?.appendChild(path)
    };

    // Calculate the average point, starting at offset in the buffer
    const getAveragePoint = (offset: number) => {
        const len = buffer.length;
        if (len % 2 === 1 || len >= props.smoothWindow) {
            let totalX = 0;
            let totalY = 0;
            let pt, i;
            let count = 0;
            for (i = offset; i < len; i++) {
                count++;
                pt = buffer[i];
                totalX += pt.x;
                totalY += pt.y;
            }
            return {
                x: totalX / count,
                y: totalY / count
            }
        }
        return null;
    };

    const updateSvgPath = () => {
        let pt = getAveragePoint(0);

        if (pt) {
            // Get the smoothed part of the path that will not change
            const newPath = strPath + " L" + pt.x + " " + pt.y;
            setStrPath(newPath)

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            let tmpPath = "";
            for (let offset = 2; offset < buffer.length; offset += 2) {
                pt = getAveragePoint(offset);
                if (pt != null)
                    tmpPath += " L" + pt.x + " " + pt.y;
            }

            // Set the complete current path coordinates
            path?.setAttribute("d", newPath + tmpPath);
        }
    };
    const mouseMoveHandler = (e: React.MouseEvent) => {
        if (path) {
            appendToBuffer(getMousePosition(e));
            updateSvgPath();
        }
    };

    const mouseUpHandler = (e: React.MouseEvent) => {
        if (path) {
            setPath(null)
        }
        if (buffer.length > 0) 
            setBuffer([])
    };

    return (
        <div id="svgParent" className="flexAlignCenter" style={svgParentStyles}>
            <main id="svg"
                  ref={boundRef}
                  aria-label="Whiteboard Canvas. Capture your ideas and collaborate with others"
                  style={mainStyles}>
                <div id="ucParent" className="flexAlignCenter"/>
                <svg aria-hidden="true"
                     onMouseDown={mouseDownHandler} onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler}
                     ref={svgContainerRef}
                     xmlns="http://www.w3.org/2000/svg"
                    //  viewBox="0 0 1000 1000"
                     height="1000"
                     width="1000">
                    <g>
                        <g>wB
                            <defs>
                                <pattern patternUnits="userSpaceOnUse" height="48" width="48" y="0" x="0" id="Neutral">
                                    <g>
                                        <rect fill="#FFFFFF" stroke="none" height="48" width="48" y="-24" x="-24"/>
                                    </g>
                                </pattern>
                            </defs>
                            <rect fill="url(#Neutral)" stroke="none" height="3186.689208984375"
                                  width="3480.512939453125" y="-1593.3446044921875" x="-1740.2564697265625"/>
                        </g>
                        <g>
                            <g>
                                <g>
                                    <polyline id="1574a03e0b06e900"
                                              points="0,0 100,100 100, 0"
                                              fill="none" strokeLinejoin="round" strokeLinecap="round"
                                              strokeWidth="512" stroke="rgba(0,105,191,1)"/>
                                </g>
                            </g>
                        </g>
                    </g>
                    <g>
                        <g transform="matrix(1, 0, 0, 1, 0, 0)">
                            <rect height="1" width="1" y="0" x="0" className="anchor"/>
                        </g>
                        <g transform="matrix(1, 0, 0, 1, 360, 0)">
                            <rect height="1" width="1" y="0" x="0" className="anchor"/>
                        </g>
                    </g>
                </svg>
                <script src="/wasm/InkCore.js" type="text/javascript"/>
            </main>
        </div>
    )
};

export default DrawingCanvas;
