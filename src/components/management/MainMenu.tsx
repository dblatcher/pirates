
interface Props {
    restartGame: { (): void }
    quitToTitle: { (): void }
}


export const MainMenu = ({ restartGame, quitToTitle }: Props) => {

    return (
        <div className="main-menu dialog">
            <h2>Main Menu</h2>
            <div className="button-stack">
                <button onClick={quitToTitle}>exit to title</button>
                <button onClick={restartGame}>restart scenario</button>
            </div>
        </div>
    )
}