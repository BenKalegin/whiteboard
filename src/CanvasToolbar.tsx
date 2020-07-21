import React from 'react';
import PencilButton from './PencilButton';
import PanZoomButton from './PanZoomButton';
import EraserButton from './EraserButton';


export interface Props {
    currentTool: CanvasToolbarSelection
    selectTool: (tool: CanvasToolbarSelection) => void

}

export enum CanvasToolbarSelection {
    None, 
    PanZoom,
    Black,
    Red,
    Green,
    Blue,
    Eraser
}

const CanvasToolbar: React.FC<Props> = (props) => {
    return (
        <div id="chrome" className="embedded">
            <div id="penCalloutToastContainer" className="toastContainer">
                <div id="pens" className="chromeContainer embedded" role="tablist">
                    <PanZoomButton></PanZoomButton>
                    <PencilButton color="black" active={props.currentTool === CanvasToolbarSelection.Black} onClick={() => props.selectTool(CanvasToolbarSelection.Black)}></PencilButton>
                    <PencilButton color="red" active={props.currentTool === CanvasToolbarSelection.Red} onClick={() => props.selectTool(CanvasToolbarSelection.Red)}></PencilButton>
                    <PencilButton color="green" active={props.currentTool === CanvasToolbarSelection.Green} onClick={() => props.selectTool(CanvasToolbarSelection.Green)}></PencilButton>
                    <PencilButton color="blue" active={props.currentTool === CanvasToolbarSelection.Blue} onClick={() => props.selectTool(CanvasToolbarSelection.Blue)}></PencilButton>
                    <EraserButton></EraserButton>
                </div>
            </div>
        </div>
    );
}

export default CanvasToolbar;