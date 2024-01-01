import { FunnyFace, browShapes, expressions } from "@dblatcher/funny-face"
import { CSSProperties, useState } from "react"
import { useInterval } from "../hooks/useInterval"
import { Intro } from "../initial-conditions"

type Props = {
    intro?: Intro
    closeIntro: { (): void }
}

const containerStyle: CSSProperties = {
    minWidth: 200,
}


const faceAndTextWrapperStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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

    if (!intro) { return null }
    const goToNext = () => {
        setDisplayedCharacters(0)
        setPageIndex(pageIndex + 1)
    }

    return (
        <div className="modal-frame">
            <aside style={containerStyle} className="dialog">
                {currentIntroPage && (<>
                    <div style={faceAndTextWrapperStyle}>
                        <FunnyFace
                            size={100} x={0} y={0}
                            expression={currentIntroPage.expression ? expressions[currentIntroPage.expression] : undefined}
                            talking={displayedCharacters < currentIntroPage.text.length}
                            profile={{
                                browShape: browShapes.THIN,
                                eyeColor: 'green',
                                width: .8,
                                color: 'goldenrod',
                                lipColor: 'crimson'
                            }}
                        />
                        <p style={textBubbleStyle} className="text-bubble">
                            {currentIntroPage.text.slice(0, displayedCharacters)}
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