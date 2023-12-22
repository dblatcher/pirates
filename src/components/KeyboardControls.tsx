import { useEffect, useState } from "react"
import { useInterval } from "../hooks/useInterval"

interface Props {
    keyDownFunction?: { (event: KeyboardEvent): void }
    keyMapFunction?: { (keyMap: Record<string, boolean>): void }
}


export const KeyboardControls = ({ keyMapFunction, keyDownFunction }: Props) => {
    const [keyMap, setKeyMap] = useState<Record<string, boolean>>({})

    const handleKeyDown = (event: KeyboardEvent) => {
        setKeyMap({ ...keyMap, [event.code]: true })
        if (keyDownFunction) {
            keyDownFunction(event)
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        setKeyMap({ ...keyMap, [event.code]: false })
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    })


    useInterval(() => {
        if (keyMapFunction) {
            keyMapFunction(keyMap)
        }
    }, keyDownFunction ? 0 : null)

    return <></>
}