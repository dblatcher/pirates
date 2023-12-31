import { CSSProperties, useState } from "react"
import { Intro, IntroPage } from "../initial-conditions"

type Props = {
    intro?: Intro
    closeIntro: { (): void }
}

const containerStyle: CSSProperties = {
    background: 'black',
    color: 'white',
    minWidth: 200,
    padding: 10,
}

export const IntroMessage = ({ intro, closeIntro }: Props) => {
    const [pageIndex, setPageIndex] = useState(0)

    if (!intro) {
        return null
    }

    const currentIntroPage = intro.pages[pageIndex]

    return (
        <div className="modal-frame">
            <aside style={containerStyle}>
                {currentIntroPage && (<>
                    <p>
                        {currentIntroPage.text}
                    </p>
                    {pageIndex + 1 < intro.pages.length && (
                        <button onClick={() => { setPageIndex(pageIndex + 1) }}>next</button>
                    )}
                </>)}
                <button onClick={closeIntro}>close</button>
            </aside>
        </div>
    )
}