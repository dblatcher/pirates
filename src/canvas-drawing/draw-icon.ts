import { XY, translate } from "../lib/geometry";
import { OffsetDrawMethods } from "./drawWithOffSet";
import { s } from "./helpers";


const RED_CUTLASS = new Image(100, 100)
RED_CUTLASS.src = '/red-cutlass.png'
const BLACK_CUTLASS = new Image(100, 100)
BLACK_CUTLASS.src = '/black-cutlass.png'
const JOLLY_RODGER = new Image(100, 100)
JOLLY_RODGER.src = '/jolly-rodger.png'
const REPAIR = new Image(100, 100)
REPAIR.src = '/repair.png'

const ICONS = {
    RED_CUTLASS,
    BLACK_CUTLASS,
    JOLLY_RODGER,
    REPAIR,
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
    _ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    position: XY,
    params: IconParams,
): void => {
    const { placement = ImagePlacement.CENTER, width = 100, height = 100 } = params
    const plotPoint = getPlotPoint(position, placement, width, height)

    drawingMethods.drawImage(
        ICONS[params.icon],
        ...s(plotPoint),
        width, height
    )
}