import { memo } from "react"
import { useControls } from "../../context/control-context"
import { Order } from "../../game-state"

interface Props {
    alreadyFighting: boolean
}

export const MeleeControls = memo(({ alreadyFighting }: Props) => {
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
        </aside>
    )
})