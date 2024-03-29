import { launchProjectile } from "."
import { _90_DEG_RIGHT, getXYVector, translate } from "../../lib/geometry"
import { DAMAGE_THAT_STOPS_FORTS_FIRING, FORT_SIZE, Fort, FortCannon, GameState, Ship, ShipCannon, anglesBySide } from "../model"
import { SoundEffectRequest } from "../model/sound"

const launchFromShip = (cannon: ShipCannon, ship: Ship, game: GameState): boolean => {
    if (cannon.cooldown > 0) {
        cannon.firing = false
        return false
    }

    const directionOfFire = ship.h + anglesBySide[cannon.side]

    const getStartAt = (distanceFromBroadsideCenter: number) => {
        const placeInMiddleOfShip = translate(ship, getXYVector(ship.length * distanceFromBroadsideCenter, ship.h))
        const placeOutFromShip = translate(placeInMiddleOfShip, getXYVector(1 + ship.width, directionOfFire))
        return {
            ...placeOutFromShip,
            h: directionOfFire
        }
    }

    launchProjectile(getStartAt(cannon.position), game)
    cannon.cooldown = 200
    cannon.firing = false
    return true
}

const launchFromFort = (cannon: FortCannon, fort: Fort, game: GameState): boolean => {
    if (cannon.cooldown > 0 || fort.damage >= DAMAGE_THAT_STOPS_FORTS_FIRING) {
        cannon.firing = false
        return false
    }
    const { h = 0 } = fort

    const getStartAt = (distanceFromFortCenter: number) => {
        const d = (FORT_SIZE / 2) * distanceFromFortCenter
        const placeAlongDiameter = translate(fort, getXYVector(d, _90_DEG_RIGHT + h))
        const placeOutsideRadius = translate(placeAlongDiameter, getXYVector(1 + FORT_SIZE / 2, h))
        return {
            ...placeOutsideRadius,
            h: h
        }
    }


    launchProjectile(getStartAt(cannon.position), game)
    cannon.cooldown = 200
    cannon.firing = false
    return true
}


export const fireCannons = (game: GameState, soundEffectRequests: SoundEffectRequest[]) => {
    game.ships.forEach(ship => {
        if (ship.cannons.some(cannon => cannon.firing && cannon.cooldown === 0)) {
            soundEffectRequests.push({ position: ship, sfx: 'cannonFire' })
        }
        ship.cannons.forEach(cannon => {
            if (cannon.firing) {
                launchFromShip(cannon, ship, game)
            }
        })
    })

    game.towns.forEach(town => {
        town.forts.forEach(fort => {
            if (fort.damage < DAMAGE_THAT_STOPS_FORTS_FIRING) {
                fort.cannons.forEach(cannon => {
                    if (fort.cannons.some(cannon => cannon.firing && cannon.cooldown === 0)) {
                        soundEffectRequests.push({ position: fort, sfx: 'cannonFire' })
                    }
                    if (cannon.firing) {
                        launchFromFort(cannon, fort, game)
                    }
                })
            }
        })
    })
}