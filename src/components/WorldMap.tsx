import { TERRAIN_SQUARE_SIZE } from "../game-state/land"
import { GameState, Ship } from "../game-state/types"
import { CellMatrix } from "../lib/path-finding/types"
import { CanvasScreen } from "./CanvasScreen"

interface Props {
    closeModal: { (): void }
    gameState: GameState
    matrix: CellMatrix
    mapWidth: number
    mapHeight: number
}


const plotMatrix = (ctx: CanvasRenderingContext2D, matrix: CellMatrix) => {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const terrain = matrix[y][x]

            if (terrain) {
                ctx.beginPath()
                ctx.fillStyle = 'green'
                ctx.moveTo(x * TERRAIN_SQUARE_SIZE, y * TERRAIN_SQUARE_SIZE)
                ctx.rect(x * TERRAIN_SQUARE_SIZE, y * TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
                ctx.fill()
            }
        }
    }
}

const crossSize = 20
const plotShips = (ctx: CanvasRenderingContext2D, ships: Ship[]) => {
    ships.forEach(ship => {
        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 5
        ctx.moveTo(ship.x - crossSize, ship.y - crossSize)
        ctx.lineTo(ship.x + crossSize, ship.y + crossSize)
        ctx.moveTo(ship.x + crossSize, ship.y - crossSize)
        ctx.lineTo(ship.x - crossSize, ship.y + crossSize)
        ctx.stroke()
    })
}

export const WorldMap = ({ closeModal, mapHeight, mapWidth, matrix, gameState }: Props) => {

    const drawMap = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }
        ctx.beginPath()
        ctx.fillStyle = 'blue'
        ctx.fillRect(0, 0, mapWidth, mapHeight)
        plotMatrix(ctx, matrix)
        plotShips(ctx, gameState.ships)
    }

    return (
        <div className="modal-frame">
            <button onClick={closeModal}>close</button>
            <aside style={{
                backgroundColor: 'white',
            }}>
                <p>Map</p>

                <CanvasScreen width={mapWidth} height={mapHeight} draw={drawMap}
                    containerStyle={{
                        width: mapWidth / 5,
                        height: mapWidth / 10,
                    }}
                    canvasStyle={{
                        maxWidth: '100%',
                    }}
                />
            </aside>
        </div>
    )
}