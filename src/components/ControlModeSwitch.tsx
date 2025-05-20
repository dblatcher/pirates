import { FunctionComponent } from "react";
import { useManagement } from "../context/management-context";

export const ControlModeSwitch: FunctionComponent = () => {

    const { controlMode, setControlMode } = useManagement()
    const toggle = () => setControlMode(controlMode === 'desktop' ? 'touchscreen' : 'desktop')

    return <div>
        <button onClick={toggle}>{controlMode}</button>
    </div>

}