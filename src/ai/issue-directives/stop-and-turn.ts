import { Directive, Order } from "../../game-state"

export const stopAndTurnTowards = (heading: number): Directive[] => {
    return [
        { order: Order.SAILS_TO, quantity: 0 },
        { order: Order.HEADING_TO, quantity: heading }
    ]
}