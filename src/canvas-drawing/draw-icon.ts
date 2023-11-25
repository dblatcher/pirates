import { XY, translate } from "../lib/geometry";
import { OffsetDrawMethods } from "./drawWithOffSet";
import { s } from "./helpers";


const redCutlassImage = new Image(100, 100)
redCutlassImage.src = '/red-cutlass.png'
const blackCutlassImage = new Image(100, 100)
blackCutlassImage.src = '/black-cutlass.png'
const jollyRodgerImage = new Image(100, 100)
jollyRodgerImage.src = '/jolly-rodger.png'

const ICONS = {
    RED_CUTLASS: redCutlassImage,
    BLACK_CUTLASS: blackCutlassImage,
    JOLLY_RODGER: jollyRodgerImage,
}

export enum ImagePlacement {
    CENTER, TOP_LEFT
}

export type IconParams = {
    icon: keyof typeof ICONS;
    placement?: ImagePlacement;
    width?: number;
    height?: number;
}

const getPlotPoint = (position: XY, placement: ImagePlacement, width: number, height: number): XY => {
    switch (placement) {
        case ImagePlacement.CENTER:
            return (translate(position, { x: -width / 2, y: -height / 2 }))
        case ImagePlacement.TOP_LEFT:
            return position
    }
}

export const drawIcon = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    position: XY,
    params: IconParams,
): void => {
    const { placement = ImagePlacement.CENTER, width = 100, height = 100 } = params
    const plotPoint = getPlotPoint(position, placement, width, height)
    ctx.beginPath()


    drawingMethods.drawImage(
        ICONS[params.icon],
        ...s(plotPoint),
        width, height
    )
}