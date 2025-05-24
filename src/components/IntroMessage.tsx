import { expressions } from "@dblatcher/funny-face"
import { CSSProperties, useState } from "react"
import { useSchedule } from "../hooks/useSchedule"
import { Intro } from "../scenarios"
import { PersonFace } from "./PersonFace"
import type { SoundDeck } from "sound-deck"
import { makeTalkSound } from "../lib/sounds"

type Props = {
    intro: Intro
    closeIntro: { (): void }
    soundDeck: SoundDeck
}

const frameStyle: CSSProperties = {
    position: "absolute",
    inset: '2rem 0',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

const textBubbleWrapperStyle: CSSProperties = {
    paddingTop: '2rem',
    flexBasis: '15rem',
    alignSelf: 'flex-start'
}

const buttonContainerStyle: CSSProperties = {
    fontSize: '200%',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: 15,
    paddingBottom: 10
}

export const IntroMessage = ({ intro, closeIntro, soundDeck }: Props) => {
    const [pageIndex, setPageIndex] = useState(0)
    const [displayedCharacters, setDisplayedCharacters] = useState(0)
    const currentIntroPage = intro?.pages[pageIndex]
    const showMoreText = () => {
        if (!currentIntroPage) { return }
        if (displayedCharacters < currentIntroPage.text.length) {
            setDisplayedCharacters(displayedCharacters + 1)
            if (displayedCharacters % 2 === 0) {
                makeTalkSound(soundDeck)
            }
        }
    }
    useSchedule(showMoreText, 75)

    const onLastPage = pageIndex + 1 >= intro.pages.length

    const goToNext = () => {
        if (onLastPage) {
            return closeIntro()
        }
        setDisplayedCharacters(0)
        setPageIndex(pageIndex + 1)
    }

    return (
        <div style={frameStyle}>
            <aside style={containerStyle} className="paper">
                {currentIntroPage && (<>
                    <div style={faceAndTextWrapperStyle}>
                        {currentIntroPage.person && (
                            <PersonFace
                                person={currentIntroPage.person}
                                expression={currentIntroPage.expression ? expressions[currentIntroPage.expression] : undefined}
                                talking={displayedCharacters < currentIntroPage.text.length}
                            />
                        )}
                        <div style={textBubbleWrapperStyle}>
                            <p className="speech-bubble">
                                {currentIntroPage.text.slice(0, displayedCharacters)}
                                <span className="speech-bubble-tail"></span>
                            </p>
                        </div>
                    </div>
                </>)}
                <div style={buttonContainerStyle}>
                    {!onLastPage && (
                        <button className="scrawl-button" onClick={goToNext}>next</button>
                    )}
                    <button className="scrawl-button" onClick={closeIntro}>{onLastPage ? 'done' : 'skip'}</button>
                </div>
            </aside>
        </div>
    )
}