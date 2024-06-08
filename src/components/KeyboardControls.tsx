import { memo, useEffect, useRef } from "react"
import { useControls } from "../context/control-context"

interface Props {
    keyDownFunction?: { (event: KeyboardEvent, keyMap: Record<string, boolean>): void }
    renderOutput?: boolean
}


export const KeyboardControls = memo(({ keyDownFunction, renderOutput }: Props) => {
    const localKeyMap = useRef<Record<string, boolean>>({})
    const { keyMapRef: keyMapRefFromControls } = useControls()
    const keyMapRef = keyMapRefFromControls ?? localKeyMap;

    const handleKeyDown = (event: KeyboardEvent) => {
        if (keyMapRef.current[event.code]) {
            return // key already down - don't trigger event again
        }

        keyMapRef.current = { ...keyMapRef.current, [event.code]: true }
        if (keyDownFunction) {
            keyDownFunction(event, keyMapRef.current)
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        keyMapRef.current = { ...keyMapRef.current, [event.code]: false }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    })

    if (!renderOutput) { return <></> }

    const output = Object.entries(keyMapRef.current)
        .filter(([_key, value]) => { return value })
        .map(([key]) => key)
        .join("|")

    return <span>{output}</span>
})