import React from 'react';
import CanvasToolbar from './CanvasToolbar';
import DrawingCanvas from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import './App.css';

function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);


  return (
    <div className="App">
        <CanvasToolbar/>
        <DrawingCanvas smoothWindow={smoothWindow}/>
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)}/>
    </div>
  );
}

export default App;
