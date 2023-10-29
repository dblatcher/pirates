import { clamp } from "../../lib/util";
import { Directive, Order } from "../types";
import { Ship } from "./types";


export const followDirectives = (ship: Ship, directives: Directive[]) => {
    directives.forEach(directive => {
        // TO DO - steering can't turn directly - need to set intent,
        // resolve in the update function with collision detection
        switch (directive.order) {
            case Order.LEFT: ship.h = ship.h + Math.PI * 0.025; break;
            case Order.RIGHT: ship.h = ship.h - Math.PI * 0.025; break;
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
                const { quantity = 0 } = directive;
                if (quantity > 0) {
                    ship.firingRight = true;
                } else {
                    ship.firingLeft = true;
                }
                break;
            }
        }
    });
};
