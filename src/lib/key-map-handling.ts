

export const makeKeyMapHandler = (
    refs: {
        wheelRef: React.MutableRefObject<number | undefined>,
        wheelNotLockedByKeyboardRef: React.MutableRefObject<boolean>,
        sailChangeRef: React.MutableRefObject<'UP' | 'DOWN' | undefined>,
    }
) => (keyMap: Record<string, boolean>) => {
    const { wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef } = refs
    const goingLeft = !!keyMap['KeyA']
    const goingRight = !!keyMap['KeyD']
    const turn = goingLeft && goingRight ? 0 :
        goingLeft
            ? .5
            : goingRight
                ? -.5
                : undefined

    wheelNotLockedByKeyboardRef.current = !turn
    if (typeof turn === 'number') {
        wheelRef.current = turn
    }
    const sailsUp = !!keyMap['KeyW'] && !keyMap['KeyS']
    const sailsDown = !!keyMap['KeyS'] && !keyMap['KeyW']
    sailChangeRef.current = sailsUp ? 'UP' : sailsDown ? 'DOWN' : undefined
}