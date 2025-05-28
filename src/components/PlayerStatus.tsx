import { memo } from "react";
import { Ship, TERRAIN_SQUARE_SIZE } from "../game-state";

interface Props {
    ship: Ship,
}

const roundCoord = (value: number) => Math.floor(value / TERRAIN_SQUARE_SIZE)

export const PlayerStatus = memo(({ ship }: Props) => {

    const playerCoordinates = { x: roundCoord(ship.x), y: roundCoord(ship.y) }
    const coordinatesString = `[${playerCoordinates.x.toString().padStart(3, " ")} , ${playerCoordinates.y.toString().padStart(3, " ")}]`

    return (
        <>
            <div>
                {coordinatesString}
            </div>
            <div>
                damage: {ship.damage} / {ship.profile.maxHp}
            </div>
            <div>
                Speed: {ship.speedLastTurn.toFixed(2)}
            </div>
        </>
    )
}, ((prevProps, nextProps) => {
    return (
        prevProps.ship.speedLastTurn === nextProps.ship.speedLastTurn &&
        prevProps.ship.damage === nextProps.ship.damage &&
        prevProps.ship.profile.maxHp === nextProps.ship.profile.maxHp &&
        roundCoord(prevProps.ship.x) === roundCoord(nextProps.ship.x) &&
        roundCoord(prevProps.ship.y) === roundCoord(nextProps.ship.y)
    )
}))

