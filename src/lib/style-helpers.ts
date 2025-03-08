import { CSSProperties } from "react"

export const cornerOverlay = (y: 'top' | 'bottom' = 'top', x: 'left' | 'right' | 'center' = 'left', inset = 0): CSSProperties => ({
    position: 'absolute',
    [x]: inset,
    [y]: inset
})
export const middleOverlay = (y = 0): CSSProperties => ({
    position: 'absolute',
    inset: `0 0 ${y}%`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})