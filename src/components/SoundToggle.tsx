import { useManagement } from "../context/management-context";
import { IconButton } from "./IconButton";


export const SoundToggle = ({ withLabel }: { withLabel?: boolean }) => {
    const { soundIsEnabled, toggleSound } = useManagement()
    const label = withLabel ? soundIsEnabled ? 'Sound on' : 'Sound off' : undefined;
    return (
        <IconButton
            label={label}
            onClick={toggleSound}
            negate={!soundIsEnabled}
            icon={'sound'}
        />
    )
} 