import React from 'react';
import CanvasToolbar, {CanvasToolbarSelection} from './CanvasToolbar';
import DrawingCanvas, {MouseHandler} from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import '../App.css';
import {Point} from "../stores/DrawModels";
import {CanvasAction} from "../stores/Actions";
import {ApplicationState} from "../stores/Reducers";
import {useDispatch, useSelector} from "react-redux";

export default function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);

  const toolSelected = useSelector((state: ApplicationState) => state.canvas.toolSelected)
  const figures = useSelector((state: ApplicationState) => state.canvas.figures)
  const predictions = useSelector((state: ApplicationState) => state.predictions.quickDraw.topMatches)
  const dispatch = useDispatch()

  const selectTool = (tool: CanvasToolbarSelection) => {
    dispatch( {
      type: CanvasAction.ToolSelected,
      payload: { tool: tool }
    })
  };

  const mouseHandler : MouseHandler = {
    MouseDown(p: Point): void {
      dispatch( {
        type: CanvasAction.CanvasMouseDown,
        payload: {point: p }
      })
    },

    MouseMove(p: Point): void {
      dispatch( {
        type: CanvasAction.CanvasMouseMove,
        payload: {point: p }
      })
    },

    MouseUp(p: Point): void {
      dispatch( {
        type: CanvasAction.CanvasMouseUp,
        payload: {point: p }
      })
    }
  }


  return (
      <div className="App">
        <CanvasToolbar currentTool={toolSelected} selectTool={tool => selectTool(tool)}/>
        <DrawingCanvas figures={figures} mouseHandler={mouseHandler}/>
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}
                         predictions={predictions}/>
      </div>
  );
}

