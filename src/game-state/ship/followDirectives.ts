import { _360_DEG, _DEG, findRotationBetweenHeadings, normaliseHeading } from "../../lib/geometry";
import { clamp } from "../../lib/util";
import { Directive, Order } from "../types";
import { Ship } from "./types";


export const followDirectives = (ship: Ship, directives: Directive[]) => {

    directives.forEach(directive => {
        switch (directive.order) {
            case Order.WHEEL_TO:
                const { quantity = 0 } = directive;
                ship.wheel = clamp(quantity, .5, -.5);
                break;
            case Order.RESET_WHEEL:
                ship.wheel = 0
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

                const changeRequired = findRotationBetweenHeadings(h, target)
                const changeRequiredAbs = Math.abs(changeRequired)
                const changeRequiredSign = Math.sign(changeRequired)

                const wheelAmount = changeRequiredAbs > _DEG * 5
                    ? .5 * changeRequiredSign
                    : changeRequiredAbs > _DEG * 2.5
                        ? .25 * changeRequiredSign
                        : .125 *changeRequiredSign

                if (changeRequired === adjustedTarget) {
                    ship.wheel = 0
                } else  {
                    ship.wheel = wheelAmount
                } 

            }
        }
    });
};
