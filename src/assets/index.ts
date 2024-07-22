import coastlinesPng from "./coastlines.png"
import StrawHatIconPng from "./Straw_hat_icon.svg.png"
import repairPng from "./repair.png"
import captainHatPng from "./captain-hat.png"
import housePng from "./house.png"
import treesPng from "./trees.png"
import miscPng from "./misc.png"

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
const REPAIR: AssetData = { width: 100, height: 100, src: repairPng }
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

const assetParams = {
    coastlines,
    REPAIR,
    HOUSE,
    TREES,
    MISC,
} satisfies Record<string, AssetData>

export { assetParams, coastlinesPng, StrawHatIconPng, repairPng, captainHatPng, housePng }