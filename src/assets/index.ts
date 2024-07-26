import coastlinesPng from "./coastlines.png"
import StrawHatIconPng from "./Straw_hat_icon.svg.png"
import captainHatPng from "./captain-hat.png"
import housePng from "./house.png"
import treesPng from "./trees.png"
import miscPng from "./misc.png"
import eyePatch from "./eyepatch.svg"

type AssetData = {
    width: number, height: number, src: string,
    sprites?: {
        cols: number,
        rows: number,
    }
}

const coastlines: AssetData = {
    width: 200, height: 200, src: coastlinesPng,
}
const HOUSE: AssetData = { width: 100, height: 100, src: housePng }
const TREES: AssetData = {
    width: 60, height: 80, src: treesPng, sprites: {
        cols: 3, rows: 4
    }
}
const MISC: AssetData = {
    width: 96, height: 128, src: miscPng,
    sprites: {
        cols: 3, rows: 4
    }
}
const EYE_PATCH:AssetData = {
    width:50, height:50, src: eyePatch
}

const assetParams = {
    coastlines,
    HOUSE,
    TREES,
    MISC,
    EYE_PATCH,
} satisfies Record<string, AssetData>

export { assetParams, coastlinesPng, StrawHatIconPng, captainHatPng, housePng, eyePatch }