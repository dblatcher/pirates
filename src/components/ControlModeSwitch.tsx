import { useManagement } from "../context/management-context";
import { IconButton } from "./IconButton";

export const ControlModeSwitch = ({ withLabel }: { withLabel?: boolean }) => {
    const { controlMode, setControlMode } = useManagement()
    const toggle = () => setControlMode(controlMode === 'desktop' ? 'touchscreen' : 'desktop')
    const label = withLabel ? controlMode === 'desktop' ? 'Keyboard' : 'Touchscreen' : undefined;

    return <IconButton
        onClick={toggle}
        icon={controlMode}
        label={label} />
}