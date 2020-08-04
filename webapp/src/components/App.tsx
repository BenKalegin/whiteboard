import React, {useEffect, useState} from 'react';
import CanvasToolbar from './CanvasToolbar';
import DrawingCanvas, {MouseHandler} from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import '../App.css';
import {CanvasToolbarSelection, Point} from "../models/DrawModels";
import {ApplicationAction, applicationMsg, CanvasAction} from "../actions/Actions";
import {ApplicationState} from "../reducers/Reducers";
import {useDispatch, useSelector} from "react-redux";

export default function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);

  const figures = useSelector((state: ApplicationState) => state.canvas.figures)
  const predictions = useSelector((state: ApplicationState) => state.predictions.quickDraw.topMatches)
  const dispatch = useDispatch()
  const [isStarted] = useState(false)

  useEffect(() => {
    if (!isStarted) {
      dispatch(applicationMsg(ApplicationAction.StartApplication, {}))
    }
  },    // having readonly dependency ensures that effect will run only on componentDidMount and not on every updates.
      [isStarted, dispatch])


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
        <CanvasToolbar selectTool={tool => selectTool(tool)}/>
        <DrawingCanvas figures={figures} mouseHandler={mouseHandler}/>
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}
                         predictions={predictions}/>
      </div>
  );
}

