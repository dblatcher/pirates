export type Color = {
    r: number;
    g: number;
    b: number;
}

export const rgba = (color: Color, alpha: number) => `rgba(${color.r},${color.g},${color.b},${alpha})`
export const rgb = (color: Color) => `rgb(${color.r},${color.g},${color.b})`

const BLACK: Color = { r: 0, g: 0, b: 0 } as const
const WHITE: Color = { r: 255, g: 255, b: 255 } as const
const GRAY: Color = { r: 120, g: 120, b: 120 } as const
const RED: Color = { r: 240, g: 60, b: 60 } as const
const BROWN: Color = { r: 165, g: 42, b: 42 } as const
export const colors = {
    BLACK, WHITE, GRAY, RED, BROWN
} as const

export const SAIL_COLOR_CSS = rgba(colors.WHITE, .8);
export const MAP_BG_COLOR_CSS = rgb(colors.WHITE);
export const SEA_COLOR_CSS = 'skyblue';