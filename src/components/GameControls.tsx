import { useState } from "react"
import { Directive, FiringPattern, Order, Ship } from "../game-state"
import { GunneryWidget } from "./GunneryWidget"
import { KeyboardControls } from "./KeyboardControls"
import { SailsWidget } from "./SailsWidget"
import { ShipDashBoard } from "./ShipDashboard"
import { WheelWidget } from "./WheelWidget"

interface Props {
    player?: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    playerWheel: number
    wheelRef: React.MutableRefObject<number | undefined>
}

export const GameControls = ({ player, addDirective, paused, playerWheel, wheelRef }: Props) => {

    const [firingPattern, setFiringPattern] = useState<FiringPattern>(FiringPattern.BROADSIDE)
    const setWheelTo = (value: number) => { wheelRef.current = value }

    return (
        <aside style={{ display: 'flex' }}>
            {player && (<>
                <WheelWidget
                    addDirective={addDirective}
                    playerWheel={playerWheel}
                    setWheelTo={setWheelTo}
                />
                <SailsWidget
                    setSailLevelTarget={(value) => {
                        addDirective({ order: Order.SAILS_TO, quantity: value })
                    }}
                    ship={player} />
                <GunneryWidget
                    ship={player}
                    addDirective={addDirective}
                    paused={paused}
                    firingPattern={firingPattern}
                    setFiringPattern={setFiringPattern}
                />
                <ShipDashBoard
                    ship={player}
                />
                <KeyboardControls
                    addDirective={addDirective}
                    firingPattern={firingPattern}
                    setFiringPattern={setFiringPattern}
                    setWheelTo={setWheelTo}
                    paused={paused} />
            </>
            )}
        </aside>
    )
}