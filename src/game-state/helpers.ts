import { Rect } from "../lib/geometry";
import { ViewPort } from "./types";

export const viewPortToRect = (viewPort :ViewPort):Rect =>({
    left: viewPort.x,
    top: viewPort.y,
    right: viewPort.x + viewPort.width,
    bottom: viewPort.y + viewPort.height
})