import React from 'react';
import PencilButton from './PencilButton';
import PanZoomButton from './PanZoomButton';
import EraserButton from './EraserButton';
import {CanvasToolbarSelection} from "../models/DrawModels";


export interface Props {
    currentTool: CanvasToolbarSelection
    selectTool: (tool: CanvasToolbarSelection) => void

}

const CanvasToolbar: React.FC<Props> = (props) => {
    return (
        <div id="chrome" className="embedded">
            <div id="penCalloutToastContainer" className="toastContainer">
                <div id="pens" className="chromeContainer embedded" role="tablist">
                    <PanZoomButton/>
                    <PencilButton color="black" active={props.currentTool === CanvasToolbarSelection.Black} onClick={() => props.selectTool(CanvasToolbarSelection.Black)}/>
                    <PencilButton color="red" active={props.currentTool === CanvasToolbarSelection.Red} onClick={() => props.selectTool(CanvasToolbarSelection.Red)}/>
                    <PencilButton color="green" active={props.currentTool === CanvasToolbarSelection.Green} onClick={() => props.selectTool(CanvasToolbarSelection.Green)}/>
                    <PencilButton color="blue" active={props.currentTool === CanvasToolbarSelection.Blue} onClick={() => props.selectTool(CanvasToolbarSelection.Blue)}/>
                    <EraserButton/>
                </div>
            </div>
        </div>
    );
}

export default CanvasToolbar;