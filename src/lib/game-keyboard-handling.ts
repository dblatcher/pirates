import { ControlCenter, KeyMap } from "../context/control-context"
import { Directive, Order, Side, FiringPattern } from "../game-state"


const directiveKeys: Record<string, Directive | undefined> = {
    'KeyQ': { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.ALTERNATE },
    'KeyE': { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.ALTERNATE },
    'Space': { order: Order.INVADE_TOWN },
    'KeyB': { order: Order.BOARD_SHIP },
}

const patternKeys: Record<string, FiringPattern | undefined> = {
    'Digit1': FiringPattern.BROADSIDE,
    'Digit2': FiringPattern.CASCADE,
    'Digit3': FiringPattern.ALTERNATE,
}


const getTurnAmount = (steerLeft: boolean, steerRight: boolean, fineTurn: boolean): number => {
    if (steerLeft === steerRight) { return 0 }
    return (fineTurn ? .2 : .5) * (steerRight ? -1 : 1)
}


const readKeyMap = (keyMap: KeyMap) => ({
    fineTurn: !!keyMap['ShiftRight'] || !!keyMap['ShiftLeft'],
    steerLeft: !!keyMap['KeyA'],
    steerRight: !!keyMap['KeyD'],
    sailsUp: !!keyMap['KeyW'] && !keyMap['KeyS'],
    sailsDown: !!keyMap['KeyS'] && !keyMap['KeyW'],
})

export const makeKeyMapHandler = (
    refs: {
        wheelRef: React.MutableRefObject<number | undefined>,
        wheelNotLockedByKeyboardRef: React.MutableRefObject<boolean>,
        sailChangeRef: React.MutableRefObject<'UP' | 'DOWN' | undefined>,
    }
) => (keyMap: Record<string, boolean>) => {
    const { wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef } = refs
    const actions = readKeyMap(keyMap)
    const turn = getTurnAmount(actions.steerLeft, actions.steerRight, actions.fineTurn)

    wheelNotLockedByKeyboardRef.current = !turn
    wheelRef.current = turn
    sailChangeRef.current = actions.sailsUp ? 'UP' : actions.sailsDown ? 'DOWN' : undefined
}

export const makeKeyDownHandler = (paused: boolean, center: ControlCenter, setFiringPattern: { (value: FiringPattern): void }, firingPattern: FiringPattern, setMapOpen: { (value: boolean): void }, mapOpen: boolean) => (event: KeyboardEvent) => {
    if (paused) {
        return
    }
    const directive = directiveKeys[event.code]
    if (directive) {
        if (directive.order === Order.FIRE) {
            center.sendDirective({ ...directive, pattern: firingPattern })
        } else {
            center.sendDirective(directive)
        }
    }
    const patternChange = patternKeys[event.code]
    if (typeof patternChange === 'number') {
        setFiringPattern(patternChange)
    }

    if (event.code === 'KeyX') {
        center.sendWheelValue(0)
    }

    if (event.code === 'KeyM') {
        setMapOpen(!mapOpen)
    }
}