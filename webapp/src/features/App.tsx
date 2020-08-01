import React from 'react';
import CanvasToolbar, {CanvasToolbarSelection} from './CanvasToolbar';
import DrawingCanvas, {MouseHandler} from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import '../App.css';
import {Point} from "../stores/DrawModels";
import {AppContext, AppProvider} from "../stores/Context";
import {CanvasAction} from "../stores/Actions";

export default function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);
  const { state ,dispatch } = React.useContext(AppContext);

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
      <AppProvider>
        <div className="App">
          <CanvasToolbar currentTool={state.canvas.toolSelected} selectTool={tool => selectTool(tool)}/>
          <DrawingCanvas figures={state.canvas.figures} mouseHandler={mouseHandler}/>
          <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}
                           predictions={state.predictions.quickDraw.topMatches}/>
        </div>
      </AppProvider>
  );
}

