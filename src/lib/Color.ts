export type Color = {
    r: number;
    g: number;
    b: number;
}

export const rgba = (color: Color, alpha: number) => `rgba(${color.r},${color.g},${color.b},${alpha})`
export const rgb = (color: Color) => `rgb(${color.r},${color.g},${color.b})`

const BLACK: Color = { r: 0, g: 0, b: 0 } as const
export const colors = {
    BLACK
} as const