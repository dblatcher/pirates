import { _360_DEG, _DEG, normaliseHeading } from "../../lib/geometry";
import { clamp } from "../../lib/util";
import { Directive, Order } from "../types";
import { Ship } from "./types";


export const followDirectives = (ship: Ship, directives: Directive[]) => {

    directives.forEach(directive => {
        // TO DO - steering can't turn directly - need to set intent,
        // resolve in the update function with collision detection
        switch (directive.order) {
            case Order.RESET_WHEEL:
                ship.wheel = 0
                break;
            case Order.LEFT:
                ship.wheel = .5
                break;
            case Order.RIGHT:
                ship.wheel = -.5
                break;
            case Order.SAILS_TO: {
                const { quantity = 0 } = directive;
                ship.sailLevelTarget = clamp(quantity);
                break;
            }
            case Order.SAILS_BY: {
                const { quantity = 0 } = directive;
                const { sailLevelTarget } = ship;
                ship.sailLevelTarget = clamp(sailLevelTarget + quantity);
                break;
            }
            case Order.FIRE: {
                const { side } = directive;
                if (typeof side !== undefined) {
                    const cannon = ship.cannons.find(cannon => cannon.side === side)
                    if (cannon) { cannon.firing = true }
                }
                break;
            }
            case Order.HEADING_TO: {
                const { quantity = 0 } = directive
                const { h } = ship
                const current = normaliseHeading(h)
                const target = normaliseHeading(quantity)

                let adjustedTarget = target
                if (current - target > _360_DEG / 2) {
                    adjustedTarget = target + _360_DEG
                } else if (current - target < -_360_DEG / 2) {
                    adjustedTarget = target - _360_DEG
                }

                const changeRequired = Math.abs(adjustedTarget - current)
                const wheelAmount = changeRequired > _DEG * 10
                    ? .5
                    : changeRequired > _DEG * 5
                        ? .1
                        : .025

                if (current === adjustedTarget) {
                    ship.wheel = 0
                } else if (current < adjustedTarget) {
                    ship.wheel = wheelAmount
                } else if (current > adjustedTarget) {
                    ship.wheel = -wheelAmount
                }

            }
        }
    });
};
