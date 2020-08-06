import React from "react";
import {ReactComponent as AlarmClock} from "../resources/fine/Alarm clock.svg"
import {ReactComponent as Ambulance} from "../resources/fine/Ambulance.svg"
import {ReactComponent as Angel} from "../resources/fine/Angel.svg"
import {ReactComponent as Ant} from "../resources/fine/Ant.svg"
import {ReactComponent as Backpack} from "../resources/fine/Backpack.svg"
import {ReactComponent as Basket} from "../resources/fine/Basket.svg"
import {ReactComponent as Bear} from "../resources/fine/Bear.svg"
import {ReactComponent as Bee} from "../resources/fine/Bee.svg"
import {ReactComponent as Bicycle} from "../resources/fine/Bicycle.svg"
import {ReactComponent as Bird} from "../resources/fine/Bird.svg"
import {ReactComponent as Book} from "../resources/fine/Book.svg"
import {ReactComponent as Bridge} from "../resources/fine/Bridge.svg"
import {ReactComponent as Bulldozer} from "../resources/fine/Bulldozer.svg"
import {ReactComponent as Bus} from "../resources/fine/Bus.svg"
import {ReactComponent as Butterfly} from "../resources/fine/Butterfly.svg"
import {ReactComponent as Cactus} from "../resources/fine/Cactus.svg"
import {ReactComponent as Calendar} from "../resources/fine/Calendar.svg"
import {ReactComponent as Castle} from "../resources/fine/Castle.svg"
import {ReactComponent as Cat} from "../resources/fine/Cat.svg"
import {ReactComponent as Chair} from "../resources/fine/Chair.svg"
import {ReactComponent as Couch} from "../resources/fine/Couch.svg"
import {ReactComponent as Crab} from "../resources/fine/Crab.svg"
import {ReactComponent as CruiseShip} from "../resources/fine/Cruise ship.svg"
import {ReactComponent as Dog} from "../resources/fine/Dog.svg"
import {ReactComponent as Dolphin} from "../resources/fine/Dolphin.svg"
import {ReactComponent as Duck} from "../resources/fine/Duck.svg"
import {ReactComponent as Elephant} from "../resources/fine/Elephant.svg"
import {ReactComponent as Eye} from "../resources/fine/Eye.svg"
import {ReactComponent as Face} from "../resources/fine/Face.svg"
import {ReactComponent as Fan} from "../resources/fine/Fan.svg"
import {ReactComponent as FireHydrant} from "../resources/fine/Firehydrant.svg"
import {ReactComponent as Firetruck} from "../resources/fine/Firetruck.svg"
import {ReactComponent as Flamingo} from "../resources/fine/Flamingo.svg"
import {ReactComponent as Flower} from "../resources/fine/Flower.svg"
import {ReactComponent as Hand} from "../resources/fine/Hand.svg"
import {ReactComponent as Hedgehog} from "../resources/fine/Hedgehog.svg"
import {ReactComponent as Helicopter} from "../resources/fine/Helicopter.svg"
import {ReactComponent as Kangaroo} from "../resources/fine/Kangaroo.svg"
import {ReactComponent as Key} from "../resources/fine/Key.svg"
import {ReactComponent as Lantern} from "../resources/fine/Lantern.svg"
import {ReactComponent as Owl} from "../resources/fine/Owl.svg"

export const findPicture = (name: string) => {
    switch (name) {
        case "alarm clock": return <AlarmClock/>
        case "ambulance": return <Ambulance/>
        case "angel": return <Angel/>
        case "ant": return <Ant/>
        case "backpack": return <Backpack/>
        case "basket": return <Basket/>
        case "bear": return <Bear/>
        case "bee": return <Bee/>
        case "bicycle": return <Bicycle/>
        case "bird": return <Bird/>
        case "book": return <Book/>
        case "bridge": return <Bridge/>
        case "bulldozer": return <Bulldozer/>
        case "bus": return <Bus/>
        case "butterfly": return <Butterfly/>
        case "cactus": return <Cactus/>
        case "calendar": return <Calendar/>
        case "castle": return <Castle/>
        case "cat": return <Cat/>
        case "chair": return <Chair/>
        case "circle": return <svg><circle cx="28" cy="28" r="26.5" strokeWidth="3" fill="none" stroke="var(--primary-color, #000)"/></svg>
        case "couch": return <Couch/>
        case "crab": return <Crab/>
        case "cruise ship": return <CruiseShip/>
        case "dog": return <Dog/>
        case "dolphin": return <Dolphin/>
        case "duck": return <Duck/>
        case "elephant": return <Elephant/>
        case "eye": return <Eye/>
        case "face": return <Face/>
        case "fan": return <Fan/>
        case "fire hydrant": return <FireHydrant/>
        case "firetruck": return <Firetruck/>
        case "flamingo": return <Flamingo/>
        case "flower": return <Flower/>
        case "hand": return <Hand/>
        case "hedgehog": return <Hedgehog/>
        case "helicopter": return <Helicopter/>
        case "kangaroo": return <Kangaroo/>
        case "key": return <Key/>
        case "lantern": return <Lantern/>
        case "square": return <svg><rect x="1" y="1" width="54" height="54" strokeWidth="3" fill="none" stroke="var(--primary-color, #000)"/></svg>
        case "owl": return <Owl/>
        default:
            return name
    }
}
