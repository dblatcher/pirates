import { memo, useCallback } from "react";
import { useControls } from "../../context/control-context";
import { Order } from "../../game-state";
import { SailsFigure } from "../SailsFigure";
import { VerticalRange } from "../VerticalRange";

interface Props {
    sailLevelTarget: number;
    sailLevel: number;
}

export const SailsWidget = memo(({ sailLevelTarget, sailLevel }: Props) => {
    const { center } = useControls()
    const setSailLevelTarget = useCallback((quantity: number) => {
        center.sendDirective({ order: Order.SAILS_TO, quantity })
    }, [center])

    return (
        <div className="panel-frame sail-widget-panel">
            <div className="sail-wrapper">
                <VerticalRange
                    value={sailLevelTarget}
                    height={80}
                    width={20}
                    onChange={setSailLevelTarget}
                    min={0} max={1} step={.1}
                />
                <div style={{ flexGrow: 1, }}>
                    <SailsFigure
                        sailLevel={sailLevel}
                        sailLevelTarget={sailLevelTarget}
                        height={80}
                        width={80}
                    />
                </div>
            </div>
        </div >
    )
})