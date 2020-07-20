import React, { useState, useRef } from 'react';
import CSS from 'csstype';

export interface Props {
}

const DrawingCanvas: React.FC<Props> = (props) => {

    const svgParentStyles: CSS.Properties = {
        overflow: 'hidden'
    };

    const mainStyles: CSS.Properties = {
        transform: 'matrix(0.4637, 0, 0, 0.4637, 49.4283, -41.1269)',
        transformOrigin: '50% 50%'
    };

    const strokeWidth = "2";

    const [cmbBufferSize] = useState(1);
    const [path, setPath] = useState<SVGPathElement | null>(null);
    const [strPath, setStrPath] = useState<string>("null");
    // Contains the last positions of the mouse cursor
    const [buffer, setBuffer] = useState<{ x: number; y: number }[]>([]);


    const boundRef = useRef<HTMLElement>(null);
    let svgContainerRef = useRef<SVGSVGElement>(null);

    const appendToBuffer = function (pt: { x: number; y: number }) {
        buffer.push(pt);
        while (buffer.length > cmbBufferSize) {
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
        if (len % 2 === 1 || len >= cmbBufferSize) {
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
        return {x: 0, y: 0};
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
                     viewBox="-800 -1386.689208984375 3480.512939453125 3186.689208984375"
                     height="3186.689208984375"
                     width="3480.512939453125">
                    <g>
                        <g transform="matrix(1 0 0 1 940.256469727 206.655395508)">
                            <defs>
                                <pattern patternUnits="userSpaceOnUse" height="48" width="48" y="0" x="0" id="Neutral">
                                    <g transform="matrix(1 0 0 1 24 24)">
                                        <rect fill="#FFFFFF" stroke="none" height="48" width="48" y="-24" x="-24"/>
                                    </g>
                                </pattern>
                            </defs>
                            <rect fill="url(#Neutral)" stroke="none" height="3186.689208984375"
                                  width="3480.512939453125" y="-1593.3446044921875" x="-1740.2564697265625"/>
                        </g>
                        <g>
                            <g transform="matrix(1 0 0 1 438.161987305 84.197814941)">
                                <g transform="matrix(0.0078125 0 0 0.0078125 0 0)">
                                    <polyline id="1574a03e0b06e900"
                                              points="0,0 0,1985 0,3966 -101,5438 -312,6905 -525,8078 -704,9254 -811,11251 -944,13242 -1119,14607 -1309,15965 -1505,17917 -1569,19864 -1850,22927 -2248,25944 -2531,28880 -2717,31805 -2740,36609 -2712,41402 -2713,48617 -2713,55828 -2669,56326 -2566,56815 -2363,57802 -2290,59717 -2325,61639 -2346,62804 -2314,63954 -2192,64593 -2013,65203 -1872,65561 -1783,65716 -1680,65857 -1563,65984 -1428,66100 -1104,66301 -258,66656 599,66966 1421,67218 2257,67380 3968,67628 6440,67983 8948,68182 11904,68224 14870,68293 20213,68671 25560,68956 33404,69017 41262,68981 46287,68979 51329,68979 57125,68795 62931,68583 65794,68593 68654,68574 71407,68394 74151,68213 77128,68187 80095,68205 80610,68187 80869,68152 81114,68089 81338,67989 81438,67923 81529,67844 81609,67753 81677,67647 81733,67525 81774,67388 81849,66855 81858,66302 81805,65204 81756,61564 81768,57935 81701,56874 81526,55825 81018,53760 79655,48469 78373,43162 77779,40734 77049,38352 76066,35553 75066,32768 74471,30879 73951,28976 73414,26865 72964,24726 72724,23454 72512,22180 72251,20745 71944,19330 71712,17788 71645,16226 71692,13095 71696,8861 71692,4628 71745,4042 71864,3464 72072,2295 72117,1558 72098,1187 72066,1011 72013,847 71968,753 71912,671 71848,601 71776,541 71697,491 71612,449 71429,386 70652,244 69399,-109 68127,-364 67028,-420 66474,-427 66404,-427 66335,-427 66196,-427 65918,-424 63708,-389 63616,-389 63525,-391 63342,-399 62980,-429 62263,-528 60831,-736 59503,-940 58183,-1135 56586,-1180 55004,-1322 53613,-1512 52221,-1565 51310,-1634 50411,-1794 48632,-2181 47427,-2327 46817,-2356 46512,-2362 46359,-2364 46282,-2364 46206,-2364 43766,-2325 40087,-2320 39166,-2320 38936,-2320 38821,-2320 38706,-2320 38246,-2320 36404,-2321 32721,-2324 30881,-2325 29961,-2325 29501,-2325 29272,-2325 29157,-2325 29042,-2325 28921,-2323 28800,-2318 28556,-2298 28066,-2227 27115,-2013 26321,-1762 25928,-1647 25516,-1572 24845,-1503 24173,-1377 23086,-1181 21971,-1123 21831,-1122 21761,-1122 21691,-1123 21410,-1126 20850,-1138 19743,-1161 19669,-1160 19595,-1158 19448,-1148 19157,-1110 18578,-992 17408,-783 16348,-744 16082,-742 15949,-741 15882,-741 15816,-742 15282,-746 13152,-776 10054,-776 9957,-776 9860,-776 9666,-776 9278,-776 8503,-776 6951,-776 3852,-775 2306,-775 1534,-775 1148,-775 956,-775 860,-775 763,-775 593,-775 431,-775"
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
