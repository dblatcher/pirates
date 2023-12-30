import { CSSProperties } from "react"
import { IntroPage } from "../initial-conditions"

type Props = {
    currentIntroPage?: IntroPage
    goToNext: { (): void }
}

const containerStyle: CSSProperties = {
    background: 'black',
    color: 'white',
    minWidth: 200,
    padding: 10,
}

export const IntroMessage = ({ currentIntroPage, goToNext }: Props) => {
    if (!currentIntroPage) {
        return null
    }

    return (
        <div className="modal-frame">
            <aside style={containerStyle}>
                <p>
                    {currentIntroPage.text}
                </p>
                <button onClick={goToNext}>next</button>
            </aside>
        </div>
    )
}