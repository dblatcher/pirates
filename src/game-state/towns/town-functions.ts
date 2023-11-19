import { Ship, Town } from "../model";

export const getInvadingShips = (town:Town, ships:Ship[]) => 
    ships.flatMap(ship => ship.invasionInProgress?.townId === town.id ? [ship] : [])
