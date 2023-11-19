import { InvasionByShip, Ship, Town } from "../model";

export const getInvasionsAndShips = (town: Town, ships: Ship[]): { invasion: InvasionByShip, ship: Ship }[] =>
    town.invasions.flatMap(invasion => {
        const ship = ships.find(ship => ship.id === invasion.shipId)
        return ship ? [{ invasion, ship }] : []
    })

export const getTownShipIsInvading = (ship: Ship, towns: Town[]): Town | undefined =>
    towns.find(town => town.invasions.some(invasion => invasion.shipId === ship.id))