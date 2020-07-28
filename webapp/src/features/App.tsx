import React, {useState} from 'react';
import useFetch from 'use-http'
import CanvasToolbar, {CanvasToolbarSelection} from './CanvasToolbar';
import DrawingCanvas from './DrawingCanvas';
import EnhancementTabs from './EnhancementTabs';
import '../App.css';
import {inkPayload} from '../helpers/InputTools';
import {Curve, Figure, TemporalPoint} from "../stores/Models";
import {DefaultInkDrawingModel, InkDrawingModel, InkDrawingMouseHandler} from "../helpers/InkDrawingMouseHandler";
import {DoNothingMouseHandler} from "../helpers/DoNothingMouseHandler";

function App() {
  const [smoothWindow, setSmoothWindow] = React.useState(1);
  const [predictions, setPredictions] = React.useState<string[]>([]);
  const [toolSelected, setToolSelected] = useState(CanvasToolbarSelection.None);
  const [mouseHandlerModel, setMouseHandlerModel] =  useState<InkDrawingModel>(DefaultInkDrawingModel);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [figureIdentifier, setFigureIdentifier] = useState(1)

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

  const fetchPredictions = async (points: TemporalPoint[]) => {
    const data = await post('', inkPayload(1000, 1000, points) )
    if (!response.ok) {
      console.error("request failed", response.headers)
    }else if (data[0] !== "SUCCESS") {
      console.error("request failed", data)
    }else
      setPredictions(data[1][0][1])
  }

  const isPen = (tool: CanvasToolbarSelection) => {
    switch (tool) {
      case CanvasToolbarSelection.Black:
      case CanvasToolbarSelection.Blue:
      case CanvasToolbarSelection.Green:
      case CanvasToolbarSelection.Red:
        return true
      default:
        return false
    }
  }
  const selectTool = (tool: CanvasToolbarSelection) => {
    setToolSelected(tool);
    if (isPen(tool)) {

        setFigureIdentifier(figureIdentifier + 1)

        const newFigure: Figure  = {
          id: "Fig" + figureIdentifier,
          offset: {x: 0, y: 0},
          curves: [],
          curveTimes: []
        }
        setFigures([...figures, newFigure])
        setMouseHandlerModel({ ...DefaultInkDrawingModel, smoothFactor: smoothWindow})
    }
  }

  function UpdateRecentCurve(model: InkDrawingModel) {
    const lastFigure = figures.pop()!
    let curves = lastFigure.curves;
    const lastCurve : Curve = curves.pop()!
    lastCurve.polyLinePoints = model.ProjectedPoints
    lastCurve.pointTimes = model.ProjectedPoints.map(p => p.timespan)
    setFigures([...figures, {...lastFigure, curves: [...curves, lastCurve]}])
  }

  const startNewCurve = (model: InkDrawingModel) => {
    const lastFigure = figures.pop()!;
    const curve : Curve = {
      id: "Crv" + (lastFigure.curves.length + 1).toString(),
      polyLinePoints: [],
      pointTimes: [],
      strokeColor: penColor(),
      strokeWidth: 3
    }

    curve.polyLinePoints = model.ProjectedPoints
    curve.pointTimes = model.ProjectedPoints.map(p => p.timespan)
    setFigures([...figures, {...lastFigure, curves: [...lastFigure.curves, curve]}])
  }

  const mouseHandler = isPen(toolSelected) ?  new InkDrawingMouseHandler(mouseHandlerModel, {
      Changed: (model: InkDrawingModel) => { setMouseHandlerModel(model); UpdateRecentCurve(model)},
      Finished: (points) => { fetchPredictions(points) },
      Started: (model: InkDrawingModel) => {startNewCurve(model)}
  }) : new DoNothingMouseHandler()

  if (toolSelected === CanvasToolbarSelection.None) {
    selectTool(CanvasToolbarSelection.Black)
  }
  return (
    <div className="App">
        <CanvasToolbar currentTool={toolSelected} selectTool={(tool) => selectTool(tool)}/>
        <DrawingCanvas activePenColor={penColor()} mouseHandler={mouseHandler} figures={figures} />
        <EnhancementTabs smoothWindow={smoothWindow} smoothWindowChanged={(n: number) => setSmoothWindow(n)} predictions={predictions} />
    </div>
  );
}

export default App;
