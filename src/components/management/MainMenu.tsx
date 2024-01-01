
interface Props {
    restartGame: { (): void }
    quitToTitle: { (): void }
}


export const MainMenu = ({ restartGame, quitToTitle }: Props) => {

    return (
        <div className="main-menu dialog">
            <h2>Main Menu</h2>
            <div className="main-menu__button-container">
                <button onClick={quitToTitle}>exit to Title</button>
                <button onClick={restartGame}>restart Scenario</button>
            </div>
        </div>
    )
}