import { TERRAIN_SQUARE_SIZE } from "../game-state/land"
import { GameState } from "../game-state/types"
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

export const WorldMap = ({ closeModal, mapHeight, mapWidth, matrix }: Props) => {

    const drawMap = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }
        ctx.beginPath()
        ctx.fillStyle='blue'
        ctx.fillRect(0, 0, mapWidth, mapHeight)

        ctx.strokeStyle = 'red'
        ctx.arc(0, 0, 100, 0, 6)
        ctx.stroke()

        plotMatrix(ctx, matrix)

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
                        width: mapWidth / 10,
                        height: mapWidth / 10,
                    }}
                />
            </aside>
        </div>
    )
}