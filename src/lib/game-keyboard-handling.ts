import { ControlCenter } from "../context/control-context"
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


const getTurnAmount = (goingLeft: boolean, goingRight: boolean, shiftDown: boolean): number => {
    if (goingLeft === goingRight) { return 0 }
    return (shiftDown ? .2 : .5) * (goingRight ? -1 : 1)
}

export const makeKeyMapHandler = (
    refs: {
        wheelRef: React.MutableRefObject<number | undefined>,
        wheelNotLockedByKeyboardRef: React.MutableRefObject<boolean>,
        sailChangeRef: React.MutableRefObject<'UP' | 'DOWN' | undefined>,
    }
) => (keyMap: Record<string, boolean>) => {
    const { wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef } = refs

    const shiftDown = !!keyMap['ShiftRight'] || !!keyMap['ShiftLeft']
    const goingLeft = !!keyMap['KeyA']
    const goingRight = !!keyMap['KeyD']
    const turn = getTurnAmount(goingLeft, goingRight, shiftDown)

    wheelNotLockedByKeyboardRef.current = !turn
    wheelRef.current = turn
    const sailsUp = !!keyMap['KeyW'] && !keyMap['KeyS']
    const sailsDown = !!keyMap['KeyS'] && !keyMap['KeyW']
    sailChangeRef.current = sailsUp ? 'UP' : sailsDown ? 'DOWN' : undefined
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