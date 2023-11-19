import { Rect } from "../lib/geometry";
import { GameState, ViewPort } from "./model/types";

export const viewPortToRect = (viewPort :ViewPort):Rect =>({
    left: viewPort.x,
    top: viewPort.y,
    right: viewPort.x + viewPort.width,
    bottom: viewPort.y + viewPort.height
})

export const getNextShipId = (gameState: GameState) => Math.max(...gameState.ships.map(ship => ship.id)) + 1
