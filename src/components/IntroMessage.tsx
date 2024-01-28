import { expressions } from "@dblatcher/funny-face"
import { CSSProperties, useState } from "react"
import { useInterval } from "../hooks/useInterval"
import { Intro } from "../initial-conditions"
import { PersonFace } from "./PersonFace"

type Props = {
    intro: Intro
    closeIntro: { (): void }
}

const containerStyle: CSSProperties = {
    minWidth: 200,
}


const faceAndTextWrapperStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25rem',
    minHeight: 150,
}

const textBubbleStyle: CSSProperties = {
    flexBasis: '15rem',
    margin: 0,
}


export const IntroMessage = ({ intro, closeIntro }: Props) => {
    const [pageIndex, setPageIndex] = useState(0)
    const [displayedCharacters, setDisplayedCharacters] = useState(0)
    const currentIntroPage = intro?.pages[pageIndex]
    const showMoreText = () => {
        if (!currentIntroPage) { return }
        if (displayedCharacters < currentIntroPage.text.length) {
            setDisplayedCharacters(displayedCharacters + 1)
        }
    }
    useInterval(showMoreText, 75)

    const goToNext = () => {
        setDisplayedCharacters(0)
        setPageIndex(pageIndex + 1)
    }

    return (
        <div className="modal-overlay">
            <aside style={containerStyle} className="dialog">
                {currentIntroPage && (<>
                    <div style={faceAndTextWrapperStyle}>
                        {currentIntroPage.person && (
                            <PersonFace
                                person={currentIntroPage.person}
                                expression={currentIntroPage.expression ? expressions[currentIntroPage.expression] : undefined}
                                talking={displayedCharacters < currentIntroPage.text.length}
                            />
                        )}
                        <p style={textBubbleStyle} className="text-bubble">
                            {currentIntroPage.text.slice(0, displayedCharacters)}
                            <span className="text-bubble-tail"></span>
                        </p>
                    </div>
                </>)}
                <div>
                    {pageIndex + 1 < intro.pages.length && (
                        <button onClick={goToNext}>next</button>
                    )}
                    <button onClick={closeIntro}>close</button>
                </div>
            </aside>
        </div>
    )
}