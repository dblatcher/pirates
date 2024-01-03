import { CSSProperties } from "react"

export const cornerOverlay = (y: 'top' | 'bottom' = 'top', x: 'left' | 'right' | 'center' = 'left'): CSSProperties => ({
    position: 'absolute',
    [x]: 0,
    [y]: 0
})
export const middleOverlay = (y = 0): CSSProperties => ({
    position: 'absolute',
    inset: `0 0 ${y}%`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})