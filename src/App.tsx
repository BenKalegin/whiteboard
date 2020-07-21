import React, { useState }  from 'react';
import CanvasToolbar, { CanvasToolbarSelection } from './CanvasToolbar';
import DrawingCanvas from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import './App.css';

function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);
  const [toolSelected, selectTool] = useState(CanvasToolbarSelection.None);
  const penColor = () => {
    switch (toolSelected) {
      case CanvasToolbarSelection.Black: return "black"
      case CanvasToolbarSelection.Blue: return "blue"
      case CanvasToolbarSelection.Green: return "green"
      case CanvasToolbarSelection.Red: return "red"      
  
      default: return "black"
    }
  }


  return (
    <div className="App">
        <CanvasToolbar currentTool={toolSelected} selectTool={(tool) => selectTool(tool)}/>
        <DrawingCanvas smoothWindow={smoothWindow} penColor={penColor()}/>
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}/>
    </div>
  );
}

export default App;
