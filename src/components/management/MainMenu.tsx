import { Modal } from "../Modal";

interface Props {
    setIsOpen: { (isOpen: boolean): void }
    isOpen: boolean;
    restartGame: { (): void }
    quitToTitle: { (): void }
}


export const MainMenu = ({ restartGame, quitToTitle, setIsOpen, isOpen }: Props) => {

    return (
        <Modal title="Main Menu" setIsOpen={setIsOpen} isOpen={isOpen}>
            <div className="button-stack">
                <button onClick={quitToTitle}>exit to title</button>
                <button onClick={restartGame}>restart scenario</button>
            </div>
        </Modal>
    )
}