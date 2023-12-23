import { getXYVector, isPointInsideRect, normaliseHeading } from "../../lib/geometry"
import { clamp } from "../../lib/util"
import { updateCannon } from "../cannons"
import { Collison, GameState, REPAIR_PERIOD, SAIL_CHANGE_RATE, SHIP_TURN_RATE, Ship } from "../model"
import { getSpeed } from "./calculate-speed"
import { getBoundingRect } from "./collision-shapes"
import { detectForwardCollisions, detectTurningCollisons } from "./collison-detection"
import { tryToBoardShip, tryToLauchInvasion } from "./invade"
import { shipIsAtPort } from "./repairAtPort"


export const updateShip = (ship: Ship, game: GameState, collisions: Collison[], pushLog: { (message: string): void }) => {
    const otherShipsNearby = game.ships
        .filter(shipInList => shipInList !== ship)
        .filter(shipInList => isPointInsideRect(ship, getBoundingRect(shipInList, ship.length + 2)))

    //TO DO filter out distant forts
    const forts = game.towns.flatMap(town => town.forts)

    const moveAmount = getSpeed(ship, game)
    const forward = getXYVector(moveAmount, ship.h)
    // TO DO - turn more slowly with full sails
    const turnAmount = (SHIP_TURN_RATE * ship.wheel * ship.profile.maneuver)

    const { otherShipRanInto, runsAgroundFromGoingForward, fortRunInto } = detectForwardCollisions(ship, forward, otherShipsNearby, forts, game.land)
    const { otherShipTurnedInto, fortTurnedInto } = detectTurningCollisons(ship, turnAmount, otherShipsNearby, forts)

    if (otherShipRanInto) {
        if (ship.speedLastTurn && ship.turnsUnimpeded >= 10) {
            collisions.push({
                ship,
                obstacle: otherShipRanInto,
                vector: forward,
                speedWhenHit: ship.speedLastTurn
            })
        }
    }

    if (!otherShipRanInto && !runsAgroundFromGoingForward && !fortRunInto) {
        ship.x = ship.x += forward.x
        ship.y = ship.y += forward.y
    }

    if (!otherShipTurnedInto && !fortTurnedInto) {
        ship.h = normaliseHeading(ship.h + turnAmount)
    }

    const wasNotImpeded = !otherShipRanInto && !runsAgroundFromGoingForward && !otherShipTurnedInto && !fortRunInto && !fortTurnedInto
    ship.speedLastTurn = wasNotImpeded ? moveAmount : 0
    ship.turnsUnimpeded = wasNotImpeded ? ship.turnsUnimpeded + 1 : 0

    // TO DO - add a feature allowing ships that are 'stuck' to 'row back' to a position they can move from

    // TO DO - vary by ship and crew
    if (ship.sailLevel !== ship.sailLevelTarget) {
        const change = Math.min(Math.abs(ship.sailLevel - ship.sailLevelTarget), SAIL_CHANGE_RATE) * -Math.sign(ship.sailLevel - ship.sailLevelTarget)
        ship.sailLevel = ship.sailLevel + change
    }
    ship.cannons.forEach(updateCannon)

    if (ship.launchingInvasion) {
        tryToLauchInvasion(ship, game, pushLog)
    }

    if (ship.boardingShip) {
        tryToBoardShip(ship, game, pushLog)
    }

    ship.underRepair = ship.damage > 0 && shipIsAtPort(ship, game)
    if (ship.underRepair && game.cycleNumber % REPAIR_PERIOD === 0) {
        ship.damage = clamp(ship.damage - 1, ship.profile.maxHp, 0)
    }
}
