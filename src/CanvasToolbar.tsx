import React, { useState } from 'react';
import PencilButton from './PencilButton';
import PanZoomButton from './PanZoomButton';
import EraserButton from './EraserButton';


export interface Props {
}

enum CanvasToolbarSelection {
    None, 
    PanZoom,
    Black,
    Red,
    Green,
    Blue,
    Eraser
}

const CanvasToolbar: React.FC<Props> = (props) => {
    const [toolSelected, selectTool] = useState(CanvasToolbarSelection.None);
    return (
        <div id="chrome" className="embedded">
            <div id="penCalloutToastContainer" className="toastContainer">
                <div id="pens" className="chromeContainer embedded" role="tablist">
                    <PanZoomButton></PanZoomButton>
                    <PencilButton color="black" active={toolSelected === CanvasToolbarSelection.Black} onClick={() =>selectTool(CanvasToolbarSelection.Black)}></PencilButton>
                    <PencilButton color="red" active={toolSelected === CanvasToolbarSelection.Red} onClick={() =>selectTool(CanvasToolbarSelection.Red)}></PencilButton>
                    <PencilButton color="green" active={toolSelected === CanvasToolbarSelection.Green} onClick={() =>selectTool(CanvasToolbarSelection.Green)}></PencilButton>
                    <PencilButton color="blue" active={toolSelected === CanvasToolbarSelection.Blue} onClick={() =>selectTool(CanvasToolbarSelection.Blue)}></PencilButton>
                    <EraserButton></EraserButton>
                </div>
            </div>
        </div>
    );
}

export default CanvasToolbar;