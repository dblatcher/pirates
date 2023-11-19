import { buildDrawMapFnc } from "../canvas-drawing/world-map"
import { GameState } from "../game-state"
import { CellMatrix } from "../lib/path-finding/types"
import { CanvasScreen } from "./CanvasScreen"

interface Props {
    closeModal: { (): void }
    gameState: GameState
    matrix: CellMatrix
    mapWidth: number
    mapHeight: number
}


export const WorldMap = ({ closeModal, mapHeight, mapWidth, matrix, gameState }: Props) => {

    const drawMap = buildDrawMapFnc(gameState, matrix, mapWidth, mapHeight)

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