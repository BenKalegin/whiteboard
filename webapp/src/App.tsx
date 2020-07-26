import React, { useState }  from 'react';
import useFetch from 'use-http'
import CanvasToolbar, { CanvasToolbarSelection } from './CanvasToolbar';
import DrawingCanvas from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import './App.css';
import { inkPayload } from './InputTools';

function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);
  const [predictions, setPredictions] = React.useState<string[]>([]);
  const [toolSelected, selectTool] = useState(CanvasToolbarSelection.None);
  const { post, response } = useFetch('https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8')

  const penColor = () => {
    switch (toolSelected) {
      case CanvasToolbarSelection.Black: return "black"
      case CanvasToolbarSelection.Blue: return "blue"
      case CanvasToolbarSelection.Green: return "green"
      case CanvasToolbarSelection.Red: return "red"      
  
      default: return "black"
    }
  }

  const figureDrawn = async (points: { x: number; y: number; time: number }[]) => {
    const data = await post('', inkPayload(1000, 1000, points) )
    if (!response.ok) {
        console.error("request failed", response.headers)
    }else if (data[0] !== "SUCCESS") {
      console.error("request failed", data)
    }else
      setPredictions(data[1][0][1])
  }


  return (
    <div className="App">
        <CanvasToolbar currentTool={toolSelected} selectTool={(tool) => selectTool(tool)}/>
        <DrawingCanvas smoothWindow={smoothWindow} penColor={penColor()} figureDrawn={(p) => figureDrawn(p)}/>
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)} predictions={predictions} />
    </div>
  );
}

export default App;
