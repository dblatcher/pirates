import { _DEG, normaliseHeading } from "../lib/geometry";
import { CellMatrix } from "../lib/path-finding/types";
import { randomInt, splitArray } from "../lib/util";
import { fireCannons, handleProjectileHitsAndLandings, updateProjectile } from "./cannons";
import { createImpact, createSplash, updateEffect } from "./effect";
import { Collison, Directive, GameState, MAX_WIND } from "./model";
import { followDirectives, getProwPosition, updateShip } from "./ship";
import { updateTown, aimAndFireCannonsFromForts } from "./towns";



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
    oldGameState: GameState,
    playerDirectives: Directive[],
    matrix: CellMatrix,
    pushLog: { (newLog: string): void }
): GameState => {
    const gameState = { ...oldGameState }
    gameState.cycleNumber = gameState.cycleNumber + 1
    updateWind(oldGameState)

    const player = gameState.ships.find(ship => ship.id === gameState.playerId)
    if (player) {
        followDirectives(player, playerDirectives)
    }

    gameState.ships.forEach(ship => {
        if (!ship.ai) { return }
        ship.ai.shiftPathIfReachedPoint(ship)
        followDirectives(ship, ship.ai.issueDirectives({ship, gameState, matrix}))
        ship.ai.setPathToDestination(ship, gameState, matrix)

        // TO DO periodically check if the path needs re-evaluating?
    })

    gameState.towns.forEach(town => {
        aimAndFireCannonsFromForts(town, oldGameState)
    })

    const collisons: Collison[] = []
    gameState.ships.forEach(ship => {
        updateShip(ship, oldGameState, collisons, pushLog)
    })
    gameState.projectiles.forEach(projectile => {
        updateProjectile(projectile)
    })
    gameState.towns.forEach(town => {
        updateTown(town, oldGameState)
    })
    gameState.effects.forEach(effect => {
        updateEffect(effect)
    })
    gameState.effects = gameState.effects.filter(effect => effect.timeLeft > 0)
    collisons.forEach(collison => handleShipCollison(collison, gameState))

    fireCannons(gameState)
    handleProjectileHitsAndLandings(gameState, pushLog)
    removeSinkingShips(gameState, pushLog)

    return gameState
}

