import { useManagement } from "../context/management-context";
import { IconButton } from "./IconButton";


export const SoundToggle = () => {
    const { soundIsEnabled, toggleSound } = useManagement()
    return (
        <IconButton
            onClick={toggleSound}
            negate={!soundIsEnabled}
            icon={'sound'}
        />
    )
} 