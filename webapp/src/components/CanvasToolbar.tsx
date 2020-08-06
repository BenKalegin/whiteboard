import React from 'react';
import PencilButton from './PencilButton';
import PanZoomButton from './PanZoomButton';
import EraserButton from './EraserButton';
import {CanvasToolbarSelection} from "../models/DrawModels";
import {useSelector} from "react-redux";
import {ApplicationState} from "../reducers/Reducers";
import SmoothEnhancement from "./SmoothEnhancement";
import PredictEnhancement from "./PredictEnhancement";

export interface Props {
    selectTool: (tool: CanvasToolbarSelection) => void
}

const CanvasToolbar: React.FC<Props> = (props) => {
    const [smoothWindow, setSmoothWindow] = React.useState(4);

    const toolSelected = useSelector((state: ApplicationState) => state.canvas.toolSelected)

    return (
        <div className="chromeTop chrome">
            <div/>
            <div/>
            <div>
                <div id="canvasToolbar" aria-label="Content Creation Toolbar" role="toolbar">
                    <div className="toolbar toolbarTop">
                        <PanZoomButton/>
                        <PencilButton color="black" active={toolSelected === CanvasToolbarSelection.Black} first={true} onClick={() => props.selectTool(CanvasToolbarSelection.Black)}/>
                        <PencilButton color="red" active={toolSelected === CanvasToolbarSelection.Red} first={false} onClick={() => props.selectTool(CanvasToolbarSelection.Red)}/>
                        <PencilButton color="green" active={toolSelected === CanvasToolbarSelection.Green} first={false} onClick={() => props.selectTool(CanvasToolbarSelection.Green)}/>
                        <PencilButton color="blue" active={toolSelected === CanvasToolbarSelection.Blue} first={false} onClick={() => props.selectTool(CanvasToolbarSelection.Blue)}/>
                        <EraserButton active={toolSelected === CanvasToolbarSelection.Eraser} onClick={() => props.selectTool(CanvasToolbarSelection.Eraser)}/>
                    </div>
                </div>
            </div>
            <div id="canvasToolbar" aria-label="smoothing setting" role="toolbar">
                <div className="toolbar toolbarTop">
                    <SmoothEnhancement smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}/>
                </div>
            </div>
            <div/>
            <div/>
        </div>
    );
}

export default CanvasToolbar;