import React from 'react';

export interface Props {
    smoothWindow: number
    smoothWindowChanged: (window: number) => void
}

const SmoothEnhancement: React.FC<Props> = (props) => {

return (
    <div>
        <h3>Smoothing</h3>
        <p>Simplifies the line by averaging specified number of points.</p>

    <div id="divSmoothingFactor">
        <label htmlFor="cmbBufferSize">Buffer size:</label>
        <select id="cmbBufferSize" value={props.smoothWindow} onChange={(e) => props.smoothWindowChanged(parseInt(e.target.value))}>
            <option value="1">1 - No smoothing</option>
            <option value="4">4 - Sharp curves</option>
            <option value="8">8 - Smooth curves</option>
            <option value="12">12 - Very smooth curves</option>
            <option value="16">16 - Super smooth curves</option>
            <option value="20">20 - Hyper smooth curves</option>
        </select>
    </div>
    </div>
)};


export default SmoothEnhancement;