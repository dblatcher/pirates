import { AI, AIState } from ".";
import { Directive, GameState, Order } from "../game-state/types";
import { XY, _DEG, getDistance, getHeading } from "../lib/geometry";


export class PathFollowAutoPilot implements AI {
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

        const { path = [] } = this.state
        const [currentStep] = path

        if (!currentStep) {
            directives.push(
                { order: Order.SAILS_TO, quantity: 0 },
                { order: Order.RESET_WHEEL },
            )
        } else if (getDistance(ship, currentStep) < 10) {
            directives.push(
                { order: Order.RESET_WHEEL },
            )
            path.shift()
        } else {
            const heading = getHeading(
                {
                    x: currentStep.x - ship.x,
                    y: currentStep.y - ship.y
                }
            )
            directives.push(
                { order: Order.SAILS_TO, quantity: 1 },
                { order: Order.HEADING_TO, quantity: heading },
            )
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