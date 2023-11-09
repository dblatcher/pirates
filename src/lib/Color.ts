export type Color = {
    r: number;
    g: number;
    b: number;
}

export const rgba = (color: Color, alpha: number) => `rgba(${color.r},${color.g},${color.b},${alpha})`
export const rgb = (color: Color) => `rgb(${color.r},${color.g},${color.b})`