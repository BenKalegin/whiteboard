import React, { useState }  from 'react';
import useFetch from 'use-http'
import CanvasToolbar, { CanvasToolbarSelection } from './CanvasToolbar';
import DrawingCanvas from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import './App.css';
import { inkPayload } from './InputTools';

function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);
  const [toolSelected, selectTool] = useState(CanvasToolbarSelection.None);
  const { get, post, response, loading, error } = useFetch('https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8')

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
    await post('', inkPayload(1000, 1000, points) )
    // if if (response.ok) setPredictions([...predictions])
    console.log(response.ok)
  }


  return (
    <div className="App">
        <CanvasToolbar currentTool={toolSelected} selectTool={(tool) => selectTool(tool)}/>
        <DrawingCanvas smoothWindow={smoothWindow} penColor={penColor()} figureDrawn={(p) => figureDrawn(p)}/>
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}/>
    </div>
  );
}

export default App;
