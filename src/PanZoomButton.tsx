import React from 'react';

export interface Props {
}
  

const PanZoomButton: React.FC<Props> = (props) => {
    return (
        <button id="enablePanzoom" className="chrome-Button" aria-label="Move canvas tool" title="Move canvas tool">
            <svg className="enablePanzoomIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
            <path d="M4.1,17.1l3.4,3.4L6,22l-6-6l6-6l1.5,1.5l-3.4,3.4h6.6v2.1H4.1z M32,16l-5.9,5.9l-1.5-1.5l3.3-3.3h-6.6v-2.1h6.6l-3.4-3.4
                L26,10L32,16z M11.6,7.4l-1.5-1.5L16,0l6,6l-1.5,1.5l-3.4-3.4v6.6h-2.1V4.1L11.6,7.4z M20.5,24.5L22,26l-6,6l-6-6l1.5-1.5l3.4,3.4
                v-6.6h2.1v6.6L20.5,24.5z"></path>
            </svg>
        </button>    
    )
 }

 export default PanZoomButton;