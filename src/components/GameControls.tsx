import { Directive, Order, Ship } from "../game-state/types"
import { GunneryWidget } from "./GunneryWidget"
import { KeyboardControls } from "./KeyboardControls"
import { SailsWidget } from "./SailsWidget"
import { ShipDashBoard } from "./ShipDashboard"
import { Wheel } from "./Wheel"

interface Props {
    player?: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    playerWheel: number
    setPlayerWheel: { (value: number): void }
}

export const GameControls = ({ player, addDirective, paused, playerWheel, setPlayerWheel }: Props) => {

    return (
        <aside style={{ display: 'flex', alignItems: 'flex-start' }}>
            {player && (<>
                <GunneryWidget
                    ship={player}
                    addDirective={addDirective}
                    paused={paused} />
                <Wheel
                    playerWheel={playerWheel}
                    setPlayerWheel={setPlayerWheel} />
                <SailsWidget
                    setSailLevelTarget={(value) => {
                        addDirective({ order: Order.SAILS_TO, quantity: value })
                    }}
                    ship={player} />
                <ShipDashBoard
                    ship={player} />
                <KeyboardControls
                    addDirective={addDirective}
                    turnWheel={setPlayerWheel}
                    paused={paused} />
            </>
            )}
        </aside>
    )
}