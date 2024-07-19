import coastlinesPng from "./coastlines.png"
import StrawHatIconPng from "./Straw_hat_icon.svg.png"
import repairPng from "./repair.png"
import crossedSwordsPng from "./crossed-swords.png"
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
const CROSSED_SWORDS: AssetData = {
    width: 100, height: 100, src: crossedSwordsPng
}
const REPAIR: AssetData = { width: 100, height: 100, src: repairPng }
const HOUSE: AssetData = { width: 100, height: 100, src: housePng }
const TREES: AssetData = {
    width: 60, height: 80, src: treesPng, sprites: {
        cols: 3, rows: 4
    }
}
const MISC: AssetData = { width: 96, height: 128, src: miscPng }

const assetParams = {
    coastlines,
    CROSSED_SWORDS,
    REPAIR,
    HOUSE,
    TREES,
    MISC,
} satisfies Record<string, AssetData>

export { assetParams, coastlinesPng, StrawHatIconPng, repairPng, crossedSwordsPng, captainHatPng, housePng }