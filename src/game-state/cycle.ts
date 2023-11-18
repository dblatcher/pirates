import { _DEG, normaliseHeading } from "../lib/geometry";
import { CellMatrix } from "../lib/path-finding/types";
import { randomInt, splitArray } from "../lib/util";
import { createImpact, createSplash, updateEffect } from "./effect";
import { handleProjectileHitsAndLandings, updateProjectile } from "./projectile";
import { followDirectives, getProwPosition, launchFromShip, updateShip } from "./ship";
import { updateTown } from "./towns";
import { Collison, Directive, GameState, MAX_WIND } from "./types";


const fireCannons = (game: GameState) => {
    game.ships.forEach(ship => {
        ship.cannons.forEach(cannon => {
            if (cannon.firing) {
                launchFromShip(cannon, ship, game)
            }
        })
    })
}


const handleShipCollison = (collision: Collison, game: GameState) => {
    const { ship, obstacle, speedWhenHit } = collision
    console.log(`${ship.name} hit ${obstacle.name} at ${speedWhenHit}`)
    createImpact({
        ...getProwPosition(ship),
        timeLeft: 10,
    }, game)
    // TO DO - game logic to decide which ships take damage
}

const removeSinkingShips = (game: GameState, pushLog: { (newLog: string): void }) => {
    const [shipsSinking, shipsNotSinking] = splitArray(game.ships, (ship => ship.damage >= ship.profile.maxHp))
    game.ships = shipsNotSinking
    shipsSinking.forEach(ship => {
        pushLog(`${ship.name || 'a ship'} sinks!`)
        createSplash({ ...ship, radius: 30, timeLeft: 100 }, game)
        createSplash({ ...ship, radius: 25, timeLeft: 100 }, game)
        createSplash({ ...ship, radius: 20, timeLeft: 100 }, game)
    })
}

const updateWind = (game: GameState) => {
    if (game.cycleNumber % 300 > 0 || Math.random() < .8) {
        return
    }
    // 2d4 + 2
    const windForceDice = 2 + randomInt((MAX_WIND - 2) / 2) + randomInt((MAX_WIND - 2) / 2)
    const windDirectionChangeDice = (90 - randomInt(180)) * _DEG
    game.wind.direction = normaliseHeading(game.wind.direction + windDirectionChangeDice)
    game.wind.force = windForceDice
}

export const cycle = (
    gameState: GameState,
    playerDirectives: Directive[],
    matrix: CellMatrix,
    pushLog: { (newLog: string): void }
): GameState => {
    const game = { ...gameState }
    game.cycleNumber = game.cycleNumber + 1
    updateWind(gameState)

    const player = game.ships.find(ship => ship.id === game.playerId)
    if (player) {
        followDirectives(player, playerDirectives)
    }

    game.ships.forEach(ship => {
        if (!ship.ai) { return }
        ship.ai.shiftPathIfReachedPoint(ship)
        followDirectives(ship, ship.ai.issueDirectives(ship, game))
    })

    // logic may be quite expensive - don't need to run every cycle
    // would be better to shard the ships and run some % each cycle
    // see effect on performance, then decide.
    if (game.cycleNumber % 100 == 0) {
        game.ships.forEach(ship => {
            if (!ship.ai) { return }
            ship.ai.updatePath(ship, game, matrix)
        })
    }

    const collisons: Collison[] = []
    game.ships.forEach(ship => {
        updateShip(ship, gameState, collisons)
    })
    game.projectiles.forEach(projectile => {
        updateProjectile(projectile)
    })
    game.towns.forEach(town => {
        updateTown(town, gameState)
    })
    game.effects.forEach(effect => {
        updateEffect(effect)
    })
    game.effects = game.effects.filter(effect => effect.timeLeft > 0)
    collisons.forEach(collison => handleShipCollison(collison, game))

    fireCannons(game)
    handleProjectileHitsAndLandings(game, pushLog)
    removeSinkingShips(game, pushLog)

    return game
}


