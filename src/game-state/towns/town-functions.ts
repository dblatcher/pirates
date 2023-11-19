import { Ship, Town } from "../types";

export const getInvadingShips = (town:Town, ships:Ship[]) => 
    ships.flatMap(ship => ship.invasionInProgress?.townId === town.id ? [ship] : [])
