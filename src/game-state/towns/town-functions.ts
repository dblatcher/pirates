import { Ship, Town } from "../model";

export const getInvadingShips = (town: Town, ships: Ship[]): Ship[] =>
    town.invasions.flatMap(invasion => {
        const ship = ships.find(ship => ship.id === invasion.shipId)
        return ship ? [ship] : []
    })

export const getTownShipIsInvading = (ship: Ship, towns: Town[]): Town | undefined =>
    towns.find(town => town.invasions.some(invasion => invasion.shipId === ship.id))