import { memo } from "react"
import { Directive, Order } from "../../game-state"
import { cornerOverlay } from "../../lib/style-helpers"

interface Props {
    alreadyFighting: boolean
    addDirective: { (directive: Directive): void }
    marines: number
    maxMarines: number
}

export const MeleeControls = memo(({ alreadyFighting, addDirective, marines, maxMarines }: Props) => {
    return (
        <aside className="panel-frame" style={{ position: 'relative' }}>
            <button
                disabled={alreadyFighting}
                onClick={() => {
                    addDirective({ order: Order.INVADE_TOWN })
                }}>Town</button>
            <button
                disabled={alreadyFighting}
                onClick={() => {
                    addDirective({ order: Order.BOARD_SHIP })
                }}>Ship</button>
            <div
                style={cornerOverlay('bottom', 'right')}
            >
                🗡️ &times; {marines}/{maxMarines}
            </div>
        </aside>
    )
})