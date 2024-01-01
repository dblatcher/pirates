import { CSSProperties } from "react"

export const cornerOverlay = (y: 'top' | 'bottom' = 'top', x: 'left' | 'right' = 'left'): CSSProperties => ({
    position: 'absolute',
    [x]: 0,
    [y]: 0
})