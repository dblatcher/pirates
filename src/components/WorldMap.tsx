import { buildDrawMapFnc } from "../canvas-drawing/world-map"
import { GameState } from "../game-state"
import { CellMatrix } from "../lib/path-finding/types"
import { CanvasScreen } from "./CanvasScreen"
import { Modal } from "./Modal"

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
        <Modal isOpen setIsOpen={closeModal} title="Map">
            <CanvasScreen width={mapWidth} height={mapHeight} draw={drawMap}
                containerStyle={{
                    width: mapWidth / 5,
                }}
                canvasStyle={{
                    maxWidth: '100%',
                }}
            />
        </Modal>
    )
}