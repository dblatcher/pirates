import { FunctionComponent } from "react";
import { useManagement } from "../context/management-context";

export const ControlModeSwitch: FunctionComponent = () => {

    const { controlMode, setControlMode } = useManagement()
    const toggle = () => setControlMode(controlMode === 'desktop' ? 'touchscreen' : 'desktop')
    const label = controlMode === 'desktop' ? 'D' : 'T'
    return <button onClick={toggle}>{label}</button>


}