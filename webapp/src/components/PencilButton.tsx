import React from 'react';

export interface Props {
    color: string
    active: boolean
    first: boolean
    onClick: () => void
  }
  

const PencilButton: React.FC<Props> = (props) => {
    const active =  props.active ? " selectedToolbarButton" : " unselectedToolbarButton";
    const penSvgDefs =
        <defs>
            <linearGradient id="pen-linear-gradient" x1="36.1146" y1="1057.5" x2="60.0056" y2="1057.5" gradientTransform="translate(0 -980)" gradientUnits="userSpaceOnUse">
                <stop offset="0.2" stopColor="#fff" stopOpacity="0"/>
                <stop offset="0.2048" stopColor="#fff" stopOpacity="0.00948"/>
                <stop offset="0.2972" stopColor="#fff" stopOpacity="0.1775"/>
                <stop offset="0.3805" stopColor="#fff" stopOpacity="0.2992"/>
                <stop offset="0.4509" stopColor="#fff" stopOpacity="0.3734"/>
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.4"/>
                <stop offset="0.5576" stopColor="#fff" stopOpacity="0.3835"/>
                <stop offset="0.6177" stopColor="#fff" stopOpacity="0.3344"/>
                <stop offset="0.679" stopColor="#fff" stopOpacity="0.2526"/>
                <stop offset="0.7406" stopColor="#fff" stopOpacity="0.1388"/>
                <stop offset="0.8" stopColor="#fff" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="pen-linear-gradient-2" x1="39.75" y1="1017" x2="56.5602" y2="1017" gradientTransform="translate(0 -980)" gradientUnits="userSpaceOnUse">
                <stop offset="0.16" stopColor="#fff" stopOpacity="0"/>
                <stop offset="0.2179" stopColor="#fff" stopOpacity="0.2236"/>
                <stop offset="0.2949" stopColor="#fff" stopOpacity="0.4965"/>
                <stop offset="0.3645" stopColor="#fff" stopOpacity="0.7131"/>
                <stop offset="0.424" stopColor="#fff" stopOpacity="0.8691"/>
                <stop offset="0.4711" stopColor="#fff" stopOpacity="0.9648"/>
                <stop offset="0.5" stopColor="#fff"/>
                <stop offset="0.5289" stopColor="#fff" stopOpacity="0.9648"/>
                <stop offset="0.576" stopColor="#fff" stopOpacity="0.8691"/>
                <stop offset="0.6355" stopColor="#fff" stopOpacity="0.7131"/>
                <stop offset="0.7051" stopColor="#fff" stopOpacity="0.4965"/>
                <stop offset="0.7821" stopColor="#fff" stopOpacity="0.2236"/>
                <stop offset="0.84" stopColor="#fff" stopOpacity="0"/>
            </linearGradient>
        </defs>

    return (
<button 
    className={"toolbarButton unselectedToolbarButton" + active}
    id="red" 
    aria-label="Content Creation Toolbar - Ink Red Pen" 
    aria-selected='false' 
    role="tab" 
    title={props.color + " Pen"}
    onClick={props.onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 "+ (props.active ? "-8": "-24") + " 96 96"}>
        {props.first ? penSvgDefs : ""}
        <g>
            <rect className="pen-0" width="96" height="96"/>
            <g>
                <g>
                    <polygon fill={props.color} points="68.004 96 28 96 29.004 58 67.004 58 68.004 96"/>
                </g>
                <g>
                    <path fill={props.color} d="M55,14C52,4,50,0,47.999,0,46,0,44,4,41,14l.00287,2H54.99713Z"/>
                </g>
                <g>
                    <path className="pen-1" d="M57.00287,16l-2-2h-14l-2,2s-9.16663,22.33325-10,42L29,60H67.00287V58C66.16949,38.33325,57.00287,16,57.00287,16Z"/>
                </g>
            </g>
            <g>
                <polygon className="pen-2" points="36 59 36 96 60 96 60 59 36 59"/>
                <polygon className="pen-3" points="41 15 38 59 58 59 55 15 41 15"/>
            </g>
            <g>
                <polygon points="29.004 58 28 96 30.001 96 30.952 60 65.056 60 66.003 96 68.004 96 67.004 58 29.004 58"/>
                <path d="M47.999,2c.06757,0,.346.15382.645.649l.03763.0623.04206.05941c.0536.07572,1.3214,
                    1.92808,4.1846,11.22925H43.09171C45.956,4.69527,47.22008,2.84621,47.27344,2.77076l.04318-.06067.03855-.06371C47.65355,
                    2.15319,47.93148,2,47.999,2m0-2a2.88457,2.88457,0,0,0-2.355,1.61108C45.383,1.97778,43.97986,4.22339,41,14l.00287,
                    2H54.99713L55,14C52.03259,4.264,50.62592,1.99634,50.356,1.61511A2.88666,2.88666,0,0,0,47.999,0Z"/>
                <path d="M54.17445,16l1.12417,1.12418C56.46608,20.07411,64.22884,40.29125,65.001,
                    58H31.00472c.77218-17.70875,8.53493-37.92589,9.7024-40.87582L41.83129,16H54.17445m.82842-2h-14l-2,2s-9.16663,
                    22.33326-10,42L29,60H67.00287V58c-.83338-19.66674-10-42-10-42l-2-2Z"/>
            </g>
        </g>
    </svg>
</button>      
    )
 }

 export default PencilButton;