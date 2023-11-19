import { Ship, Town } from "../model/types";

export const getInvadingShips = (town:Town, ships:Ship[]) => 
    ships.flatMap(ship => ship.invasionInProgress?.townId === town.id ? [ship] : [])
