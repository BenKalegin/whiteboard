import React from 'react';

export interface Props {
    smoothWindow: number
    smoothWindowChanged: (window: number) => void
}

const SmoothEnhancement: React.FC<Props> = (props) => {

return (
    <div className="toolbarText">
        <label htmlFor="cmbBufferSize">Smoothing:</label>
        <select id="cmbBufferSize" value={props.smoothWindow} onChange={(e) => props.smoothWindowChanged(parseInt(e.target.value))}>
            <option value="1">1 - No</option>
            <option value="4">4 - Sharp</option>
            <option value="8">8 - Smooth</option>
            <option value="12">12 - Very smooth</option>
            <option value="16">16 - Super smooth</option>
            <option value="20">20 - Hyper smooth</option>
        </select>
    </div>
)};


export default SmoothEnhancement;