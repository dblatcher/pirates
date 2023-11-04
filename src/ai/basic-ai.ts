import { AI, AIState } from ".";
import { Directive, GameState, Order } from "../game-state/types";
import { XY, _360_DEG, _DEG, normaliseHeading } from "../lib/geometry";


export class AutoPilot implements AI {
    shipId: number;
    state: AIState;

    constructor(initalState: AIState, shipId: number) {
        this.state = { ...initalState }
        this.shipId = shipId
    }

    issueDirectives(gameState: GameState): Directive[] {

        const ship = gameState.ships.find(ship => ship.id === this.shipId)
        if (!ship) {
            console.error('NO SHIP FOR AI', this.shipId)
            return []
        }
        const directives: Directive[] = []
        const h = normaliseHeading(ship.h)

        directives.push({
            order: Order.SAILS_TO,
            quantity: .5
        })

        if (ship.y < 75 && h > _DEG* 180) {
            directives.push({
                order: Order.RIGHT
            })
        } else if (ship.x > 200 && h < _360_DEG / 2) {
            directives.push({
                order: Order.RIGHT
            })
        }
        return directives
    }
    decideOwnMission(gameState: GameState): void {
        throw new Error("Method not implemented.");
    }
    navigateTo(destination: XY, gameState: GameState): XY[] {
        throw new Error("Method not implemented.");
    }



}