import { AI, AIState } from ".";
import { Directive, GameState, Order } from "../game-state/types";
import { XY, _DEG } from "../lib/geometry";


export class BasicAutoPilot implements AI {
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

        directives.push({
            order: Order.SAILS_TO,
            quantity: .5
        })

        if (gameState.cycleNumber < 500 ) {
            directives.push({
                order: Order.HEADING_TO,
                quantity: _DEG * 45
            })
        } else if (gameState.cycleNumber < 1000) {
            directives.push({
                order: Order.HEADING_TO,
                quantity: _DEG * -30
            })
        } else {
            directives.push({
                order: Order.RESET_WHEEL
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