import useFetch from 'use-http'

import {inkPayload} from "../services/InputTools";
import {Figure} from "../models/DrawModels";

// const { post, response } = useFetch('https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8')

/*
const fetchPredictions = async (figures: Figure[]) => {
    const figure = figures[figures.length - 1];
    const data = await post('', inkPayload(1000, 1000, figure) )
    if (!response.ok) {
        console.error("request failed", response.headers)
    }else if (data[0] !== "SUCCESS") {
        console.error("request failed", data)
    }else
        setPredictions(data[1][0][1])
}
*/

