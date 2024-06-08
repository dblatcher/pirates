import { memo } from "react"
import { useControls } from "../../context/control-context"
import { Order } from "../../game-state"
import { cornerOverlay } from "../../lib/style-helpers"

interface Props {
    alreadyFighting: boolean
    marines: number
    maxMarines: number
}

export const MeleeControls = memo(({ alreadyFighting, marines, maxMarines }: Props) => {
    const {center} = useControls()

    return (
        <aside className="panel-frame">
            <button
                disabled={alreadyFighting}
                onClick={() => {
                    center.sendDirective({ order: Order.INVADE_TOWN })
                }}>Town</button>
            <button
                disabled={alreadyFighting}
                onClick={() => {
                    center.sendDirective({ order: Order.BOARD_SHIP })
                }}>Ship</button>
            <div
                style={cornerOverlay('bottom', 'right')}
            >
                🗡️ &times; {marines}/{maxMarines}
            </div>
        </aside>
    )
})