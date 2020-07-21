import React, { useState, useRef } from 'react';
import CSS from 'csstype';
import SmoothEnhancement from './SmoothEnhancement';

export interface Props {
    smoothWindow: number
    smoothWindowChanged: (window: number) => void    
}

const EnhancementTabs: React.FC<Props> = (props) => {

    const onTabClick = (e: React.MouseEvent<HTMLButtonElement>, tabName: string) => {
        const tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            const tab = tabcontent[i] as HTMLDivElement
            tab.setAttribute("style", "display=none");
        }
        const tabLinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tabLinks.length; i++) {
          tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName)?.setAttribute("style", "display: block")
        e.currentTarget.className += " active";
    }

    return (
        <div id="footer">
            <p>There are some tabs below with whiteboard drawing enhancements:</p>

            <div className="tab">
            <button className="tablinks" onClick={(e) => onTabClick(e, "simplify")}>Simplify line</button>
            <button className="tablinks" onClick={(e) => onTabClick(e, "predict")}>Predict Figure</button>
            </div>

            <div id="simplify" className="tabcontent">
                <SmoothEnhancement smoothWindow={props.smoothWindow} smoothWindowChanged={props.smoothWindowChanged}/>
            </div>

            <div id="predict" className="tabcontent">
            <h3>Predict</h3>
            <p>Predict what was being drawing and suggest ready made picture.</p> 
            </div>
        </div>        
    );
}


export default EnhancementTabs;