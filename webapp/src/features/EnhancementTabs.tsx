import React from 'react';
import SmoothEnhancement from './SmoothEnhancement';
import PredictEnhancement from './PredictEnhancement';


export interface Props {
    smoothWindow: number
    smoothWindowChanged: (window: number) => void
    predictions: string[]
}

const EnhancementTabs: React.FC<Props> = (props) => {

    const onTabClick = (e: React.MouseEvent<HTMLButtonElement>, tabName: string) => {
        const tabContent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabContent.length; i++) {
            const tab = tabContent[i] as HTMLDivElement
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
            <button className="tablinks" onClick={(e) => onTabClick(e, "simplify")}>Smooth</button>
            <button className="tablinks" onClick={(e) => onTabClick(e, "predict")}>Predict</button>
            <button className="tablinks" onClick={(e) => onTabClick(e, "shape")}>Autoshape</button>
            </div>

            <div id="simplify" className="tabcontent">
                <SmoothEnhancement smoothWindow={props.smoothWindow} smoothWindowChanged={props.smoothWindowChanged}/>
            </div>

            <div id="predict" className="tabcontent">
                <PredictEnhancement predictions={props.predictions} />
            </div>

            <div id="shape" className="tabcontent">
                <PredictEnhancement predictions={props.predictions} />
            </div>
        </div>
    );
}


export default EnhancementTabs;