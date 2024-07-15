import coastlinesPng from "./coastlines.png"
import StrawHatIconPng from "./Straw_hat_icon.svg.png"
import repairPng from "./repair.png"
import crossedSwordsPng from "./crossed-swords.png"
import captainHatPng from "./captain-hat.png"
import housePng from "./house.png"
import treesPng from "./trees.png"
import miscPng from "./misc.png"

const assetParams = {
    coastlines: {
        width: 200, height: 200, src: coastlinesPng
    },
    CROSSED_SWORDS: { width: 100, height: 100, src: crossedSwordsPng },
    REPAIR: { width: 100, height: 100, src: repairPng },
    HOUSE: { width: 100, height: 100, src: housePng },
    TREES: { width: 60, height: 80, src: treesPng },
    MISC: { width: 96, height: 128, src: miscPng },
}

export { assetParams, coastlinesPng, StrawHatIconPng, repairPng, crossedSwordsPng, captainHatPng, housePng }