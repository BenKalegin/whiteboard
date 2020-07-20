import React from 'react';
import CanvasToolbar from './CanvasToolbar';
import DrawingCanvas from './DrawingCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
        <CanvasToolbar/>
        <DrawingCanvas/>
    </div>
  );
}

export default App;
