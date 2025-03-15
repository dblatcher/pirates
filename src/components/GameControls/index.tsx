import { FiringPattern, Objective, Ship, Side } from "../../game-state"
import { splitArray } from "../../lib/util"
import { GunneryWidget } from "./GunneryWidget"
import { MeleeControls } from "./MeleeControl"
import { SailsWidget } from "./SailsWidget"
import { ShipDashBoard } from "./ShipDashboard"
import { WheelWidget } from "./WheelWidget"
import "./controls.css"

interface Props {
    player?: Ship
    objectives: Objective[]
    paused: boolean
    wheelNotLockedByPointerRef: React.MutableRefObject<boolean>
    mapOpen: boolean,
    setMapOpen: { (value: boolean): void }
    firingPattern: FiringPattern
    setFiringPattern: { (value: FiringPattern): void }
}


export const GameControls = ({
    player,
    objectives,
    paused,
    wheelNotLockedByPointerRef,
    mapOpen,
    setMapOpen,
    firingPattern, setFiringPattern
}: Props) => {
    const [leftCannons, rightCannons] = splitArray(player?.cannons ?? [], (_ => _.side === Side.LEFT))
    const leftCannonsReady = leftCannons.map(c => c.cooldown <= 0)
    const rightCannonsReady = rightCannons.map(c => c.cooldown <= 0)

    return (
        <aside className="controls-container no-select-highlight">
            {player ? (<>
                <WheelWidget
                    playerWheel={player.wheel}
                    wheelNotLockedByPointerRef={wheelNotLockedByPointerRef}
                />
                <SailsWidget
                    sailLevel={player.sailLevel}
                    speedLastTurn={player.speedLastTurn}
                    sailLevelTarget={player.sailLevelTarget} />
                <GunneryWidget
                    leftCannons={leftCannonsReady}
                    rightCannons={rightCannonsReady}
                    paused={paused}
                    firingPattern={firingPattern}
                    setFiringPattern={setFiringPattern}
                />
                <MeleeControls
                    alreadyFighting={false}
                    marines={player.marines}
                    maxMarines={player.profile.maxMarines}
                />
                <ShipDashBoard
                    ship={{ ...player }}
                    mapOpen={mapOpen}
                    setMapOpen={setMapOpen}
                    objectives={structuredClone(objectives)}
                />
            </>
            ) : (
                <div className="panel-frame" style={{ flex: 1 }}></div>
            )}
        </aside>
    )
}