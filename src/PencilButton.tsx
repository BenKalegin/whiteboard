import React from 'react';

export interface Props {
    color: string
    active: boolean
    onClick: () => void
  }
  

const PencilButton: React.FC<Props> = (props) => {
    const active =  props.active ? " activePen" : "";
    return (
<button 
    className={"chrome-Button pen embedded" + active}
    id="red" 
    aria-label="Content Creation Toolbar - Ink Red Pen" 
    aria-selected='false' 
    role="tab" 
    title="{props.color} Pen"
    onClick={props.onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -8 96 96">
        <g>
            <rect className="pen-0" width="96" height="96"></rect>
            <g>
                <g>
                    <polygon fill={props.color} points="68.004 96 28 96 29.004 58 67.004 58 68.004 96"></polygon>
                </g>
                <g>
                    <path fill={props.color} d="M55,14C52,4,50,0,47.999,0,46,0,44,4,41,14l.00287,2H54.99713Z"></path>
                </g>
                <g>
                    <path className="pen-1" d="M57.00287,16l-2-2h-14l-2,2s-9.16663,22.33325-10,42L29,60H67.00287V58C66.16949,38.33325,57.00287,16,57.00287,16Z"></path>
                </g>
            </g>
            <g>
                <polygon className="pen-2" points="36 59 36 96 60 96 60 59 36 59"></polygon>
                <polygon className="pen-3" points="41 15 38 59 58 59 55 15 41 15"></polygon>
            </g>
            <g>
                <polygon points="29.004 58 28 96 30.001 96 30.952 60 65.056 60 66.003 96 68.004 96 67.004 58 29.004 58"></polygon>
                <path d="M47.999,2c.06757,0,.346.15382.645.649l.03763.0623.04206.05941c.0536.07572,1.3214,
                    1.92808,4.1846,11.22925H43.09171C45.956,4.69527,47.22008,2.84621,47.27344,2.77076l.04318-.06067.03855-.06371C47.65355,
                    2.15319,47.93148,2,47.999,2m0-2a2.88457,2.88457,0,0,0-2.355,1.61108C45.383,1.97778,43.97986,4.22339,41,14l.00287,
                    2H54.99713L55,14C52.03259,4.264,50.62592,1.99634,50.356,1.61511A2.88666,2.88666,0,0,0,47.999,0Z"></path>
                <path d="M54.17445,16l1.12417,1.12418C56.46608,20.07411,64.22884,40.29125,65.001,
                    58H31.00472c.77218-17.70875,8.53493-37.92589,9.7024-40.87582L41.83129,16H54.17445m.82842-2h-14l-2,2s-9.16663,
                    22.33326-10,42L29,60H67.00287V58c-.83338-19.66674-10-42-10-42l-2-2Z"></path>
            </g>
        </g>
    </svg>
</button>      
    )
 }

 export default PencilButton;