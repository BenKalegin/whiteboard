import React from "react";
import {ReactComponent as Eye} from "../resources/fine/Eye.svg"
import {ReactComponent as Key} from "../resources/fine/Key.svg"
import {ReactComponent as Hand} from "../resources/fine/Hand.svg"
import {ReactComponent as Kangaroo} from "../resources/fine/Kangaroo.svg"
import {ReactComponent as Helicopter} from "../resources/fine/Helicopter.svg"
import {ReactComponent as Face} from "../resources/fine/Face.svg"
import {ReactComponent as Flower} from "../resources/fine/Flower.svg"

export const findPicture = (name: string) => {
    switch (name) {
        case "circle": return <circle cx="28" cy="28" r="28" strokeWidth="3" fill="none"/>
        case "eye": return <Eye/>
        case "key": return <Key/>
        case "hand": return <Hand/>
        case "kangaroo": return <Kangaroo/>
        case "helicopter": return <Helicopter/>
        case "face": return <Face/>
        case "flower": return <Flower/>
        default:
            return name
    }
}
