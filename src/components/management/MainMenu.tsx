import { useManagement } from "../../context/management-context";
import { ControlModeSwitch } from "../ControlModeSwitch";
import { IconButton } from "../IconButton";
import { Modal } from "../Modal";
import { SoundToggle } from "../SoundToggle";

interface Props {
    setIsOpen: { (isOpen: boolean): void }
    isOpen: boolean;
    restartGame: { (): void }
    quitToTitle: { (): void }
}


export const MainMenu = ({ restartGame, quitToTitle, setIsOpen, isOpen }: Props) => {

    const { setCyclePeriod, cyclePeriod } = useManagement()
    return (
        <Modal title="Main Menu" setIsOpen={setIsOpen} isOpen={isOpen}>
            <div className="button-stack">
                <button onClick={quitToTitle}>exit to title</button>
                <button onClick={restartGame}>restart scenario</button>
            </div>
            <div className="button-stack">
                <ControlModeSwitch />
                <SoundToggle />
                <IconButton
                    onClick={() => { setCyclePeriod((cyclePeriod) => cyclePeriod === 10 ? 0 : 10) }}
                    icon="fast"
                    negate={cyclePeriod !== 0} />
            </div>
        </Modal>
    )
}