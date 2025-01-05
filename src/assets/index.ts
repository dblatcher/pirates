import { AssetData } from "@dblatcher/sprite-canvas"
import captainHatPng from "./captain-hat.png"
import coastlinesPng from "./coastlines.png"
import eyePatch from "./eyepatch.svg"
import housePng from "./house.png"
import miscPng from "./misc.png"
import StrawHatIconPng from "./Straw_hat_icon.svg.png"
import treesPng from "./trees.png"


const coastlines: AssetData = {
    src: coastlinesPng,
}
const HOUSE: AssetData = { src: housePng }
const TREES: AssetData = {
    src: treesPng, sprites: {
        cols: 3, rows: 4
    }
}
const MISC: AssetData = {
    src: miscPng,
    sprites: {
        cols: 3, rows: 4
    }
}
const EYE_PATCH: AssetData = {
    src: eyePatch
}

const assetParams = {
    coastlines,
    HOUSE,
    TREES,
    MISC,
    EYE_PATCH,
} satisfies Record<string, AssetData>

export { assetParams, captainHatPng, coastlinesPng, eyePatch, housePng, StrawHatIconPng }
