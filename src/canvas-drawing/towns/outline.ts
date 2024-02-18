import { DEFENCES_TO_REPEL_INVADERS, TOWN_SIZE, Town } from "../../game-state";
import { clamp } from "../../lib/util";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { flash } from "../helpers";


const POINTS_PER_WALL = 50
const WALL_WIDTH = 4

const getWallOffset = (damageLevel: number, isOuterWall: boolean) => {
    const clampedDamageLevel = clamp(damageLevel)
    const minimumStroke = (isOuterWall ? 0 : 8);
    return [minimumStroke + 24 * (1 - clampedDamageLevel), clampedDamageLevel * 24]
}

const drawWall = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,

    wallWidth: number,
    damageLevel: number,
    offset: number,
    isOuterWall: boolean,
) => {

    ctx.beginPath();
    ctx.lineWidth = wallWidth;
    ctx.setLineDash(getWallOffset(damageLevel, isOuterWall))
    drawingMethods.arc(town.x, town.y, (TOWN_SIZE / 2) + offset, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([])

}

const dividePointsByWall = (totalWalls: number, defences: number): number[] => {
    const walls: number[] = []
    let pointsLeft = defences
    for (let i = 0; i < totalWalls; i++) {
        if (pointsLeft <= 0) {
            walls.push(0)
            continue
        }
        const amountForNextWall = Math.min(POINTS_PER_WALL, pointsLeft)
        walls.push(amountForNextWall)
        pointsLeft = pointsLeft - amountForNextWall
    }
    return walls
}

export const drawTownOutline = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,
    cycleNumber: number,
) => {
    ctx.beginPath();
    ctx.fillStyle = 'gray'
    drawingMethods.arc(town.x, town.y, TOWN_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    const townCanBeInvaded = town.defences < DEFENCES_TO_REPEL_INVADERS
    const totalWalls = Math.ceil(town.profile.maxDefences / POINTS_PER_WALL)

    ctx.strokeStyle = townCanBeInvaded ? flash(cycleNumber, ['red', 'black']) : 'black'
    // inner wall first
    dividePointsByWall(totalWalls, town.defences).forEach((amountOfPoints, index) => {
        drawWall(
            ctx, drawingMethods, town,
            WALL_WIDTH,
            1 - (amountOfPoints / POINTS_PER_WALL),
            (index - totalWalls) * WALL_WIDTH,
            index > 0
        )
    })

}
