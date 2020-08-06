import React from "react";
import {ReactComponent as Eye} from "../resources/fine/Eye.svg"
import {ReactComponent as Key} from "../resources/fine/Key.svg"
import {ReactComponent as Hand} from "../resources/fine/Hand.svg"
import {ReactComponent as Kangaroo} from "../resources/fine/Kangaroo.svg"
import {ReactComponent as Helicopter} from "../resources/fine/Helicopter.svg"
import {ReactComponent as Face} from "../resources/fine/Face.svg"
import {ReactComponent as Flower} from "../resources/fine/Flower.svg"
import {ReactComponent as Lantern} from "../resources/fine/Lantern.svg"
import {ReactComponent as Hedgehog} from "../resources/fine/Hedgehog.svg"
import {ReactComponent as Flamingo} from "../resources/fine/Flamingo.svg"
import {ReactComponent as Firetruck} from "../resources/fine/Firetruck.svg"
import {ReactComponent as Fan} from "../resources/fine/Fan.svg"
import {ReactComponent as FireHydrant} from "../resources/fine/Firehydrant.svg"
import {ReactComponent as AlarmClock} from "../resources/fine/Alarm clock.svg"
import {ReactComponent as Ambulance} from "../resources/fine/Ambulance.svg"
import {ReactComponent as Angel} from "../resources/fine/Angel.svg"
import {ReactComponent as Ant} from "../resources/fine/Ant.svg"
import {ReactComponent as Backpack} from "../resources/fine/Backpack.svg"
import {ReactComponent as Basket} from "../resources/fine/Basket.svg"
import {ReactComponent as Bear} from "../resources/fine/Bear.svg"

export const findPicture = (name: string) => {
    switch (name) {
        case "circle": return <svg><circle cx="28" cy="28" r="26.5" strokeWidth="3" fill="none" stroke="var(--primary-color, #000)"/></svg>
        case "square": return <svg><rect x="1" y="1" width="54" height="54" strokeWidth="3" fill="none" stroke="var(--primary-color, #000)"/></svg>
        case "eye": return <Eye/>
        case "key": return <Key/>
        case "hand": return <Hand/>
        case "kangaroo": return <Kangaroo/>
        case "helicopter": return <Helicopter/>
        case "face": return <Face/>
        case "flower": return <Flower/>
        case "lantern": return <Lantern/>
        case "hedgehog": return <Hedgehog/>
        case "flamingo": return <Flamingo/>
        case "firetruck": return <Firetruck/>
        case "fan": return <Fan/>
        case "fire hydrant": return <FireHydrant/>
        case "alarm clock": return <AlarmClock/>
        case "ambulance": return <Ambulance/>
        case "angel": return <Angel/>
        case "ant": return <Ant/>
        case "backpack": return <Backpack/>
        case "basket": return <Basket/>
        case "bear": return <Bear/>
        default:
            return name
    }
}
