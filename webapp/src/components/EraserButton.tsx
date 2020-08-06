import React from 'react';

export interface Props {
    active: boolean
    onClick: () => void
}
  

const EraserButton: React.FC<Props> = (props) => {
    const active =  props.active ? " selectedToolbarButton" : " unselectedToolbarButton";
    return (
        <button
            className={"toolbarButton unselectedToolbarButton" + active}
            id="erase"
            aria-label="Content Creation Toolbar - Ink Eraser"
            aria-selected="false"
            role="tab"
            title="Eraser"
            onClick={props.onClick}
        >
            <svg version="1.1" id="Eraser" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox={"0 "+ (props.active ? "-8": "-24") + " 96 96"}>
                <rect className="eraser-0" width="96" height="96"/>
                <g>
                    <path className="eraser-1" d="M38,0h20c4.4,0,8,3.6,8,8v16H30V8C30,3.6,33.6,0,38,0z"/>
                    <rect x="28" y="58" className="eraser-2" width="40" height="38"/>
                    <polygon className="eraser-3" points="30,22 66,22 68,24 68,60 28,60 28,24 "/>
                        <linearGradient id="barrel_highlight_1_" gradientUnits="userSpaceOnUse" x1="36.1318" y1="-1008.9948" x2="60.0228" y2="-1008.9948" gradientTransform="matrix(1 0 0 -1 0 -931.9948)">
                            <stop offset="0.16" stopColor="#FFFFFF" stopOpacity="0"/>
                            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7"/>
                            <stop offset="0.84" stopColor="#FFFFFF" stopOpacity="0"/>
                        </linearGradient>
                    <polygon className="eraser-4" points="48.2,58 48,58 36,58 36,96 48,96 48.2,96 60,96 60,58 	"/>
                        <linearGradient id="metal_highlight_1_" gradientUnits="userSpaceOnUse" x1="38.112" y1="-972.9948" x2="58.2844" y2="-972.9948" gradientTransform="matrix(1 0 0 -1 0 -931.9948)">
                            <stop offset="0.16" stopColor="#FFFFFF" stopOpacity="0"/>
                            <stop offset="0.5" stopColor="#FFFFFF"/>
                            <stop offset="0.84" stopColor="#FFFFFF" stopOpacity="0"/>
                        </linearGradient>
                    <polygon className="eraser-5" points="48.2,22 48,22 36,22 36,60 48,60 48.2,60 60,60 60,22 	"/>
                </g>
                <path d="M66,22V8c0-4.4-3.6-8-8-8H38c-4.4,0-8,3.6-8,8v14l-2,2v72h2V60h36v36h2V24L66,22z M32,8c0-3.2,2.6-6,5.8-6H38
                    h20c3.2,0,6,2.6,6,5.8V8v14H32V8z M30,58V24.8l0.8-0.8h34.4l0.8,0.8V58H30z"/>
            </svg>
        </button>   
    )
 }

 export default EraserButton;